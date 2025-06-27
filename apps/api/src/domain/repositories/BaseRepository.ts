import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm'

export type Page<T> = {
  content: T[] // Conteúdo da página
  totalPages: number // Número total de páginas
  totalElements: number // Número total de elementos
  size: number // Tamanho da página
  number: number // Número da página atual
  numberOfElements: number // Número de elementos na página atual
  empty: boolean // Indica se a página está vazia
}

export interface PageRequest {
  page?: number // Número da página solicitada
  size?: number // Tamanho da página solicitada
  sort?: string | string[] // Critérios de ordenação
  filters?: Record<string, unknown> // Filtros a serem aplicados
}

export abstract class BaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  protected buildPaginationOptions(pageRequest: PageRequest = {}) {
    const page = Number(pageRequest.page) || 0
    const size = Number(pageRequest.size) || 20

    const order: FindOptionsOrder<T> = {} // Inicializa a ordem de ordenação
    const sortFields = pageRequest.sort
      ? Array.isArray(pageRequest.sort)
        ? pageRequest.sort
        : [pageRequest.sort]
      : [] // Converte sort para um array de strings

    // Preenche o objeto de ordenação com os campos e direções
    sortFields.forEach((sortField) => {
      const [field, direction] = sortField.split(',')
      Object.assign(order, {
        [field]: (direction || 'ASC').toUpperCase() as 'ASC' | 'DESC',
      })
    })

    return { page, size, order, hasSort: sortFields.length > 0 } // Retorna as opções de paginação
  }

  async paginate(
    pageRequest: PageRequest = {},
    where?: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<Page<T>> {
    const { page, size, order } = this.buildPaginationOptions(pageRequest)

    const findOptions = {
      where,
      order,
      skip: page * size,
      take: size,
      relations,
    }

    const [content, totalElements] = await this.findAndCount(findOptions)

    const totalPages = Math.ceil(totalElements / size)
    const numberOfElements = content.length

    return {
      content,
      totalPages,
      totalElements,
      size,
      number: page,
      numberOfElements,
      empty: numberOfElements === 0,
    }
  }
}
