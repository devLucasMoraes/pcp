import { useState } from 'react'

import { GetOrganizationsResponse } from '../http/orgs/get-organizations'

export const useCurrentOrg = () => {
  const [currentOrg, setCurrentOrg] = useState<GetOrganizationsResponse | null>(
    () => {
      const savedOrg = localStorage.getItem('selectedOrg')
      return savedOrg ? JSON.parse(savedOrg) : null
    },
  )

  const updateCurrentOrg = (org: GetOrganizationsResponse) => {
    localStorage.setItem('selectedOrg', JSON.stringify(org))
    setCurrentOrg(org)
  }

  return { currentOrg, updateCurrentOrg }
}
