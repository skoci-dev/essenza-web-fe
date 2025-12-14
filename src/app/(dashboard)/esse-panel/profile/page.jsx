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
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import useSnackbar from '@/@core/hooks/useSnackbar'

import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'
import TableHeaderActions from '@/@core/components/table/HeaderActions'

import DialogBasic from '@/components/DialogBasic'
import BackdropLoading from '@/components/BackdropLoading'
import { deletePage, getPages } from '@/services/pages'
import { formatDateToCustomStringNative } from '@/utils/helpers'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const ProfilePage = () => {
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
        onClick: () => router.push(`/esse-panel/pages/${row.original.id}`)
      }
    },
    {
      text: 'Edit',
      icon: <i className='ri-edit-box-line text-yellow-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => router.push(`/esse-panel/pages/${row.original.id}/edit`)
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
      columnHelper.accessor('title', {
        header: 'Title',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: info => <Typography className='text-gray-500 text-sm'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('template', {
        header: 'Template',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: info => {
          const isActive = info.getValue()

          return isActive ? (
            <Chip label='Active' size='small' color='success' variant='tonal' className='self-start rounded' />
          ) : (
            <Chip label='Inactive' size='small' color='error' variant='tonal' className='self-start rounded' />
          )
        }
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: info => <Typography>{formatDateToCustomStringNative(info.getValue())}</Typography>
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated',
        cell: info => <Typography>{formatDateToCustomStringNative(info.getValue())}</Typography>
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

  const fetchPage = async () => {
    const res = await getPages(pagination)

    if (res?.data) {
      setData(res.data)
      setFilteredData(res.data)
    }
  }

  const confirmDelete = async () => {
    setLoading(true)

    try {
      const res = await deletePage(deleteIndex)

      if (res?.success) {
        success('Deleted successfully!')
        fetchPage()
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
    fetchPage()
  }, [])

  useEffect(() => {
    fetchPage()
  }, [pagination])

  return (
    <>
      <Card>
        <CardHeader title='Pages Management' className='p-4' />
        <Divider />
        <TableHeaderActions
          searchPlaceholder='Search Page'
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          addLabel='Add Page'
          addHref='/esse-panel/pages/add'
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
        title='Delete Page'
        description='Are you sure to delete this Page?'
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ProfilePage
