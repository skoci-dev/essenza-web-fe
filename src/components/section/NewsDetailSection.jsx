'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import Link from 'next/link'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import { convertStringtoArray, formatDateToCustomStringNative, formatDateToFullMonth } from '@/utils/helpers'
import { getPubArticles } from '@/services/article'

const styles = {
  title: {
    fontSize: '28px',
    fontWeight: 500,
    color: '#212121',
    marginBottom: '10px'
  },
  publishedDate: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#989898',
    marginBottom: '10px'
  },
  tagContainer: {
    display: 'flex',
    gap: '7.5px'
  },
  contentBody: {
    fontSize: '18px',
    color: '#212121'
  },
  latestNewsBox: {
    border: '1px solid #D4D4D4',
    borderRadius: '10px',
    textAlign: 'center'
  },
  latestNewsHeader: {
    borderBottom: '1px solid #D4D4D4',
    padding: '16px 12px'
  },
  latestNewsTitle: {
    color: '#212121',
    fontSize: '18px',
    fontWeight: 500
  },
  articleItemContainer: {
    padding: '16px 12px',
    display: 'flex'
  },
  articleTitle: {
    color: '#212121',
    fontSize: '18px',
    fontWeight: 500,
    width: '60%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  articleDate: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#BB8B05',
    width: '40%'
  },
  tagItemBox: {
    padding: '10px',
    border: '1px solid #BB8B05',
    borderRadius: '20px'
  },
  tagItemText: {
    fontWeight: 500,
    fontSize: '12px',
    color: '#989898'
  }
}

const TagItem = ({ text }) => {
  return (
    <Box sx={styles.tagItemBox}>
      <Typography sx={styles.tagItemText}>{text}</Typography>
    </Box>
  )
}

const NewsDetailSection = ({ data }) => {
  const Tags = data?.tags ? convertStringtoArray(data?.tags) : []
  const { lang: locale } = useParams()

  const [articles, setArticles] = useState([])

  const fetchArticles = async () => {
    const res = await getPubArticles({ page_size: 5 })

    if (res?.data.length > 0) {
      const mappingArticles = res?.data.map(item => ({
        ...item,
        href: `/${locale}/news/${item?.slug}`,
        src: item?.thumbnail
      }))

      setArticles(mappingArticles)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return (
    <Box className={classnames(frontCommonStyles.layoutSpacing)}>
      <Box sx={{ width: '100%', padding: '30px 0' }}>
        <Typography sx={styles.title}>{data?.title}</Typography>
        <Typography sx={styles.publishedDate}>{formatDateToCustomStringNative(data?.published_at)}</Typography>
        <Box sx={styles.tagContainer}>
          {Tags.map(tag => (
            <TagItem key={tag} text={tag} />
          ))}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 3, margin: '20px 0' }}>
        <Box sx={{ width: '70%' }}>
          <Box sx={styles.contentBody} dangerouslySetInnerHTML={{ __html: data.content }} />
        </Box>
        <Box sx={{ width: '30%' }}>
          <Box sx={styles.latestNewsBox}>
            <Box sx={styles.latestNewsHeader}>
              <Typography sx={styles.latestNewsTitle}>Latest news</Typography>
            </Box>
            {articles.map((article, i) => {
              const isLast = i === articles.length - 1

              return (
                <Link key={article.id} href={article.href}>
                  <Box
                    sx={{
                      ...styles.articleItemContainer,
                      borderBottom: isLast ? 'none' : '1px solid #D4D4D4'
                    }}
                  >
                    <Tooltip title={article.title}>
                      <Typography sx={styles.articleTitle}>{article.title}</Typography>
                    </Tooltip>
                    <Typography sx={styles.articleDate}>{formatDateToFullMonth(article?.published_at)}</Typography>
                  </Box>
                </Link>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default NewsDetailSection
