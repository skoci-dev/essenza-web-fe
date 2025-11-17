'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import TableHeaderActions from '@/@core/components/table/HeaderActions'
import DialogBasic from '@/components/DialogBasic'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const getAvatar = params => {
  const { avatar, title } = params

  if (avatar) {
    return <CustomAvatar src={avatar} skin='light' size={34} />
  } else {
    return (
      <CustomAvatar skin='light' size={34}>
        {getInitials(title)}
      </CustomAvatar>
    )
  }
}

const columnHelper = createColumnHelper()

const defaultArticlesData = [
  {
    id: 1,
    title: 'Inovasi Keramik untuk Rumah Modern',
    slug: 'inovasi-keramik-untuk-rumah-modern',
    thumbnail: 'https://picsum.photos/seed/keramik1/200/120',
    tags: ['keramik premium', 'rumah modern', 'teknologi terbaru', 'desain elegan'],
    author: 'John Doe',
    publish_at: '2025-01-10 14:30'
  },
  {
    id: 2,
    title: 'Tips Memilih Keramik untuk Ruang Tamu',
    slug: 'tips-memilih-keramik-untuk-ruang-tamu',
    thumbnail: 'https://picsum.photos/seed/keramik2/200/120',
    tags: ['keramik ruang tamu', 'tips memilih', 'warna netral', 'interior rumah'],
    author: 'Sarah Lim',
    publish_at: '2025-02-01 09:12'
  },
  {
    id: 3,
    title: 'Keramik Outdoor Anti-Slip',
    slug: 'keramik-outdoor-anti-slip',
    thumbnail: 'https://picsum.photos/seed/keramik3/200/120',
    tags: ['keramik outdoor', 'anti slip', 'keamanan taman', 'kolam renang'],
    author: 'Michael Tan',
    publish_at: '2025-02-18 16:55'
  },
  {
    id: 4,
    title: 'Tren Warna Keramik 2025',
    slug: 'tren-warna-keramik-2025',
    thumbnail: 'https://picsum.photos/seed/keramik4/200/120',
    tags: ['tren warna', 'keramik 2025', 'earth tone', 'pastel', 'keramik matte'],
    author: 'Angela Park',
    publish_at: '2025-03-02 11:20'
  },
  {
    id: 5,
    title: 'Cara Merawat Keramik Agar Tetap Mengkilap',
    slug: 'cara-merawat-keramik-agar-tetap-mengkilap',
    thumbnail: 'https://picsum.photos/seed/keramik5/200/120',
    tags: ['perawatan keramik', 'mengkilap', 'tips membersihkan', 'housekeeping'],
    author: 'Louis Chen',
    publish_at: '2025-03-15 08:45'
  }
]

const ArticlePage = () => {
  const [data, setData] = useState(defaultArticlesData)
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [openDelete, setOpenDelete] = useState(false)
  const router = useRouter()

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
          setOpenDelete(true)
          setSelectedId(row.original.id)
        }
      }
    }
  ]

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            {getAvatar({ avatar: row.original.thumbnail, fullName: row.original.title })}
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.title}
              </Typography>
              <Typography variant='body2'>{row.original.slug}</Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('tags', {
        header: 'Tags',
        cell: info => {
          const tags = info.getValue() || []
          const max = 3

          const visibleTags = tags.slice(0, max)
          const extraCount = tags.length - max

          return (
            <div className='flex flex-wrap items-center gap-1 max-w-[250px]'>
              {visibleTags.map((tag, idx) => (
                <Chip key={idx} label={tag} size='small' color='info' variant='tonal' />
              ))}

              {extraCount > 0 && <span className='text-gray-500 text-xs ml-1'>... +{extraCount} more</span>}
            </div>
          )
        }
      }),
      columnHelper.accessor('author', {
        header: 'Author',
        cell: info => <Typography className='truncate max-w-[200px]'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('publish_at', {
        header: 'Publish at',
        cell: info => <Typography className='truncate max-w-[200px]'>{info.getValue()}</Typography>
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

  const deleteStore = () => {
    setData(prev => prev.filter(item => item.id !== selectedId))
    setFilteredData(prev => prev.filter(item => item.id !== selectedId))
    setSelectedId('')
  }

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
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <DialogBasic
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        omSubmit={() => deleteStore()}
        title='Delete Article'
        description='Are you sure you want to delete this article? This action is permanent and cannot be undone.'
      />
    </>
  )
}

export default ArticlePage
