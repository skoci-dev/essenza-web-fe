'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from 'next/link'
import CustomInputsDebounced from '../custom-inputs/Debounced'

const TableHeaderActions = ({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  addLabel = 'Add',
  addHref = '#',
  addColor = 'primary',
  addIcon = <i className='ri-add-line' />,
  searchWidth = 'w-1/6',
  buttonWidth = 'w-1/6'
}) => {
  return (
    <Box className='flex justify-between flex-col sm:flex-row p-4 gap-4'>
      <Box className={searchWidth}>
        <CustomInputsDebounced
          value={searchValue}
          onChange={value => onSearchChange(String(value))}
          placeholder={searchPlaceholder}
        />
      </Box>

      <Box className={buttonWidth}>
        <Link href={addHref}>
          <Button variant='contained' className='w-full' color={addColor} startIcon={addIcon}>
            {addLabel}
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default TableHeaderActions
