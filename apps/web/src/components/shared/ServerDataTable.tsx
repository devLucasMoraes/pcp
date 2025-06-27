import { alpha, Box, Card, styled } from '@mui/material'
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

const PAGE_SIZE_KEY = 'dataTablePageSize'
const DEFAULT_PAGE_SIZE = 10
const ALLOWED_SIZES = [5, 10, 25, 50, 100]

const StyledDataGrid = styled(DataGrid)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark'
  return {
    border: 'none',
    backgroundColor: isDark
      ? theme.palette.background.default
      : theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.5)
        : theme.palette.grey[100],
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiDataGrid-columnHeader': {
      '&:focus, &:focus-within': { outline: 'none' },
    },
    '& .MuiDataGrid-cell': {
      borderColor: theme.palette.divider,
      '&:focus, &:focus-within': { outline: 'none' },
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, isDark ? 0.1 : 0.05),
        cursor: 'pointer',
      },
    },
    '& .MuiDataGrid-footer': {
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundColor: isDark
        ? alpha(theme.palette.background.paper, 0.5)
        : theme.palette.grey[100],
    },
    '& .MuiDataGrid-virtualScroller': {
      backgroundColor: isDark
        ? theme.palette.background.default
        : theme.palette.grey[50],
    },
  }
})

const getPageSize = (): number => {
  try {
    const savedSize = localStorage.getItem(PAGE_SIZE_KEY)
    const parsedSize = savedSize ? parseInt(savedSize, 10) : DEFAULT_PAGE_SIZE
    return ALLOWED_SIZES.includes(parsedSize) ? parsedSize : DEFAULT_PAGE_SIZE
  } catch {
    return DEFAULT_PAGE_SIZE
  }
}

interface ServerDataTableProps {
  isLoading: boolean
  columns: GridColDef[]
  rows?: GridValidRowModel[]
  totalRowCount?: number
  paginationModel: {
    page: number
    pageSize: number
  }
  setPaginationModel: Dispatch<
    SetStateAction<{
      page: number
      pageSize: number
    }>
  >
}

export const ServerDataTable = ({
  columns,
  rows,
  totalRowCount,
  setPaginationModel,
  paginationModel,
  isLoading,
}: ServerDataTableProps) => {
  const [rowCountState, setRowCountState] = useState(totalRowCount || 0)

  useEffect(() => {
    setRowCountState(totalRowCount ?? rowCountState)
  }, [totalRowCount, rowCountState])

  useEffect(() => {
    const savedPageSize = getPageSize()
    if (savedPageSize !== paginationModel.pageSize) {
      setPaginationModel((prev) => ({ ...prev, pageSize: savedPageSize }))
    }
  }, [paginationModel.pageSize, setPaginationModel])

  const handlePaginationModelChange = (newModel: {
    page: number
    pageSize: number
  }) => {
    try {
      localStorage.setItem(PAGE_SIZE_KEY, newModel.pageSize.toString())
    } catch (error) {
      console.warn('Failed to save page size:', error)
    }
    setPaginationModel(newModel)
  }

  return (
    <Box display="grid" component={Card} elevation={9}>
      <StyledDataGrid
        autoHeight
        rows={rows ?? []}
        columns={columns}
        pageSizeOptions={ALLOWED_SIZES}
        disableRowSelectionOnClick
        rowCount={rowCountState}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={handlePaginationModelChange}
        loading={isLoading}
      />
    </Box>
  )
}
