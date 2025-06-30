import { Member } from '@/domain/entities/Member'
import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { CreateOrdemProducaoDTO } from '@/http/routes/ordem-producao/create-ordem-producao'

export const createOrdemProducaoUseCase = {
  async execute(
    dto: CreateOrdemProducaoDTO,
    membership: Member,
  ): Promise<OrdemProducao> {
    return repository.ordemProducao.manager.transaction(async (manager) => {
      const existingOrdemProducao = await manager.findOne(OrdemProducao, {
        where: {
          cod: dto.cod,
          organizationId: membership.organization.id,
        },
        withDeleted: true,
        select: ['id', 'cod', 'deletedAt'],
      })

      if (existingOrdemProducao) {
        throw new BadRequestError(
          existingOrdemProducao.deletedAt
            ? `OrdemProducao "${existingOrdemProducao.cod}" desativado`
            : `OrdemProducao "${existingOrdemProducao.cod}" já cadastrado`,
        )
      }

      const ordemProducaoToSave = repository.ordemProducao.create({
        cod: dto.cod,
        descricao: dto.descricao,
        tiragem: dto.tiragem,
        valorServico: dto.valorServico,
        nomeCliente: dto.nomeCliente,
        organizationId: membership.organization.id,
        createdBy: membership.user.id,
        updatedBy: membership.user.id,
      })

      const ordemProducao = await manager.save(ordemProducaoToSave)

      return ordemProducao
    })
  },
}
