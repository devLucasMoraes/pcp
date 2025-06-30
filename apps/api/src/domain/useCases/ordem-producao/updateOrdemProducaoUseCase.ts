import { Member } from '@/domain/entities/Member'
import { OrdemProducao } from '@/domain/entities/OrdemProducao'
import { repository } from '@/domain/repositories'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { UpdateOrdemProducaoDTO } from '@/http/routes/ordem-producao/update-ordem-producao'

export const updateOrdemProducaoUseCase = {
  async execute(
    id: string,
    dto: UpdateOrdemProducaoDTO,
    membership: Member,
  ): Promise<OrdemProducao> {
    return repository.ordemProducao.manager.transaction(async (manager) => {
      const existingOrdemProducao = await manager.findOne(OrdemProducao, {
        where: { id },
        select: ['id', 'cod'],
      })

      if (!existingOrdemProducao) {
        throw new BadRequestError('Ordem de produção não encontrada')
      }

      if (dto.cod !== existingOrdemProducao.cod) {
        const ordemProducaoComMesmoNome = await manager.findOne(OrdemProducao, {
          where: {
            cod: dto.cod,
            organizationId: membership.organization.id,
          },
          withDeleted: true,
          select: ['id', 'cod', 'deletedAt'],
        })

        if (ordemProducaoComMesmoNome) {
          throw new BadRequestError(
            ordemProducaoComMesmoNome.deletedAt
              ? `OrdemProducao "${ordemProducaoComMesmoNome.cod}" desativado`
              : `OrdemProducao "${ordemProducaoComMesmoNome.cod}" já cadastrado`,
          )
        }
      }

      manager.merge(OrdemProducao, existingOrdemProducao, {
        cod: dto.cod,
        descricao: dto.descricao,
        tiragem: dto.tiragem,
        valorServico: dto.valorServico,
        nomeCliente: dto.nomeCliente,
        updatedBy: membership.user.id,
      })

      return manager.save(existingOrdemProducao)
    })
  },
}
