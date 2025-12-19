'use client'

// React Imports
import { useState, useMemo, useEffect, useCallback } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { getArticles } from '@/services/article'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Helper functions
const truncateText = (text, maxLength = 60) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getArticleStatus = (isActive, hasPublishedDate) => {
  if (isActive && hasPublishedDate) {
    return { status: 'Published', color: 'success' }
  }

  return { status: 'Draft', color: 'default' }
}

const columnHelper = createColumnHelper()

const OverviewTable = () => {
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 5,
    total_pages: 0,
    total_items: 0,
    has_next: false,
    has_previous: false
  })

  const { lang: locale } = useParams()

  const fetchArticles = useCallback(async (page = 1, perPage = 5) => {
    setLoading(true)

    try {
      const params = {
        page,
        page_size: perPage
      }

      await handleApiResponse(() => getArticles(params), {
        onSuccess: ({ data, meta: { pagination: paginationData } }) => {
          setData(data)
          setPagination(paginationData)
        }
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Judul',
        cell: ({ row }) => {
          const { title, slug } = row.original

          return (
            <Typography
              component={Link}
              target='_blank'
              href={getLocalizedUrl(`/news/${slug}`, locale)}
              className='font-medium hover:text-primary'
              color='text.primary'
              title={title}
            >
              {truncateText(title)}
            </Typography>
          )
        }
      }),
        columnHelper.accessor('author', {
          header: 'Penulis',
          cell: ({ row }) => <Typography className='text-sm'>{row.original.author || '-'}</Typography>
        }),
        columnHelper.accessor('tags', {
          header: 'Tags',
          cell: ({ row }) => {
            const tags =
              row.original.tags
                ?.split(',')
                .map(t => t.trim())
                .filter(t => t)
                .slice(0, 2) || []

            return (
              <div className='flex gap-1 flex-wrap'>
                {tags.length > 0 ? (
                  tags.map((tag, index) => <Chip key={index} label={tag} size='small' variant='outlined' />)
                ) : (
                  <Typography className='text-sm text-textSecondary'>-</Typography>
                )}
              </div>
            )
          }
        }),
        columnHelper.accessor('published_at', {
          header: 'Tanggal Publikasi',
          cell: ({ row }) => {
            const { is_active, published_at } = row.original

            if (!is_active || !published_at) {
              return <Typography className='text-sm text-textSecondary'>-</Typography>
            }

            return <Typography className='text-sm'>{formatDate(published_at)}</Typography>
          }
        }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: ({ row }) => {
          const { is_active, published_at } = row.original
          const { status, color } = getArticleStatus(is_active, published_at)

          return <Chip variant='tonal' label={status} size='small' color={color} />
        }
      })
    ],
    [locale]
  )

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    manualPagination: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <Card>
      <CardHeader title='Daftar Artikel' />
      <div className='overflow-x-auto'>
        {loading ? (
          <Box className='flex items-center justify-center p-10'>
            <CircularProgress />
          </Box>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='ri-arrow-up-s-line text-xl' />,
                            desc: <i className='ri-arrow-down-s-line text-xl' />
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    Tidak ada data
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        )}
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        className='border-bs'
        count={pagination.total_items}
        rowsPerPage={pagination.per_page}
        page={pagination.current_page - 1}
        onPageChange={(_, page) => {
          fetchArticles(page + 1, pagination.per_page)
        }}
        onRowsPerPageChange={e => {
          const newPerPage = Number(e.target.value)

          fetchArticles(1, newPerPage)
        }}
      />
    </Card>
  )
}

export default OverviewTable
