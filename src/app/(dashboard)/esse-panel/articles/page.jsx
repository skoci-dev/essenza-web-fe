'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CardHeader from '@mui/material/CardHeader'
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
import { deleteArticle, getArticles } from '@/services/article'

import { formatDateToCustomStringNative } from '@/utils/helpers'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const ArticlePage = () => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()

  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 0, page_size: 10 })
  const [isDataLoading, setIsDataLoading] = useState(true)

  const fetchArticle = useCallback(async () => {
    setIsDataLoading(true)

    try {
      const res = await getArticles(pagination)

      if (res?.data) {
        setData(res.data)
        setFilteredData(res.data)
      }
    } catch (err) {
      error('Gagal memuat data Artikel.')
      console.error(err)
    } finally {
      setIsDataLoading(false)
    }
  }, [error])

  useEffect(() => {
    fetchArticle()
  }, [fetchArticle])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteId) return

    setLoading(true)

    try {
      const res = await deleteArticle(deleteId)

      if (res?.success) {
        success('Artikel berhasil dihapus!')

        fetchArticle()
      } else {
        error(res?.message || 'Gagal menghapus Artikel!')
      }
    } catch (err) {
      error(err.message || 'Terjadi kesalahan saat menghapus.')
      console.error(err)
    } finally {
      setLoading(false)
      setDeleteId(null)
    }
  }, [deleteId, fetchArticle, success, error])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const actionsData = row => [
    {
      text: 'View',
      icon: <i className='ri-eye-line text-blue-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => router.push(`/esse-panel/articles/${row.original.id}`)
      }
    },
    {
      text: 'Edit',
      icon: <i className='ri-edit-box-line text-yellow-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => router.push(`/esse-panel/articles/${row.original.id}/edit`)
      }
    },
    {
      text: 'Delete',
      icon: <i className='ri-delete-bin-line text-red-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => {
          setDeleteId(row.original.id)
        }
      }
    }
  ]

  const columns = useMemo(
    () => [
      columnHelper.accessor('thumbnail', {
        header: 'Title',
        cell: ({ row }) => {
          const data = row.original
          const thumbnail = data.thumbnail
          const title = data.title || '-'
          const slug = data.slug || ''
          const isHighlight = data.is_highlighted || data.is_highlighted

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component='img'
                src={thumbnail || '/images/broken-image.png'}
                alt={title}
                onError={e => {
                  e.target.src = '/images/broken-image.png'
                }}
                sx={{ width: 96, height: 48, objectFit: 'cover', borderRadius: 1 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: isHighlight ? 120 : 200
                    }}
                  >
                    {title}
                  </Typography>
                  {isHighlight && (
                    <Chip
                      label='Highlight'
                      color='primary'
                      size='small'
                      variant='filled'
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 200
                  }}
                >
                  {slug}
                </Typography>
              </Box>
            </Box>
          )
        }
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
        cell: info => {
          const rawValue = info.getValue()
          let tags = []

          if (typeof rawValue === 'string' && rawValue.trim() !== '') {
            tags = rawValue
              .split(',')
              .map(tag => tag.trim())
              .filter(tag => tag.length > 0)
          } else if (Array.isArray(rawValue)) {
            tags = rawValue
          }

          const max = 3
          const visibleTags = tags.slice(0, max)
          const extraCount = tags.length - max

          return (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1,
                maxWidth: 250
              }}
            >
              {visibleTags.map(
                (tag, idx) =>
                  (typeof tag === 'string' || typeof tag === 'number') && (
                    <Chip key={idx} label={tag} size='small' color='info' variant='tonal' />
                  )
              )}

              {extraCount > 0 && (
                <Typography variant='caption' color='text.secondary' sx={{ ml: 0.5, fontSize: '0.75rem' }}>
                  ... +{extraCount} more
                </Typography>
              )}
            </Box>
          )
        }
      }),
      columnHelper.accessor('author', {
        header: 'Author',
        cell: info => <Typography className='truncate max-w-[200px]'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Created at',
        cell: info => (
          <Typography className='truncate max-w-[200px]'>{formatDateToCustomStringNative(info.getValue())}</Typography>
        )
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated at',
        cell: info => (
          <Typography className='truncate max-w-[200px]'>{formatDateToCustomStringNative(info.getValue())}</Typography>
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
    [actionsData]
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

  return (
    <>
      <Card>
        <CardHeader title='Article Management' className='p-4' />
        <Divider />
        <TableHeaderActions
          searchPlaceholder='Search Article'
          searchValue={globalFilter ?? ''}
          onSearchChange={setGlobalFilter}
          addLabel='Add Article'
          addHref='/esse-panel/articles/add'
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
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onSubmit={handleConfirmDelete}
        title='Delete Article'
        description='Apakah Anda yakin ingin menghapus artikel ini?'
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ArticlePage
