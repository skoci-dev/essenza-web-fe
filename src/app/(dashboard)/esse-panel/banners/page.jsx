'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'

import { getBanners, deleteBanner } from '@/services/banner'

import useSnackbar from '@/@core/hooks/useSnackbar'

import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'
import TableHeaderActions from '@/@core/components/table/HeaderActions'
import DialogBasic from '@/components/DialogBasic'
import BackdropLoading from '@/components/BackdropLoading'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const BannerPage = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 0, page_size: 10 })
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const actionsData = row => {
    return [
      {
        text: 'View',
        icon: <i className='ri-eye-line text-blue-500' />, // biru
        menuItemProps: {
          className: 'gap-2',
          onClick: () => router.push(`/esse-panel/banners/${row.original.id}`)
        }
      },
      {
        text: 'Edit',
        icon: <i className='ri-edit-box-line text-yellow-500' />, // kuning/oranye
        menuItemProps: {
          className: 'gap-2',
          onClick: () => router.push(`/esse-panel/banners/${row.original.id}/edit`)
        }
      },
      {
        text: 'Delete',
        icon: <i className='ri-delete-bin-line text-red-500' />, // merah
        menuItemProps: {
          className: 'gap-2',
          onClick: () => setDeleteIndex(row.original.id)
        }
      }
    ]
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('subtitle', {
        header: 'Subtitle',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('file', {
        header: 'Media',
        cell: info => {
          const fileUrl = info.getValue()

          if (!fileUrl)
            return (
              <div className='w-24 h-12 bg-gray-100 flex items-center justify-center rounded text-xs text-gray-400'>
                No Media
              </div>
            )

          const isVideo = fileUrl.match(/\.(mp4|webm|ogg|mov)$/i)

          return (
            <Box className='w-24 h-12 relative rounded overflow-hidden border'>
              {isVideo ? (
                <Box className='relative w-full h-full flex items-center justify-center bg-black'>
                  <video src={fileUrl} className='w-full h-full object-cover' muted />
                  <i className='ri-play-circle-fill absolute text-white text-xl opacity-80' />
                </Box>
              ) : (
                <img src={fileUrl} alt='Banner' className='w-full h-full object-cover' />
              )}
            </Box>
          )
        }
      }),
      columnHelper.accessor('link_url', {
        header: 'Link URL',
        cell: info => <Typography className='text-blue-600'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('order_no', {
        header: 'Order',
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

  const fetchBanner = async () => {
    const res = await getBanners(pagination)

    if (res?.data) {
      setData(res.data)
      setFilteredData(res.data)
    }
  }

  const confirmDelete = async () => {
    setLoading(true)

    try {
      const res = await deleteBanner(deleteIndex)

      if (res?.success) {
        success('Deleted successfully!')
        fetchBanner()
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
    fetchBanner()
  }, [])

  useEffect(() => {
    fetchBanner()
  }, [pagination])

  return (
    <>
      <Card>
        <CardHeader title='Banner Management' className='p-4' />
        <Divider />
        <TableHeaderActions
          searchPlaceholder='Search Banner'
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          addLabel='Add Banner'
          addHref='/esse-panel/banners/add'
          addColor='success'
        />
        <TableGeneric table={table} columns={columns} />
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
        title='Delete Banner'
        description='Are you sure to delete this banner?'
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default BannerPage
