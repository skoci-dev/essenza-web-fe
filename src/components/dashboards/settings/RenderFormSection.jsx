import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

import CustomTextField from '@/@core/components/custom-inputs/TextField'
import FormActions from '@/components/FormActions'

const RenderFormSection = ({ title, fields, slugs, isEditing, setIsEditing, onFormSubmit, onChange, settings }) => (
  <form onSubmit={e => onFormSubmit(e, slugs, setIsEditing)}>
    <Card sx={{ mb: 4 }}>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Grid container spacing={5}>
          {fields.map(field => (
            <Grid item xs={12} sm={field.size} key={field.name}>
              <CustomTextField
                {...field}
                disabled={!isEditing}
                value={settings[field.name] || ''}
                onChange={onChange}
              />
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Divider />
      {isEditing ? (
        <FormActions onCancel={() => setIsEditing(false)} isEdit={isEditing} />
      ) : (
        <Box className={`flex justify-between p-4`}>
          <Button
            variant='contained'
            color='info'
            size='small'
            className='w-1/6'
            onClick={() => setIsEditing(true)}
            startIcon={<i className='ri-pencil-line text-lg' />}
          >
            Edit
          </Button>
        </Box>
      )}
    </Card>
  </form>
)

export default RenderFormSection
