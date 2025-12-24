'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import HeaderNewsSection from '@/components/section/HeaderNewsSections'
import EndSection from '@/components/section/EndSection'
import NewsSection from '@/components/section/NewsSection'
import { getPubArticles } from '@/services/article'

const NewsPage = () => {
  const { lang: locale } = useParams()

  const [articles, setArticles] = useState([])
  const [articleHighlight, setArticleHighlight] = useState(null)

  const fetchArticles = async () => {
    const res = await getPubArticles()

    if (res?.data?.length > 0) {
      const mappingArticles = res?.data.map(item => {
        return {
          ...item,
          href: `/${locale}/news/${item?.slug}`,
          src: item?.thumbnail
        }
      })

      const highlight = mappingArticles.find(item => item.is_highlighted === true)
      const regulars = mappingArticles.filter(item => item.is_highlighted !== true)

      setArticleHighlight(highlight)
      setArticles(regulars)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return (
    <>
      <HeaderNewsSection articles={articleHighlight} />
      <NewsSection articles={articles} />
      <EndSection />
    </>
  )
}

export default NewsPage
