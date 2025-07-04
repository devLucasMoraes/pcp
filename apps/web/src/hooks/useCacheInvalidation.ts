// useCacheInvalidation.ts
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { ResourceKeys } from '../constants/ResourceKeys'
import { useSocket } from './useSocket'

export function useCacheInvalidation() {
  const queryClient = useQueryClient()
  const { subscribe } = useSocket()

  useEffect(() => {
    const unsubOrganization = subscribe(
      'invalidateOrganizationCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          organizationId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.ORGANIZATION, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubUser = subscribe('invalidateUserCache', (data: unknown) => {
      const eventData = data as {
        operation: string
        orgSlug: string
        userId: string
      }

      const { orgSlug } = eventData

      queryClient.invalidateQueries({
        queryKey: [ResourceKeys.USER, orgSlug],
        refetchType: 'active',
      })
    })

    const unsubOcorrencia = subscribe(
      'invalidateOcorrenciaCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          ocorrenciaId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.OCORRENCIA, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubOperador = subscribe(
      'invalidateOperadorCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          operadorId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.OPERADOR, orgSlug],
          refetchType: 'active',
        })
      },
    )

    const unsubRotina = subscribe('invalidateRotinaCache', (data: unknown) => {
      const eventData = data as {
        operation: string
        orgSlug: string
        rotinaId: string
      }

      const { orgSlug } = eventData

      queryClient.invalidateQueries({
        queryKey: [ResourceKeys.ROTINA_TAREFAS, orgSlug],
        refetchType: 'active',
      })
    })

    const unsubEquipamento = subscribe(
      'invalidateEquipamentoCache',
      (data: unknown) => {
        const eventData = data as {
          operation: string
          orgSlug: string
          equipamentoId: string
        }

        const { orgSlug } = eventData

        queryClient.invalidateQueries({
          queryKey: [ResourceKeys.EQUIPAMENTO, orgSlug],
          refetchType: 'active',
        })
      },
    )

    // Retorna função de limpeza para remover todos os listeners
    return () => {
      unsubOrganization()
      unsubUser()
      unsubOcorrencia()
      unsubOperador()
      unsubRotina()
      unsubEquipamento()
    }
  }, [queryClient, subscribe])
}
