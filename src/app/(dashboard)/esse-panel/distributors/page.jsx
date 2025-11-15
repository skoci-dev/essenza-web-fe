'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
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

import Link from '@/components/Link'
import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'
import CustomInputsDebounced from '@/@core/components/custom-inputs/Debounced'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const defaultDistributors = [
  {
    id: 1,
    name: 'PT Nusantara Bangun Sejahtera',
    address: 'Jl. Meruya Raya No. 5, Jakarta Barat',
    phone: '+62 812-3456-7890',
    email: 'info@nusantarabangun.com',
    website: 'https://nusantarabangun.com',
    latitude: -6.2,
    longitude: 106.785,
    created_at: '2025-01-15 09:00'
  },
  {
    id: 2,
    name: 'CV Sinar Terang Jaya',
    address: 'Jl. Gatot Subroto No. 12, Bandung',
    phone: '+62 821-1111-2222',
    email: 'contact@sinarterangjaya.co.id',
    website: 'https://sinarterangjaya.co.id',
    latitude: -6.914744,
    longitude: 107.60981,
    created_at: '2025-02-01 10:30'
  },
  {
    id: 3,
    name: 'UD Maju Bersama',
    address: 'Jl. Diponegoro No. 45, Surabaya',
    phone: '+62 822-2222-3333',
    email: 'sales@majubersama.id',
    website: 'https://majubersama.id',
    latitude: -7.257472,
    longitude: 112.75209,
    created_at: '2025-02-28 13:45'
  }
]

const columnHelper = createColumnHelper()

const DistributorsPage = () => {
  const [data, setData] = useState(defaultDistributors)
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()

  const deleteDistributor = id => {
    setData(prev => prev.filter(item => item.id !== id))
    setFilteredData(prev => prev.filter(item => item.id !== id))
  }

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
        onClick: () => deleteDistributor(row.original.id)
      }
    }
  ]

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Distributor Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: info => <Typography className='truncate w-48'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: info => <Typography className='text-blue-500'>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('website', {
        header: 'Website',
        cell: info => (
          <a href={info.getValue()} target='_blank' rel='noopener noreferrer' className='text-primary underline'>
            {info.getValue().replace('https://', '')}
          </a>
        )
      }),
      columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: info => <Typography>{info.getValue()}</Typography>
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

  return (
    <Card>
      <CardHeader title='Distributor Management' className='p-4' />
      <Divider />

      <div className='flex justify-between flex-col sm:flex-row p-4 gap-4'>
        <CustomInputsDebounced
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          placeholder='Search Distributor'
        />
        <Link href='/esse-panel/distributors/add'>
          <Button variant='contained' color='success' startIcon={<i className='ri-add-line' />}>
            Add Distributor
          </Button>
        </Link>
      </div>

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

export default DistributorsPage
