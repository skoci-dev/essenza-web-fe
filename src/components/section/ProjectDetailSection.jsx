'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import Link from 'next/link'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

import classnames from 'classnames'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import { convertStringtoArray, formatDateToCustomStringNative, formatDateToFullMonth } from '@/utils/helpers'
import { getPubProjects } from '@/services/projects'

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
    textAlign: 'center',
    mt: { xs: 4 }
  },
  latestNewsHeader: {
    borderBottom: '1px solid #D4D4D4',
    padding: '16px 12px'
  },
  latestNewsTitle: {
    color: '#212121',
    fontSize: '14px',
    fontWeight: 500
  },
  articleItemContainer: {
    padding: '16px 12px',
    display: 'flex'
  },
  articleTitle: {
    color: '#212121',
    fontSize: '12px',
    fontWeight: 500,
    width: '100%',
    textAlign: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  articleDate: {
    fontSize: '12px',
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

const ProjectsDetailSection = ({ dataDetail }) => {
  const Tags = dataDetail?.tags ? convertStringtoArray(dataDetail?.tags) : []
  const { lang: locale } = useParams()

  const [projects, setProjects] = useState([])

  const fetchProjects = async () => {
    const res = await getPubProjects({ page_size: 4 })

    if (res?.data.length > 0) {
      const mappingProjects = res?.data.map(item => ({
        ...item,
        href: `/${locale}/project/${item?.slug}`,
        src: item?.thumbnail
      }))

      setProjects(mappingProjects)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <Box className={classnames(frontCommonStyles.layoutSpacing)}>
      <Box sx={{ width: '100%', padding: '30px 0' }}>
        <Typography sx={styles.title}>{dataDetail?.title}</Typography>
        <Typography sx={styles.publishedDate}>{formatDateToCustomStringNative(dataDetail?.published_at)}</Typography>
        <Box sx={styles.tagContainer}>
          {Tags.map(tag => (
            <TagItem key={tag} text={tag} />
          ))}
        </Box>
      </Box>
      <Divider />
      <Box sx={{ width: '100%', margin: '20px 0' }}>
        <Box sx={styles.contentBody} dangerouslySetInnerHTML={{ __html: dataDetail?.description }} />
      </Box>
      <Box>
        <Box
          sx={{
            padding: { xs: '20px 50px' },
            textAlign: { xs: 'center', sm: 'left' },
            border: { xs: '1px solid #D4D4D4', sm: 'unset' },
            borderRadius: '6px 6px 0 0'
          }}
        >
          <Typography sx={styles.latestNewsTitle}>Latest Project</Typography>
        </Box>
        <Divider sx={{ display: { xs: 'none', sm: 'block' } }} />
        <Box
          sx={{
            borderRadius: { xs: '0 0 6px 6px', sm: '6px' },
            borderTop: { xs: 'unset', sm: '1px solid #D4D4D4' },
            borderLeft: '1px solid #D4D4D4',
            borderRight: '1px solid #D4D4D4',
            borderBottom: '1px solid #D4D4D4',
            display: 'flex',
            flexWrap: 'wrap',
            padding: { xs: '0', sm: '12px 0' },
            my: { xs: 0, sm: 6 },
            mb: { xs: 3 }
          }}
        >
          {projects.map((item, i) => (
            <Box
              key={i}
              sx={{
                padding: '10px',
                width: { sm: '25%', xs: '50%' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                border: { xs: '1px solid #D4D4D4', sm: 'unset' },
                borderLeft: {
                  xs: 'none',
                  sm: i !== 0 ? '1px solid #D4D4D4' : 'none'
                }
              }}
            >
              <Link key={i} href={item?.href}>
                <Typography sx={styles.articleTitle}>{item?.title}</Typography>
              </Link>
              <Typography sx={styles.articleDate}>{formatDateToFullMonth(item?.published_at)}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ProjectsDetailSection
