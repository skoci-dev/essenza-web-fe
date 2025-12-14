'use client'

import { useMemo, useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import TableGeneric from '@/@core/components/table/Generic'
import TableHeaderActions from '@/@core/components/table/HeaderActions'

import { getPages } from '@/services/pages'
import { formatDateToCustomStringNative } from '@/utils/helpers'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const ActivityLogPage = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 0, page_size: 10 })
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo(
    () => [
      columnHelper.accessor('action', {
        header: 'Action',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('action_display', {
        header: 'Action Display',
        cell: info => <Typography className='text-gray-500 text-sm'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('entity', {
        header: 'Entity',
        cell: info => (
          <Box>
            <Typography>{info.getValue()}</Typography>
            <Typography className='text-gray-500 text-sm'>{info.getValue()}</Typography>
          </Box>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('ip_address', {
        header: 'IP Address',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: info => <Typography>{formatDateToCustomStringNative(info.getValue())}</Typography>
      })
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  const fetchLog = async () => {
    // Please change with Log Service
    const res = await getPages(pagination)

    if (res?.data) {
      setData(res.data)
      setFilteredData(res.data)
    }
  }

  useEffect(() => {
    fetchLog()
  }, [])

  useEffect(() => {
    fetchLog()
  }, [pagination])

  return (
    <>
      <Card>
        <CardHeader title='My Activity Log' className='p-4' />
        <Divider />
        <TableHeaderActions
          searchPlaceholder='Search Log'
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          useAddButton={false}
        />
        <TableGeneric table={table} />
        <TablePagination
          component='div'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize || 10}
          page={table.getState().pagination.pageIndex || 0}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
            setPagination(prev => ({ ...prev, page }))
          }}
          onRowsPerPageChange={e => {
            const newSize = Number(e.target.value)

            table.setPageSize(newSize)
            setPagination(prev => ({
              ...prev,
              page_size: newSize,
              page: 0
            }))
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  )
}

export default ActivityLogPage
