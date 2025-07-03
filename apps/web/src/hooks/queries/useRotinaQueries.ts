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
  createRotina,
  CreateRotinaResponse,
  CreateRotinaTarefasDTO,
} from '../../http/rotina-tarefas/create-rotina'
import { disableRotina } from '../../http/rotina-tarefas/disable-rotina'
import {
  getAllRotinas,
  GetAllRotinasResponse,
} from '../../http/rotina-tarefas/get-all-rotinas'
import {
  getRotina,
  GetRotinaResponse,
} from '../../http/rotina-tarefas/get-rotina'
import {
  listRotinas,
  ListRotinasResponse,
} from '../../http/rotina-tarefas/list-rotinas'
import {
  updateRotina,
  UpdateRotinaDTO,
} from '../../http/rotina-tarefas/update-ocorrencia'
import { ErrorResponse, Page, PageParams } from '../../types'

const resourceKey = ResourceKeys.ROTINA_TAREFAS

export function useRotinaQueries() {
  const queryClient = useQueryClient()
  const useGetById = (
    id: string,
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetRotinaResponse, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, id],
      queryFn: () => getRotina(orgSlug, id),
    })
  }

  const useGetAll = (
    orgSlug: string,
    queryOptions?: Omit<
      UseQueryOptions<GetAllRotinasResponse[], AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug],
      queryFn: () => getAllRotinas(orgSlug),
    })
  }

  const useListPaginated = (
    orgSlug: string,
    params: PageParams = {},
    queryOptions?: Omit<
      UseQueryOptions<Page<ListRotinasResponse>, AxiosError<ErrorResponse>>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    const { page = 0, size = 20, sort = 'updatedAt,desc' } = params

    return useQuery({
      ...queryOptions,
      queryKey: [resourceKey, orgSlug, 'paginated', page, size, sort],
      queryFn: () => listRotinas(orgSlug, { page, size, sort }),
    })
  }

  const useCreate = (
    mutationOptions?: Omit<
      UseMutationOptions<
        CreateRotinaResponse,
        AxiosError<ErrorResponse>,
        { orgSlug: string; data: CreateRotinaTarefasDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ orgSlug, data }) => createRotina(orgSlug, data),
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
        { id: string; orgSlug: string; data: UpdateRotinaDTO }
      >,
      'mutationFn'
    >,
  ) => {
    return useMutation({
      ...mutationOptions,
      mutationFn: ({ id, orgSlug, data }) => updateRotina(id, orgSlug, data),
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
      mutationFn: ({ id, orgSlug }) => disableRotina(id, orgSlug),
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
