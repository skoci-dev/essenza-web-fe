import HeaderNewsDetailSection from '@/components/section/HeaderNewsDetailSection'
import NewsDetailSection from '@/components/section/NewsDetailSection'
import { getPubArticleBySlug } from '@/services/article'
import NotFoundPage from '../../[...not-found]/page'

async function getData(slug) {
  try {
    const { success, message, data } = await getPubArticleBySlug(slug)

    if (!success) {
      throw new Error(message || 'Failed to fetch footer menus')
    }

    return {
      ...data,
      openGraph: {
        title: data.meta_title || data.title,
        description: data.meta_description,
        type: 'article',
        images: [
          {
            url: data.thumbnail || '/default-thumbnail.jpg',
            alt: data.title
          }
        ]
      }
    }
  } catch (error) {
    console.error('Error fetching article:', error)
  }

  return {
    openGraph: {
      title: 'Not Found',
      description: '',
      type: 'article',
      images: [
        {
          url: '/default-thumbnail.jpg',
          alt: 'Not Found'
        }
      ]
    }
  }
}

export default async function NewsDetailPage({ params }) {
  const { slug } = params

  const newsItem = await getData(slug)

  const gallery = newsItem?.gallery?.length > 0 ? newsItem?.gallery : []
  const listImage = [newsItem?.thumbnail, ...gallery]

  if (newsItem) {
    return (
      <>
        <HeaderNewsDetailSection image={listImage} />
        <NewsDetailSection data={newsItem} />
      </>
    )
  } else {
    return <NotFoundPage />
  }
}
