//MUI Imports
import Grid from '@mui/material/Grid'

//Component Imports
import StatisticsCard from '@views/dashboard/StatisticsCard'
import OverviewTable from '@views/dashboard/OverviewTable'

//Data Imports
export const data = [
  {
    stats: '24',
    title: 'Total Posts',
    color: 'primary',
    avatarIcon: 'ri-file-list-line text',
    subtitle: 'Jumlah semua posting yang telah dibuat'
  },
  {
    stats: '8',
    title: 'Draft Posts',
    color: 'warning',
    avatarIcon: 'ri-draft-line',
    subtitle: 'Posting yang masih dalam bentuk draft'
  },
  {
    stats: '16',
    title: 'Published Posts',
    color: 'success',
    avatarIcon: 'ri-send-plane-line',
    subtitle: 'Posting yang sudah dipublikasikan'
  },
  {
    stats: '3',
    title: 'Active Users',
    color: 'info',
    avatarIcon: 'ri-user-3-line',
    subtitle: 'Pengguna yang aktif dalam seminggu terakhir'
  }
]

export const postData = [
  {
    id: 1,
    title: '5 Tips Memilih Keramik yang Tepat untuk Rumah Minimalis',
    category: 'Interior',
    author: 'Admin',
    date: '2025-11-01',
    status: 'Published'
  },
  {
    id: 2,
    title: 'Perbedaan Keramik dan Granit: Mana yang Lebih Cocok untuk Lantai Anda?',
    category: 'Material',
    author: 'Admin',
    date: '2025-10-28',
    status: 'Draft'
  },
  {
    id: 3,
    title: 'Inspirasi Desain Ruang Tamu Modern dengan Ubin Motif Kayu',
    category: 'Desain',
    author: 'Admin',
    date: '2025-10-25',
    status: 'Published'
  },
  {
    id: 4,
    title: 'Cara Merawat Keramik Agar Tetap Mengkilap Seperti Baru',
    category: 'Tips & Perawatan',
    author: 'Admin',
    date: '2025-10-22',
    status: 'Published'
  },
  {
    id: 5,
    title: 'Tren Warna Ubin 2025 untuk Hunian Modern dan Elegan',
    category: 'Tren',
    author: 'Admin',
    date: '2025-10-18',
    status: 'Published'
  }
]

const Dashboard = async () => {
  // Vars

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <StatisticsCard data={data} />
      </Grid>
      <Grid item xs={12}>
        <OverviewTable postData={postData} />
      </Grid>
    </Grid>
  )
}

export default Dashboard
