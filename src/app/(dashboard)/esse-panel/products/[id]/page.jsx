'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { Box, Chip } from '@mui/material'

import useSnackbar from '@/@core/hooks/useSnackbar'
import { getProductById, deleteProduct } from '@/services/products'
import DetailActions from '@/components/DetailActions'
import { handleApiResponse } from '@/utils/handleApiResponse'
import { ShowElse, ShowIf } from '@/components/ShowIf'
import { getFilename } from '@/utils/helpers'

const ProductDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const { success, error, SnackbarComponent } = useSnackbar()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      handleApiResponse(async () => await getProductById(id), {
        error,
        onSuccess: ({ data }) => {
          setProduct(data)
          setLoading(false)
        },
        onError: () => setLoading(false)
      })
    }

    if (id) fetchProduct()
  }, [id, error])

  const { highlightedSpecs, technicalSpecs } = useMemo(() => {
    if (!product?.specifications) {
      return { highlightedSpecs: [], technicalSpecs: [] }
    }

    const highlighted = []
    const technical = []

    product.specifications.forEach(spec => {
      if (spec.highlighted) {
        highlighted.push(spec)
      } else {
        technical.push(spec)
      }
    })

    return {
      highlightedSpecs: highlighted.sort((a, b) => a.order_number - b.order_number),
      technicalSpecs: technical.sort((a, b) => a.order_number - b.order_number)
    }
  }, [product])

  const handleDelete = useCallback(async () => {
    setLoading(true)

    await handleApiResponse(() => deleteProduct(id), {
      success,
      error,
      onSuccess: () => {
        setTimeout(() => router.push('/esse-panel/products'), 1000)
      },
      onError: () => setLoading(false)
    })
  }, [id, success, error, router])

  if (loading) {
    return (
      <>
        <p className='p-6'>Loading...</p>
        {SnackbarComponent}
      </>
    )
  }

  if (!product) return <p className='p-6'>Product not found.</p>

  return (
    <>
      <div className='p-6'>
        <Card className='w-full mx-auto shadow'>
          <CardHeader title='Product Detail' />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
                  Product Information
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Product Name
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.name || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Slug
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.slug || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Category
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.category?.name || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Product Type
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.product_type?.label || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Description
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.description || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Status
                      </Typography>
                      <ShowIf when={product.is_active}>
                        <Chip label='Active' size='small' color='success' variant='tonal' sx={{ borderRadius: 1 }} />

                        <ShowElse>
                          <Chip label='Inactive' size='small' color='error' variant='tonal' sx={{ borderRadius: 1 }} />
                        </ShowElse>
                      </ShowIf>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
                  Product Images
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 2 }}>
                        Main Image
                      </Typography>
                      <ShowIf when={product.image}>
                        <Box
                          component='img'
                          src={product.image}
                          alt={getFilename(product.image)}
                          sx={{
                            width: 220,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                        />

                        <ShowElse>
                          <Typography variant='body2' sx={{ color: '#757575' }}>
                            No image uploaded
                          </Typography>
                        </ShowElse>
                      </ShowIf>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 2 }}>
                        Gallery
                      </Typography>
                      <ShowIf when={product.gallery?.length > 0}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          {product.gallery.map((img, i) => (
                            <Box
                              key={i}
                              component='img'
                              src={img}
                              alt={getFilename(img)}
                              sx={{
                                width: 120,
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid #e0e0e0'
                              }}
                            />
                          ))}
                        </Box>

                        <ShowElse>
                          <Typography variant='body2' sx={{ color: '#757575' }}>
                            No gallery images
                          </Typography>
                        </ShowElse>
                      </ShowIf>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
                  SEO Information
                </Typography>
                <Box
                  sx={{
                    p: 3,
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    backgroundColor: '#fafafa'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Meta Title
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.meta_title || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Meta Keywords
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.meta_keywords || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242', mb: 0.5 }}>
                        Meta Description
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#757575' }}>
                        {product.meta_description || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant='subtitle2' sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
                  Specifications
                </Typography>

                <ShowIf when={highlightedSpecs.length > 0 || technicalSpecs.length > 0}>
                  <Grid container spacing={4}>
                    {/* Highlighted Specifications */}
                    <ShowIf when={highlightedSpecs.length > 0}>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            backgroundColor: '#fafafa',
                            height: '100%'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600, color: '#C1A658' }}>
                            Highlighted Features
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {highlightedSpecs.map(spec => (
                              <Box key={spec.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  component='img'
                                  src={`/icons/${spec.icon}.svg`}
                                  alt={spec.name}
                                  sx={{ width: 20, height: 20, flexShrink: 0 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242' }}>
                                    {spec.name}
                                  </Typography>
                                  <Typography variant='body2' sx={{ color: '#757575' }}>
                                    {spec.value}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                    </ShowIf>

                    <ShowIf when={technicalSpecs.length > 0}>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            p: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: 2,
                            backgroundColor: '#fafafa',
                            height: '100%'
                          }}
                        >
                          <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600, color: '#616161' }}>
                            Technical Specifications
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {technicalSpecs.map(spec => (
                              <Box key={spec.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box
                                  component='img'
                                  src={`/icons/${spec.icon}.svg`}
                                  alt={spec.name}
                                  sx={{ width: 20, height: 20, flexShrink: 0 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant='body2' sx={{ fontWeight: 500, color: '#424242' }}>
                                    {spec.name}
                                  </Typography>
                                  <Typography variant='body2' sx={{ color: '#757575' }}>
                                    {spec.value}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Grid>
                    </ShowIf>
                  </Grid>

                  <ShowElse>
                    <Typography variant='body2' color='textSecondary'>
                      No specifications available.
                    </Typography>
                  </ShowElse>
                </ShowIf>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <DetailActions id={id} href='products' onConfirm={handleDelete} />
        </Card>
      </div>
      {SnackbarComponent}
    </>
  )
}

export default ProductDetailPage
