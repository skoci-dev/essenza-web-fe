'use client'

import { useMemo, useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'
import TableHeaderActions from '@/@core/components/table/HeaderActions'
import BackdropLoading from '@/components/BackdropLoading'

import useSnackbar from '@/@core/hooks/useSnackbar'
import DialogBasic from '@/components/DialogBasic'
import { deleteDistributor, getDistributors } from '@/services/distributors'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const DistributorsPage = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 0, page_size: 10 })
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const actionsData = row => [
    {
      text: 'View',
      icon: <i className='ri-eye-line text-blue-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => router.push(`/esse-panel/distributors/${row.original.id}`)
      }
    },
    {
      text: 'Edit',
      icon: <i className='ri-edit-box-line text-yellow-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => router.push(`/esse-panel/distributors/${row.original.id}/edit`)
      }
    },
    {
      text: 'Delete',
      icon: <i className='ri-delete-bin-line text-red-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => setDeleteIndex(row.original.id)
      }
    }
  ]

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Distributor Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => <Typography className='text-blue-500'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: info => (
          <Tooltip title={info.getValue()}>
            <Typography className='truncate w-48'>{info.getValue()}</Typography>
          </Tooltip>
        )
      }),
      columnHelper.accessor('gmap_link', {
        header: 'Gmaps Link',
        cell: info => (
          <a href={info.getValue()} target='_blank'>
            <Typography className='truncate w-24'>{info.getValue()}</Typography>
          </a>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <ActionMenu actions={actionsData(row)} />
          </div>
        )
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

  const fetchDistributor = async () => {
    const res = await getDistributors(pagination)

    if (res?.data) {
      setData(res.data)
      setFilteredData(res.data)
    }
  }

  const confirmDelete = async () => {
    setLoading(true)

    try {
      const res = await deleteDistributor(deleteIndex)

      if (res?.success) {
        success('Deleted successfully!')
        fetchDistributor()
      }
    } catch {
      error('Delete failed!')
    } finally {
      setDeleteIndex(null)

      setLoading(false)
    }

    setDeleteIndex(null)
  }

  useEffect(() => {
    fetchDistributor()
  }, [])

  useEffect(() => {
    fetchDistributor()
  }, [pagination])

  return (
    <>
      <Card>
        <CardHeader title='Distributor Management' className='p-4' />
        <Divider />
        <TableHeaderActions
          searchPlaceholder='Search Distributor'
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          addLabel='Add Distributor'
          addHref='/esse-panel/distributors/add'
          addColor='success'
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
      <DialogBasic
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onSubmit={confirmDelete}
        title='Delete Distributor'
        description='Are you sure to delete this distributor?'
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default DistributorsPage
