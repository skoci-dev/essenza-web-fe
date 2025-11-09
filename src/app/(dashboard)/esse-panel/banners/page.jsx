'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Switch from '@mui/material/Switch'
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

import Link from '@/components/Link'

// Components
import CustomInputsDebounced from '@/@core/components/custom-inputs/Debounced'

// Styles

import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'

// Fuzzy filter untuk search
const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

// Dummy banner data
const defaultBannerData = [
  {
    id: 1,
    title: 'Promo Keramik 50%',
    subtitle: 'Diskon besar untuk semua produk',
    image: '/images/banner1.jpg',
    link_url: '/promo',
    order_no: 1,
    is_active: true,
    created_at: '2025-01-01 10:00',
    updated_at: '2025-01-02 12:00'
  },
  {
    id: 2,
    title: 'Produk Baru',
    subtitle: 'Lihat koleksi terbaru kami',
    image: '/images/banner2.jpg',
    link_url: '/produk-baru',
    order_no: 2,
    is_active: false,
    created_at: '2025-01-05 09:00',
    updated_at: '2025-01-06 11:00'
  }
]

// Column helper
const columnHelper = createColumnHelper()

const BannerPage = () => {
  const [data, setData] = useState(defaultBannerData)
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')

  const router = useRouter()

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
          onClick: () => deleteBanner(row.original.id)
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
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info => <img src={info.getValue()} alt='Banner' className='w-24 h-12 object-cover rounded' />
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
        header: 'Active',
        cell: info => <Switch checked={info.getValue()} onChange={() => toggleActive(info.row.original.id)} />
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

  const toggleActive = id => {
    setData(prev => prev.map(item => (item.id === id ? { ...item, is_active: !item.is_active } : item)))
    setFilteredData(prev => prev.map(item => (item.id === id ? { ...item, is_active: !item.is_active } : item)))
  }

  const deleteBanner = id => {
    setData(prev => prev.filter(item => item.id !== id))
    setFilteredData(prev => prev.filter(item => item.id !== id))
  }

  return (
    <Card>
      <CardHeader title='Banner Management' className='p-4' />
      <Divider />
      <div className='flex justify-between flex-col sm:flex-row p-4 gap-4'>
        <CustomInputsDebounced
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Banner'
        />
        <Link href='/esse-panel/banners/add'>
          <Button variant='contained' color='primary' startIcon={<i className='ri-add-line' />}>
            Add Banner
          </Button>
        </Link>
      </div>
      <TableGeneric table={table} columns={columns} />

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
  )
}

export default BannerPage
