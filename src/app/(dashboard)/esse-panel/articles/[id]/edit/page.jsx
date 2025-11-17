'use client'

import ArticleForm from '@/components/dashboards/articles/Form'

const ArticleEditPage = ({ params }) => {
  const id = params?.id

  return <ArticleForm id={id} />
}

export default ArticleEditPage
