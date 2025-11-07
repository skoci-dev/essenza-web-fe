// Next.js imports
import { redirect } from 'next/navigation'

// Auth import
import { getServerSession } from 'next-auth'

export default async function EssePanelIndexPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/esse-panel/login')
  }

  redirect('/esse-panel/dashboard')
}
