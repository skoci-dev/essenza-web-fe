'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
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

import Link from '@/components/Link'
import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'
import CustomInputsDebounced from '@/@core/components/custom-inputs/Debounced'
import TableHeaderActions from '@/@core/components/table/HeaderActions'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper()

const defaultStoresData = [
  {
    id: 1,
    name: 'Global Store Jakarta',
    address: 'Jl. Meruya Ilir No. 1, Jakarta Barat',
    phone: '+62 812 3456 7890',
    email: 'jakarta@globalstore.com',
    latitude: -6.202394,
    longitude: 106.781894,
    created_at: '2025-01-01 09:00'
  },
  {
    id: 2,
    name: 'Global Store Surabaya',
    address: 'Jl. Raya Darmo No. 88, Surabaya',
    phone: '+62 813 4567 8901',
    email: 'surabaya@globalstore.com',
    latitude: -7.275612,
    longitude: 112.642643,
    created_at: '2025-01-05 11:30'
  }
]

const StorePage = () => {
  const [data, setData] = useState(defaultStoresData)
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()

  const actionsData = row => [
    {
      text: 'View',
      icon: <i className='ri-eye-line text-blue-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => router.push(`/esse-panel/stores/${row.original.id}`)
      }
    },
    {
      text: 'Edit',
      icon: <i className='ri-edit-box-line text-yellow-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => router.push(`/esse-panel/stores/${row.original.id}/edit`)
      }
    },
    {
      text: 'Delete',
      icon: <i className='ri-delete-bin-line text-red-500' />,
      menuItemProps: {
        className: 'gap-2',
        onClick: () => deleteStore(row.original.id)
      }
    }
  ]

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Store Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: info => (
          <Tooltip title={info.getValue()}>
            <Typography className='truncate w-48'>{info.getValue()}</Typography>
          </Tooltip>
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

  const deleteStore = id => {
    setData(prev => prev.filter(item => item.id !== id))
    setFilteredData(prev => prev.filter(item => item.id !== id))
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
    <Card>
      <CardHeader title='Store Management' className='p-4' />
      <Divider />
      <TableHeaderActions
        searchPlaceholder='Search Store'
        searchValue={globalFilter ?? ''}
        onSearchChange={setGlobalFilter}
        addLabel='Add Store'
        addHref='/esse-panel/stores/add'
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
  )
}

export default StorePage
