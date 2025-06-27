export type Page<T> = {
  content: T[] // Conteúdo da página
  totalPages: number // Número total de páginas
  totalElements: number // Número total de elementos
  size: number // Tamanho da página
  number: number // Número da página atual
  numberOfElements: number // Número de elementos na página atual
  empty: boolean // Indica se a página está vazia
}

export interface PageParams {
  page?: number // Número da página solicitada
  size?: number // Tamanho da página solicitada
  sort?: string | string[] // Critérios de ordenação
  filters?: Record<string, unknown> // Filtros a serem aplicados
}

export interface ErrorResponse {
  message: string
}
