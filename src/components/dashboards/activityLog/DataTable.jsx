'use client'

import { useMemo, useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

import { rankItem } from '@tanstack/match-sorter-utils'
import { createColumnHelper, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table'

import useSnackbar from '@/@core/hooks/useSnackbar'

import TableGeneric from '@/@core/components/table/Generic'
import TableHeaderActions from '@/@core/components/table/HeaderActions'

import BackdropLoading from '@/components/BackdropLoading'
import { formatDateToCustomStringNative } from '@/utils/helpers'
import { getActivityColor } from '@/utils/colors'
import { handleApiResponse } from '@/utils/handleApiResponse'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const ActivityLogDataTable = ({ fetchActivityLogAction }) => {
  const [data, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [pagination, setPagination] = useState({ page: 1, page_size: 10 })
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  // Fetch activity logs with server-side filtering
  const fetchActivityLogs = async (page, pageSize, searchQuery) => {
    setLoading(true)

    try {
      await handleApiResponse(() => fetchActivityLogAction({ page: page, page_size: pageSize, search: searchQuery }), {
        error,
        onSuccess: ({ data: responseData, meta: { pagination: paginationMeta } }) => {
          setData(responseData)
          setTotalCount(paginationMeta.total_items)
        }
      })
    } catch (err) {
      setData([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('actor_name', {
        header: 'Actor',
        cell: info => (
          <div className='flex flex-col'>
            <Typography className='font-medium'>{info.getValue()}</Typography>
            <Typography className='text-gray-500 text-xs'>{info.row.original.actor_identifier}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: info => (
          <Chip
            label={info.getValue().toUpperCase()}
            size='small'
            color={getActivityColor(info.getValue())}
            variant='tonal'
            className='self-start rounded'
          />
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => <Typography className='text-sm'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('ip_address', {
        header: 'IP Address',
        cell: info => <Typography className='text-gray-500 text-sm font-mono'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Timestamp',
        cell: info => <Typography className='text-sm'>{formatDateToCustomStringNative(info.getValue())}</Typography>
      })
    ],
    []
  )

  const table = useReactTable({
    data: data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    manualFiltering: true,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pagination.page_size),
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      onRowClick: row => {
        router.push(`/esse-panel/activity-log/${row.id}`)
      }
    }
  })

  useEffect(() => {
    fetchActivityLogs(pagination.page, pagination.page_size, globalFilter)
  }, [pagination.page, pagination.page_size])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }))
      fetchActivityLogs(1, pagination.page_size, globalFilter)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [globalFilter])

  return (
    <>
      <Card>
        <CardHeader title='Activity Log' className='p-4' />
        <Divider />
        <TableHeaderActions
          searchPlaceholder='Search Activity Log'
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
        />
        <TableGeneric table={table} />
        <TablePagination
          component='div'
          count={totalCount}
          rowsPerPage={pagination.page_size}
          page={pagination.page - 1}
          onPageChange={(_, page) => {
            setPagination(prev => ({ ...prev, page: page + 1 }))
          }}
          onRowsPerPageChange={e => {
            const newSize = Number(e.target.value)

            setPagination({
              page: 1,
              page_size: newSize
            })
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ActivityLogDataTable
