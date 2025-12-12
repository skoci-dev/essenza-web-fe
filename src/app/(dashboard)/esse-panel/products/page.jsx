'use client'

import { useMemo, useState, useEffect, useCallback, useRef } from 'react'

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
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Components
import Link from '@/components/Link'
import ActionMenu from '@/@core/components/option-menu/ActionMenu'
import TableGeneric from '@/@core/components/table/Generic'
import CustomInputsDebounced from '@/@core/components/custom-inputs/Debounced'

import useSnackbar from '@/@core/hooks/useSnackbar'
import DialogBasic from '@/components/DialogBasic'
import BackdropLoading from '@/components/BackdropLoading'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { deleteProduct, getProducts, toggleProductActiveStatus } from '@/services/products'

const columnHelper = createColumnHelper()

const ProductPage = () => {
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [productToDelete, setProductToDelete] = useState(null)
  const isInitialMount = useRef(true)

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 0,
    total_items: 0,
    has_next: false,
    has_previous: false
  })

  const [globalFilter, setGlobalFilter] = useState('')

  const fetchProducts = useCallback(async (page = 1, size = 10, search = '') => {
    setLoading(true)

    await handleApiResponse(() => getProducts({ page_size: size, page, search }), {
      onSuccess: ({ data, meta: { pagination } }) => {
        setData(data)
        setPagination(pagination)
      }
    })

    setLoading(false)
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      fetchProducts()

      return
    }

    const timer = setTimeout(() => {
      fetchProducts(1, pagination.per_page, globalFilter)
    }, 500)

    return () => clearTimeout(timer)
  }, [globalFilter, pagination.per_page, fetchProducts])

  const toggleActive = useCallback(
    id => {
      const product = data.find(item => item.id === id)

      setData(prev => prev.map(item => (item.id === id ? { ...item, is_active: !item.is_active } : item)))

      handleApiResponse(() => toggleProductActiveStatus(id, !product.is_active), {
        success,
        error,
        onError: () => {
          setData(prev => prev.map(item => (item.id === id ? { ...item, is_active: product.is_active } : item)))
        }
      })
    },
    [data, success, error]
  )

  const handleConfirmDelete = useCallback(() => {
    if (!productToDelete) return

    setData(prev => prev.filter(item => item.id !== productToDelete.id))
    setProductToDelete(null)

    handleApiResponse(() => deleteProduct(productToDelete.id), {
      success,
      error,
      onError: () => fetchProducts(pagination.current_page, pagination.per_page, globalFilter)
    })
  }, [productToDelete, success, error, fetchProducts, pagination, globalFilter])

  const columns = useMemo(() => {
    const actionsData = row => [
      {
        text: 'View',
        icon: <i className='ri-eye-line text-blue-500' />,
        menuItemProps: {
          className: 'gap-2',
          onClick: () => router.push(`/esse-panel/products/${row.original.id}`)
        }
      },
      {
        text: 'Edit',
        icon: <i className='ri-edit-box-line text-yellow-500' />,
        menuItemProps: {
          className: 'gap-2',
          onClick: () => router.push(`/esse-panel/products/${row.original.id}/edit`)
        }
      },
      {
        text: 'Delete',
        icon: <i className='ri-delete-bin-line text-red-500' />,
        menuItemProps: {
          className: 'gap-2',
          onClick: () =>
            setProductToDelete({
              id: row.original.id,
              name: row.original.name
            })
        }
      }
    ]

    return [
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info => <img src={info.getValue()} alt='Product' className='w-24 h-12 object-cover rounded' />
      }),
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        cell: info => (
          <Typography className='capitalize'>{info.getValue() === 'lantai' ? 'Lantai' : 'Dinding'}</Typography>
        )
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
    ]
  }, [toggleActive, router])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.total_pages
  })

  return (
    <>
      <Card>
        <CardHeader title='Product Management' className='p-4' />
        <Divider />

        <div className='flex justify-between flex-col sm:flex-row p-4 gap-4'>
          <CustomInputsDebounced
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Product'
          />
          <Link href='/esse-panel/products/add'>
            <Button variant='contained' color='primary' startIcon={<i className='ri-add-line' />}>
              Add Product
            </Button>
          </Link>
        </div>

        <TableGeneric table={table} />

        <TablePagination
          component='div'
          count={pagination.total_items}
          rowsPerPage={pagination.per_page}
          page={pagination.current_page - 1}
          onPageChange={(_, page) => fetchProducts(page + 1, pagination.per_page, globalFilter)}
          onRowsPerPageChange={e => {
            const newSize = Number(e.target.value)

            fetchProducts(1, newSize, globalFilter)
          }}
          rowsPerPageOptions={[5, 10, 20, 25, 50]}
        />
      </Card>
      <DialogBasic
        open={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onSubmit={handleConfirmDelete}
        title='Delete Product'
        description={`Apakah Anda yakin ingin menghapus "${productToDelete?.name}"?`}
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default ProductPage
