'use client'

import { useEffect, useMemo, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
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

import CustomInputsDebounced from '@/@core/components/custom-inputs/Debounced'
import TableGeneric from '@/@core/components/table/Generic'
import { getContactMessages, readContactMessages } from '@/services/contactMessages'
import { formatDateToCustomStringNative } from '@/utils/helpers'
import DialogBasic from '@/components/DialogBasic'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper()

const DetailItem = ({ label, value, fullWidth = false }) => (
  <Grid item xs={12} md={fullWidth ? 12 : 6}>
    <Typography variant='body2' sx={{ fontWeight: 600, color: '#424242', mb: 0.5 }}>
      {label}
    </Typography>
    <Typography
      variant='body2'
      sx={{
        color: '#757575',
        ...(fullWidth && {
          whiteSpace: 'pre-line',
          backgroundColor: '#fff',
          p: 2,
          borderRadius: 1,
          border: '1px solid #f0f0f0',
          mt: 1
        })
      }}
    >
      {value || '-'}
    </Typography>
  </Grid>
)

const ContactMessagesPage = () => {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({ page: 0, page_size: 10 })
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [dataDetail, setDataDetail] = useState(null)
  const [openDetail, setOpenDetail] = useState(false)

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Name',
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
      columnHelper.accessor('subject', {
        header: 'Subject',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Date',
        cell: info => <Typography>{formatDateToCustomStringNative(info.getValue())}</Typography>
      }),
      columnHelper.accessor('is_read', {
        header: 'Status',
        cell: info => {
          const isRead = info.getValue()

          return isRead ? (
            <Chip label='Read' size='small' color='success' variant='tonal' className='self-start rounded' />
          ) : (
            <Chip label='Not Read' size='small' color='error' variant='tonal' className='self-start rounded' />
          )
        }
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <IconButton
              size='small'
              variant='outlined'
              color='primary'
              onClick={() => {
                setOpenDetail(true)
                setDataDetail(row?.original)
                readContactMessages(row?.original?.id)
              }}
            >
              <i className='ri-eye-line text-blue-500' />
            </IconButton>
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

  const fetchContactMessage = async () => {
    const res = await getContactMessages(pagination)

    if (res?.data) {
      setData(res.data)
      setFilteredData(res.data)
    }
  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
    setDataDetail(null)
  }

  useEffect(() => {
    fetchContactMessage()
  }, [])

  useEffect(() => {
    fetchContactMessage()
  }, [pagination, dataDetail])

  return (
    <>
      <Card>
        <CardHeader title='Contact Messages' className='p-4' />
        <Divider />
        <div className='flex justify-between flex-col sm:flex-row p-4 gap-4'>
          <CustomInputsDebounced
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Message'
          />
        </div>
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
        open={openDetail}
        onClose={handleCloseDetail}
        title='Detail Messages'
        actions={
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Button
              variant='contained'
              className='w-1/3'
              color='error'
              startIcon={<i className='ri-close-line text-lg' />}
              onClick={handleCloseDetail}
            >
              Close
            </Button>
          </Box>
        }
      >
        <Box
          sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#fafafa'
          }}
        >
          <Grid container spacing={3}>
            <DetailItem label='Profile' value={dataDetail?.profile} />
            <DetailItem label='Full Name' value={dataDetail?.name} />
            <DetailItem label='Email' value={dataDetail?.email} />
            <DetailItem label='Phone Number' value={dataDetail?.phone} />
            <DetailItem label='Subject' value={dataDetail?.subject} />
            <DetailItem label='Country' value={dataDetail?.country} />
            <DetailItem label='City' value={dataDetail?.city} />
            <DetailItem label='Regency' value={dataDetail?.regency} />
            <DetailItem label='Message' value={dataDetail?.message} fullWidth />
            <DetailItem
              label='Sent Date'
              value={dataDetail?.created_at ? new Date(dataDetail.created_at).toLocaleString() : '-'}
            />
          </Grid>
        </Box>
      </DialogBasic>
    </>
  )
}

export default ContactMessagesPage
