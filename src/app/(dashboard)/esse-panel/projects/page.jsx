'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Chip, Card, CardHeader, Divider, TablePagination, Typography, Tooltip, Button } from '@mui/material'

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
import { deleteProject, getProjects } from '@/services/projects'
import TableHeaderActions from '@/@core/components/table/HeaderActions'
import { getTruncateText } from '@/utils/string'
import DialogBasic from '@/components/DialogBasic'
import BackdropLoading from '@/components/BackdropLoading'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const ProjectsPage = () => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [data, setData] = useState([])

  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    setIsDataLoading(true)

    try {
      const res = await getProjects()

      if (res?.data) {
        setData(res.data)
      }
    } catch (err) {
      error('Gagal memuat data proyek.')
      console.error(err)
    } finally {
      setIsDataLoading(false)
    }
  }, [error])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return

    setLoading(true)

    try {
      const res = await deleteProject(deleteId)

      if (res?.success) {
        success('Proyek berhasil dihapus!')

        fetchProjects()
      } else {
        error(res?.message || 'Gagal menghapus proyek!')
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan saat menghapus.')
      console.error(err)
    } finally {
      setLoading(false)
      setDeleteId(null)
    }
  }, [deleteId, fetchProjects, success, error])

  const actionsData = useCallback(
    row => [
      {
        text: 'View',
        icon: <i className='ri-eye-line text-blue-500' />,
        menuItemProps: {
          className: 'gap-2',
          onClick: () => router.push(`/esse-panel/projects/${row.original.id}`)
        }
      },
      {
        text: 'Edit',
        icon: <i className='ri-edit-box-line text-yellow-500' />,
        menuItemProps: {
          className: 'gap-2',
          onClick: () => router.push(`/esse-panel/projects/${row.original.id}/edit`)
        }
      },
      {
        text: 'Delete',
        icon: <i className='ri-delete-bin-line text-red-500' />,
        menuItemProps: {
          className: 'gap-2',

          onClick: () => setDeleteId(row.original.id)
        }
      }
    ],
    [router]
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info => (
          <Box sx={{ display: 'flex' }}>
            <Box
              component='img'
              src={info.getValue()}
              alt='Project'
              sx={{ width: 96, height: 48, objectFit: 'cover', borderRadius: 1 }}
            />
          </Box>
        ),
        enableSorting: false
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: info => (
          <Typography variant='body2' fontWeight={600}>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => {
          const fullText = info.getValue()

          return (
            <Tooltip title={fullText} arrow>
              <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Typography variant='body2' sx={{ fontSize: '0.875rem' }}>
                  {getTruncateText(fullText, 30)}
                </Typography>
              </Box>
            </Tooltip>
          )
        }
      }),
      columnHelper.accessor('location', {
        header: 'Location',
        cell: info => <Typography variant='body2'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: info => (
          <Typography color='text.secondary' variant='caption'>
            {info.getValue()}
          </Typography>
        )
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: info => {
          const isActive = info.getValue()

          return isActive ? (
            <Chip label='Active' size='small' color='success' variant='outlined' sx={{ borderRadius: 1 }} />
          ) : (
            <Chip label='Inactive' size='small' color='error' variant='outlined' sx={{ borderRadius: 1 }} />
          )
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <Box className='flex items-center gap-2'>
            <ActionMenu actions={actionsData(row)} />
          </Box>
        )
      })
    ],
    [actionsData]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 }
    }
  })

  return (
    <>
      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title='Project Management' sx={{ p: 4 }} />
        <Divider />
        <TableHeaderActions
          searchPlaceholder='Search Project'
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          addLabel='Add Project'
          addHref='/esse-panel/projects/add'
          addColor='success'
        />

        <BackdropLoading open={isDataLoading} />
        <TableGeneric table={table} />
        <TablePagination
          component='div'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => {
            const newSize = Number(e.target.value)

            table.setPageSize(newSize)
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>

      <DialogBasic
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onSubmit={handleConfirmDelete}
        title='Delete Project'
        description='Apakah Anda yakin ingin menghapus proyek ini?'
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ProjectsPage
