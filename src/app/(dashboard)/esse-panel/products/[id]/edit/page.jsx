'use client'

import { useCallback, useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import _ from 'lodash'

import useSnackbar from '@/@core/hooks/useSnackbar'
import DialogBasic from '@/components/DialogBasic'
import BackdropLoading from '@/components/BackdropLoading'
import ProductForm from '@/components/dashboards/products/Form'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { getProductById, updateProduct, addSpecificationToProduct } from '@/services/products'

const BannersEditPage = () => {
  const router = useRouter()
  const { id } = useParams()
  const { success, error, SnackbarComponent } = useSnackbar()
  const [product, setProduct] = useState()
  const [loading, setLoading] = useState(true)
  const [updateData, setUpdateData] = useState(null)
  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)

      try {
        await handleApiResponse(() => getProductById(id), {
          error,
          onSuccess: ({ data }) =>
            setProduct({
              ...data,
              product_type: data.product_type?.slug,
              category: data.category?.slug,
              specifications: (data.specifications || [])
                .map(spec => ({ ...spec, deleted: false }))
                .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0))
            })
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id, error])

  const handleSubmit = useCallback(async () => {
    if (!updateData) return

    const { specifications, id, ...data } = updateData
    const newSpecifications = specifications.filter(spec => !(!spec.id && spec.deleted))

    setUpdateData(null)
    setLoading(true)

    if (!_.isEqual(product.specifications, specifications)) {
      try {
        await handleApiResponse(() => addSpecificationToProduct(id, { specifications: newSpecifications }), {
          success,
          error,
          onError: () => setLoading(false)
        })
      } catch (error) {
        return
      }
    }

    await handleApiResponse(() => updateProduct(id, data), {
      success,
      error,
      onSuccess: () =>
        setTimeout(() => {
          router.push(`/esse-panel/products/${id}`)
        }, 500),
      onError: () => setLoading(false),
      onValidationError: setValidationErrors
    })
  }, [updateData, product, router, success, error])

  if (!product && loading) {
    return (
      <>
        <p className='p-6'>Loading...</p>
        {SnackbarComponent}
        <BackdropLoading open={loading} />
      </>
    )
  }

  if (!product)
    return (
      <>
        <p className='p-6'>Product not found.</p>
        {SnackbarComponent}
      </>
    )

  return (
    <>
      <ProductForm
        onCancel={() => router.push('/esse-panel/products')}
        onSubmit={setUpdateData}
        initialData={product}
        validationErrors={validationErrors}
      />
      <DialogBasic
        open={updateData !== null}
        onClose={() => setUpdateData(null)}
        onSubmit={handleSubmit}
        title='Confirm Update Product'
        description={`Apakah Anda yakin ingin mengubah produk "${product?.name}"?`}
      />
      {SnackbarComponent}
    </>
  )
}

export default BannersEditPage
