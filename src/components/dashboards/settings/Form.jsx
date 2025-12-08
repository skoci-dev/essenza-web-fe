'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

import useSnackbar from '@/@core/hooks/useSnackbar'
import { updateSetting, getSettingBySlug } from '@/services/setting'
import { handleApiResponse } from '@/utils/handleApiResponse'
import BackdropLoading from '@/components/BackdropLoading'
import RenderFormSection from './RenderFormSection'

const GENERAL_SLUGS = [
  'site_name',
  'site_description',
  'site_logo_url',
  'favicon_url',
  'meta_keywords',
  'meta_description'
]

const WA_SLUGS = ['wa_number', 'wa_message']
const ALL_SLUGS = [...GENERAL_SLUGS, ...WA_SLUGS]

const initialSettingsState = ALL_SLUGS.reduce((acc, slug) => {
  acc[slug] = ''

  return acc
}, {})

const SettingsForm = () => {
  const [settings, setSettings] = useState(initialSettingsState)
  const [loading, setLoading] = useState(false)
  const [isGeneralEditing, setIsGeneralEditing] = useState(false)
  const [isWaEditing, setIsWaEditing] = useState(false)

  const { success, error, SnackbarComponent } = useSnackbar()

  const fields = useMemo(
    () => ({
      general: [
        { name: 'site_name', label: 'Site Name', placeholder: 'Masukkan nama situs', size: 6, required: true },
        { name: 'favicon_url', label: 'Favicon URL', placeholder: '/favicon.ico', size: 6, required: true },
        { name: 'site_logo_url', label: 'Site Logo URL', placeholder: '/images/logo.png', size: 6, required: true },
        {
          name: 'meta_keywords',
          label: 'Meta Keywords',
          placeholder: 'kata kunci SEO dipisahkan koma',
          size: 6,
          required: true
        },
        {
          name: 'site_description',
          label: 'Site Description',
          placeholder: 'Deskripsi singkat tentang situs atau perusahaan',
          multiline: true,
          rows: 3,
          size: 12,
          required: true
        },
        {
          name: 'meta_description',
          label: 'Meta Description',
          placeholder: 'Deskripsi untuk meta tag SEO',
          multiline: true,
          rows: 3,
          size: 12
        }
      ],
      wa: [
        { name: 'wa_number', label: 'WA / Phone Number', placeholder: '+628XXXXXXXX', size: 12, required: true },
        {
          name: 'wa_message',
          label: 'Message',
          placeholder: 'Halo . . . .',
          required: true,
          multiline: true,
          rows: 3,
          size: 12
        }
      ]
    }),
    []
  )

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true)

      try {
        const results = await Promise.all(ALL_SLUGS.map(slug => getSettingBySlug(slug)))

        const newData = results.reduce((acc, res, idx) => {
          const slug = ALL_SLUGS[idx]

          acc[slug] = res?.data?.value || ''

          return acc
        }, {})

        setSettings(newData)
      } catch (err) {
        error('Gagal memuat data settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [error])

  const handleChange = useCallback(e => {
    const { name, value } = e.target

    setSettings(prev => ({ ...prev, [name]: value }))
  }, [])

  const createCombinedRequest = useCallback(
    async (slugsToUpdate, setIsEditing) => {
      const errors = []
      const results = []

      const updatePromises = slugsToUpdate.map(async slug => {
        const payload = {
          label: slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          value: settings[slug] || '',
          description: `Setting for ${slug}`,
          is_active: true
        }

        const res = await updateSetting(slug, payload)

        if (res.success) {
          results.push({ slug, ...res })
        } else {
          errors.push({
            slug,
            message: res?.message || 'Unknown error'
          })
        }

        return res.success
      })

      await Promise.all(updatePromises)

      if (errors.length > 0) {
        const errorItems = errors
          .map(
            item =>
              `- ${item.slug
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}`
          )
          .join('\n')

        return {
          success: false,
          status: 400,
          message: `Some settings failed to save:\n${errorItems}`,
          errors,
          data: results
        }
      }

      return {
        success: true,
        status: 200,
        message: 'All settings updated successfully',
        data: results
      }
    },
    [settings]
  )

  const handleFormSubmit = async (e, slugsToUpdate, setIsEditing) => {
    e.preventDefault()
    setLoading(true)

    await handleApiResponse(() => createCombinedRequest(slugsToUpdate), {
      success: () => success('All settings updated successfully'),
      error: msg => error(<span className='whitespace-pre-wrap'>{msg}</span>),
      onSuccess: () => {
        setIsEditing(false)
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      }
    })
  }

  return (
    <>
      {/* General Settings Form */}
      <RenderFormSection
        title='General Settings'
        fields={fields.general}
        slugs={GENERAL_SLUGS}
        isEditing={isGeneralEditing}
        setIsEditing={setIsGeneralEditing}
        onFormSubmit={handleFormSubmit}
        onChange={handleChange}
        settings={settings}
      />

      {/* WA Settings Form */}
      <RenderFormSection
        title='WA Setting'
        fields={fields.wa}
        slugs={WA_SLUGS}
        isEditing={isWaEditing}
        setIsEditing={setIsWaEditing}
        onFormSubmit={handleFormSubmit}
        onChange={handleChange}
        settings={settings}
      />

      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default SettingsForm
