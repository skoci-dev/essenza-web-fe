'use client'

import { useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { CircularProgress, TextField } from '@mui/material'

import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'

import frontCommonStyles from '@views/front-pages/styles.module.css'
import CustomButton from '@/@core/components/mui/Button'
import { contactMessages } from '@/services/contactMessages'

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.4031081009557!2d106.58526557549068!3d-6.210445360833821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69feed267fdf1d%3A0x7e0e5bef2461449d!2sPT%20Internusa%20Ceramic%20Alamasri!5e0!3m2!1sen!2sid!4v1765353831829!5m2!1sen!2sid'

const styles = {
  container: {
    position: 'relative',
    zIndex: 100,
    marginTop: '-220px',
    paddingBottom: '60px'
  },
  title: {
    fontSize: '40px',
    color: '#FFFFFF'
  },
  contactTitle: {
    fontSize: '40px',
    color: '#212121'
  },
  contactText: {
    fontSize: '14px',
    color: '#212121'
  },
  mapBox: isMobile => ({
    width: '100%',
    height: isMobile ? '300px' : '450px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
  }),
  divider: {
    margin: '48px 0'
  },
  card: {
    backgroundColor: '#F8F9FC',
    borderRadius: '10px'
  },
  cardHeader: {
    padding: '20px'
  },
  cardHeaderText: {
    fontSize: '14px',
    color: '#212121'
  },
  cardBody: {
    padding: '20px'
  },
  formFieldBox: {
    mb: 3
  },
  formFieldLabel: {
    fontSize: '14px',
    color: '#000000',
    fontWeight: 500,
    marginBottom: 1,
    marginLeft: 3
  },
  submitBox: {
    display: 'flex',
    justifyContent: 'end'
  },
  submitButtonBox: {
    width: '240px'
  }
}

const CONTACT_FORM_FIELDS = [
  {
    name: 'firstName',
    label: 'First Name :',
    placeholder: 'Enter your First Name',
    multiline: false,
    rows: 1,
    type: 'text'
  },
  {
    name: 'lastName',
    label: 'Last Name :',
    placeholder: 'Enter your Last Name',
    multiline: false,
    rows: 1,
    type: 'text'
  },
  {
    name: 'email',
    label: 'Email :',
    placeholder: 'Enter your Email Address',
    multiline: false,
    rows: 1,
    type: 'text'
  },
  {
    name: 'phone',
    label: 'Phone :',
    placeholder: 'Enter your Phone Number',
    multiline: false,
    rows: 1,
    type: 'text'
  },
  {
    name: 'project',
    label: 'Project :',
    placeholder: 'Enter your Project Name',
    multiline: false,
    rows: 1,
    type: 'text'
  },
  {
    name: 'message',
    label: 'Write to us :',
    placeholder: 'Let us know how we can help. Fill in your details and we’ll get back to you shortly.',
    multiline: true,
    rows: 5,
    type: 'text'
  }
]

const ContactUsSection = () => {
  const isMobile = useMediaQuery('(max-width:768px)')

  const [formData, setFormData] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState()
  const [refreshReCaptcha, setRefreshReCaptcha] = useState(false)

  const resetForm = () => {
    setFormData({})
    setTimeout(() => setSuccess(false), 5000)
  }

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false) // Reset status sukses saat mulai submit baru

    const payloadData = {
      captcha_token: token,
      captcha_version: 'v3',
      name: `${formData?.firstName || ''} ${formData?.lastName || ''}`,
      email: formData?.email,
      phone: formData?.phone,
      subject: `Project: ${formData?.project || 'General Inquiry'}`,
      message: formData?.message
    }

    try {
      const res = await contactMessages(payloadData)

      if (res) {
        setSuccess(true)
        resetForm()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
      setRefreshReCaptcha(r => !r)
    }
  }

  const onVerify = useCallback(token => {
    setToken(token)
  }, [])

  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      <Box maxWidth='lg' sx={styles.container} className={frontCommonStyles.layoutSpacing}>
        <Grid container spacing={5}>
          <Grid item sm={6} xs={12}>
            <Box>
              <Typography sx={styles.title}>
                World Class <br />
                Porcelain Tiles <br />
                since 1990&apos;s
              </Typography>
            </Box>
            <Box sx={{ marginTop: '48px' }}>
              <Typography sx={styles.contactTitle}>Factory</Typography>
              <Typography sx={styles.contactText}>
                Jl. Manis Raya Km 8,5/18 0 Banten Kawasan Industri Palm Manis, RT 004/RW 003, Gandasari, Jatiuwung,
                Tangerang City, Banten - 15137
              </Typography>
            </Box>
            <Box>
              <Typography sx={styles.contactTitle}>Head Office</Typography>
              <Typography sx={styles.contactText}>
                Menara Bidakara 2, Lantai 1, Jl. Gatot Subroto No.Kav. 71, RT.1/RW.1, Menteng Dalam, South Jakarta City,
                Jakarta 12870 Telepon: (021) 83700435
              </Typography>
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box sx={styles.mapBox(isMobile)}>
              <iframe
                src={MAP_EMBED_URL}
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen={true}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              ></iframe>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={styles.divider} />
        <Card sx={styles.card} component='form' onSubmit={handleSubmit}>
          <Box sx={styles.cardHeader}>
            <Typography sx={styles.cardHeaderText}>
              Please contact us with any questions or comments you may have, we&apos;ll be happy to assist you.
            </Typography>
          </Box>
          <Divider />
          <Box sx={styles.cardBody}>
            {CONTACT_FORM_FIELDS.map(field => (
              <Box sx={styles.formFieldBox} key={field.name}>
                <Typography sx={styles.formFieldLabel}>{field.label}</Typography>
                <TextField
                  name={field.name}
                  placeholder={field.placeholder}
                  size='small'
                  fullWidth
                  multiline={field.multiline}
                  rows={field.rows}
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Box>
            ))}
            {success && (
              <Typography sx={{ color: '#2e7d32', fontSize: '14px', fontWeight: 500 }}>
                Message sent successfully!
              </Typography>
            )}
            <Box sx={styles.submitBox}>
              <Box sx={styles.submitButtonBox}>
                <GoogleReCaptcha onVerify={onVerify} refreshReCaptcha={refreshReCaptcha} />
                <CustomButton type='submit' disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : 'Submit'}
                </CustomButton>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </GoogleReCaptchaProvider>
  )
}

export default ContactUsSection
