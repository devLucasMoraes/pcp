import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ResourceKeys } from '../../constants/ResourceKeys'
import {
  createOrdemProducao,
  CreateOrdemProducaoDTO,
  CreateOrdemProducaoResponse,
} from '../../http/ordem-producao/create-ordem-producao'
import { disableOrdemProducao } from '../../http/ordem-producao/disable-ordem-producao'
import {
  getAllOrdensProducao,
  GetAllOrdensProducaoResponse,
} from '../../http/ordem-producao/get-all-ordens-producao'
import {
  getOrdemProducao,
  GetOrdemProducaoResponse,
} from '../../http/ordem-producao/get-ordem-producao'
import {
  listOrdensProducao,
  ListOrdensProducaoResponse,
} from '../../http/ordem-producao/list-ordens-producao'
import {
  updateOrdemProducao,
  UpdateOrdemProducaoDTO,
} from '../../http/ordem-producao/update-ordem-producao'
import { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.ORDEM_PRODUCAO

export function useOrdemProducaoQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetOrdemProducaoResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getOrdemProducao(orgSlug, id),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<
        GetAllOrdensProducaoResponse[],
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllOrdensProducao(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListOrdensProducaoResponse>,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listOrdensProducao(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateOrdemProducaoResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateOrdemProducaoDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createOrdemProducao(orgSlug, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  const useUpdate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        void,
        AxiosError<ErrorResponse>,
        { id: string; orgSlug: string; data: UpdateOrdemProducaoDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) =>
        updateOrdemProducao(id, orgSlug, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  const useDisable = (
    mutationOptions?: Omit<
      UseMutationOptions<
        void,
        AxiosError<ErrorResponse>,
        { id: string; orgSlug: string }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug }) => disableOrdemProducao(id, orgSlug),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  return {
    useGetById,
    useListPaginated,
    useGetAll,
    useCreate,
    useUpdate,
    useDisable,
  }
}
