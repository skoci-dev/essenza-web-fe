import EndSection from '@/components/section/EndSection'
import HeaderNewsDetailSection from '@/components/section/HeaderNewsDetailSection'
import NewsDetailSection from '@/components/section/NewsDetailSection'

async function getData(slug) {
  const url = `https://essenza-backend.warawiri.web.id/pub/v1/articles${slug}`

  let res

  try {
    res = await fetch(url, {
      cache: 'no-store'
    })
  } catch (networkError) {
    console.error('NETWORK FETCH ERROR:', networkError.message)
    throw new Error('Failed to connect to the server.')
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch data. Status: ${res.status}`)
  }

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.message || 'API reported failure.')
  }

  const resData = data?.data

  return {
    ...resData,
    openGraph: {
      title: resData.meta_title || resData.title,
      description: resData.meta_description,
      type: 'article',
      images: [
        {
          url: resData.thumbnail || '/default-thumbnail.jpg',
          alt: resData.title
        }
      ]
    }
  }
}

export default async function NewsDetailPage({ params }) {
  const { slug } = params

  const newsItem = await getData(slug)

  return (
    <>
      <HeaderNewsDetailSection thumbnail={newsItem?.thumbnail ?? '/images/illustrations/photos/banner-1.png'} />
      <NewsDetailSection data={newsItem} />
    </>
  )
}
