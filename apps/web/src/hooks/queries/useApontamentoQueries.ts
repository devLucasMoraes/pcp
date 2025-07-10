import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
  getTotaisProducao,
  GetTotaisProducaoResponse,
} from '../..//http/apontamento/get-totais-producao'
import { ResourceKeys } from '../../constants/ResourceKeys'
import {
  createApontamento,
  CreateApontamentoDTO,
  CreateApontamentoResponse,
} from '../../http/apontamento/create-apontamento'
import {
  createMultipleApontamentos,
  CreateMultipleApontamentosDTO,
  CreateMultipleApontamentosResponse,
} from '../../http/apontamento/create-multiple-apontamentos'
import { disableApontamento } from '../../http/apontamento/disable-apontamento'
import {
  getAllApontamentos,
  GetAllApontamentosResponse,
} from '../../http/apontamento/get-all-apontamentos'
import {
  getApontamento,
  GetApontamentoResponse,
} from '../../http/apontamento/get-apontamento'
import {
  listApontamentos,
  ListApontamentosResponse,
} from '../../http/apontamento/list-apontamentos'
import {
  updateApontamento,
  UpdateApontamentoDTO,
} from '../../http/apontamento/update-apontamento'
import { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.APONTAMENTO

export function useApontamentoQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetApontamentoResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getApontamento(orgSlug, id),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetAllApontamentosResponse[], AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllApontamentos(orgSlug),
    })
  }

  const useTotaisProducao = (
    orgSlug: string,
    equipamentoId: string,
    dataInicio: Date,
    dataFim: Date,
    queryOptions?: Omit<
      UseQueryOptions<GetTotaisProducaoResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, equipamentoId, dataInicio, dataFim],
      queryFn: () =>
        getTotaisProducao(orgSlug, equipamentoId, dataInicio, dataFim),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<
        Page<ListApontamentosResponse>,
        AxiosError<ErrorResponse>
      >,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listApontamentos(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateApontamentoResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateApontamentoDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createApontamento(orgSlug, data),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] })
        mutationOptions?.onSuccess?.(data, variables, context)
      },
      onError: (error, variables, context) => {
        mutationOptions?.onError?.(error, variables, context)
      },
    })
  }

  const useCreateBulk = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateMultipleApontamentosResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateMultipleApontamentosDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) =>
        createMultipleApontamentos(orgSlug, data),
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
        { id: string; orgSlug: string; data: UpdateApontamentoDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) =>
        updateApontamento(id, orgSlug, data),
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
      mutationFn: ({ id, orgSlug }) => disableApontamento(id, orgSlug),
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
    useCreateBulk,
    useUpdate,
    useDisable,
    useTotaisProducao,
  }
}
