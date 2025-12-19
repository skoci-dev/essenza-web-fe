'use client'

import { useEffect, useState, useCallback } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import BackdropLoading from '@/components/BackdropLoading'
import useSnackbar from '@/@core/hooks/useSnackbar'
import { createMenuItem, deleteMenuItem, getMenus, updateMenuItem, updateMenuItemsOrder } from '@/services/menu'

import CustomTextField from '@/@core/components/custom-inputs/TextField'
import DialogBasic from '@/components/DialogBasic'
import { handleApiResponse } from '@/utils/handleApiResponse'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)

  result.splice(endIndex, 0, removed)

  return result.map((item, index) => ({
    ...item,
    order_no: index + 1
  }))
}

const MenuItemForm = ({
  item,
  menuIndex,
  itemIndex,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  handleChange,
  editingIndex,
  addingNew
}) => {
  const isEdit = editingIndex?.menuIndex === menuIndex && editingIndex?.itemIndex === itemIndex

  const isLabelValid = item?.label && item?.label.trim() !== ''
  const isUrlValid = item?.link && item?.link.trim() !== ''

  return (
    <Grid container spacing={3} alignItems='center' sx={{ mb: 2 }}>
      <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        <i
          className={`ri-drag-move-fill text-xl text-gray-500 ${isEdit || addingNew ? 'opacity-30' : 'cursor-grab'}`}
        />
      </Grid>
      <Grid item xs={4}>
        <CustomTextField
          fullWidth
          size='small'
          disabled={!isEdit && !addingNew}
          label='Label'
          placeholder='Label Menu'
          value={item?.label || ''}
          onChange={e => handleChange(menuIndex, itemIndex, 'label', e.target.value)}
          error={isEdit && !isLabelValid}
          helperText={isEdit && !isLabelValid ? 'Label is required' : ''}
        />
      </Grid>
      <Grid item xs={5}>
        <CustomTextField
          fullWidth
          size='small'
          disabled={!isEdit && !addingNew}
          label='URL / Link'
          placeholder='/path/to/page or external-link'
          value={item?.link || ''}
          onChange={e => handleChange(menuIndex, itemIndex, 'link', e.target.value)}
          error={isEdit && !isUrlValid}
          helperText={isEdit && !isUrlValid ? 'URL is required' : ''}
        />
      </Grid>
      <Grid item xs={2} sx={{ display: 'flex', gap: 1 }}>
        {!isEdit ? (
          <IconButton
            sx={{ borderRadius: '6px', border: '1px solid blue' }}
            onClick={() => onEdit(menuIndex, itemIndex)}
            disabled={editingIndex !== null}
          >
            <i className='ri-pencil-line text-blue-500 text-lg' />
          </IconButton>
        ) : (
          <>
            <IconButton
              sx={{ borderRadius: '6px', border: '1px solid orange' }}
              onClick={() => onCancel(menuIndex, itemIndex, item)}
            >
              <i className='ri-close-line text-orange-500 text-lg' />
            </IconButton>
            <IconButton
              sx={{ borderRadius: '6px', border: '1px solid green' }}
              onClick={() => onSave(menuIndex, itemIndex)}
              disabled={!isLabelValid || !isUrlValid}
            >
              <i className='ri-check-line text-green-500 text-lg' />
            </IconButton>
          </>
        )}
        {!item?.isNew && (
          <IconButton
            sx={{ borderRadius: '6px', border: '1px solid red' }}
            color='error'
            onClick={() => onDelete(menuIndex, itemIndex)}
            disabled={editingIndex !== null && !isEdit}
          >
            <i className='ri-delete-bin-line text-red-500 text-lg' />
          </IconButton>
        )}
      </Grid>
    </Grid>
  )
}

const MenuForm = () => {
  const { success, error, info, SnackbarComponent } = useSnackbar()

  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [orderChanged, setOrderChanged] = useState(false)
  const [originalMenuData, setOriginalMenuData] = useState(null)

  const fetchMenu = useCallback(async () => {
    setLoading(true)

    try {
      const res = await getMenus()

      if (res?.data?.length > 0) {
        const sortedMenu = res.data.map(menuItem => ({
          ...menuItem,
          items: menuItem.items.sort((a, b) => (a.order_no || 0) - (b.order_no || 0))
        }))

        setMenu(sortedMenu)
      } else {
        setMenu([])
      }
    } catch (err) {
      error('Failed to load menu data.')
    } finally {
      setLoading(false)
    }
  }, [error])

  const confirmDelete = async () => {
    if (!deleteIndex) return

    const { menuIndex, itemIndex, item } = deleteIndex

    setLoading(true)

    try {
      handleApiResponse(() => deleteMenuItem(item?.id), {
        success: msg => success(msg || 'Successfully deleted!'),
        error: msg => error(msg || 'Failed to deleted menu item.'),
        onSuccess: () => {
          setLoading(false)
          setDeleteIndex(null)
          fetchMenu()
        },
        onError: () => {
          setLoading(false)
        }
      })
    } catch (err) {
      error('Failed to delete menu item from server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  const handleChange = useCallback(
    (menuIndex, itemIndex, field, value) => {
      let updatedMenu = [...menu]

      updatedMenu[menuIndex] = { ...updatedMenu[menuIndex] }
      updatedMenu[menuIndex].items = [...updatedMenu[menuIndex].items]
      updatedMenu[menuIndex].items[itemIndex] = {
        ...updatedMenu[menuIndex].items[itemIndex],
        [field]: value
      }

      setMenu(updatedMenu)
    },
    [menu]
  )

  const handleEdit = useCallback(
    (menuIndex, itemIndex) => {
      if (editingIndex === null) {
        setOriginalMenuData([...menu])
        setEditingIndex({ menuIndex, itemIndex })
      }
    },
    [editingIndex, menu]
  )

  const handleCancel = useCallback(
    (menuIndex, itemIndex, item) => {
      if (item.isNew) {
        let updatedMenu = [...menu]

        updatedMenu[menuIndex] = { ...updatedMenu[menuIndex] }
        updatedMenu[menuIndex].items = [...updatedMenu[menuIndex].items]
        updatedMenu[menuIndex].items.splice(itemIndex, 1)

        setMenu(updatedMenu)
        success('Canceled adding new item.')
      } else if (originalMenuData) {
        setMenu(originalMenuData)
        info('Editing canceled, data restored.')
      }

      setEditingIndex(null)
      setOriginalMenuData(null)
    },
    [menu, originalMenuData, success, info]
  )

  const handleSave = useCallback(
    (menuIndex, itemIndex) => {
      const itemToSave = menu[menuIndex].items[itemIndex]

      if (!itemToSave.label || !itemToSave.link) {
        error('Label and URL are required.')

        return
      }

      let calculatedOrderNo = itemToSave.order_no

      if (itemToSave.isNew) {
        const currentItems = menu[menuIndex].items

        calculatedOrderNo = currentItems.length
      }

      const data = {
        ...itemToSave,
        menu_id: menu[menuIndex].id,
        parent_id: null,
        order_no: calculatedOrderNo
      }

      if (itemToSave.isNew) {
        setLoading(true)

        handleApiResponse(() => createMenuItem(data), {
          success: msg => success(msg || 'Successfully saved!'),
          error: msg => error(msg || 'Failed to saved menu item.'),
          onSuccess: () => {
            setEditingIndex(null)
            setOriginalMenuData(null)
            setLoading(false)
            fetchMenu()
          },
          onError: () => {
            setLoading(false)
          }
        })
      } else {
        setLoading(true)

        handleApiResponse(() => updateMenuItem(itemToSave?.id, data), {
          success: msg => success(msg || 'Successfully saved!'),
          error: msg => error(msg || 'Failed to saved menu item.'),
          onSuccess: () => {
            setEditingIndex(null)
            setOriginalMenuData(null)
            setLoading(false)
            fetchMenu()
          },
          onError: () => {
            setLoading(false)
          }
        })
      }
    },
    [menu, success, error, setLoading, fetchMenu]
  )

  const handleDelete = useCallback(
    (menuIndex, itemIndex) => {
      if (editingIndex !== null) return

      const itemToDelete = menu[menuIndex].items[itemIndex]

      setDeleteIndex({ menuIndex, itemIndex, item: itemToDelete })
    },
    [editingIndex, menu]
  )

  const handleAddItem = useCallback(
    menuIndex => {
      if (editingIndex !== null) {
        error('Please finish editing the current item first.')

        return
      }

      setOriginalMenuData([...menu])

      const currentItems = menu[menuIndex].items
      const maxOrderNo = currentItems.reduce((max, item) => Math.max(max, item.order_no || 0), 0)

      const newItem = {
        label: '',
        link: '',
        isNew: true,
        order_no: maxOrderNo + 1
      }

      let updatedMenu = [...menu]

      updatedMenu[menuIndex] = { ...updatedMenu[menuIndex] }
      updatedMenu[menuIndex].items = [...updatedMenu[menuIndex].items]
      const newItemIndex = updatedMenu[menuIndex].items.length

      updatedMenu[menuIndex].items.push(newItem)

      setMenu(updatedMenu)
      setEditingIndex({ menuIndex, itemIndex: newItemIndex })
    },
    [editingIndex, error, menu]
  )

  const handleDragEnd = useCallback(
    async result => {
      const { source, destination } = result

      if (!destination) {
        return
      }

      const menuIndex = parseInt(destination.droppableId.split('-')[1])

      const sourceIndex = source.index
      const destinationIndex = destination.index

      if (sourceIndex === destinationIndex) {
        return
      }

      const oldMenu = [...menu]

      const menuItems = menu[menuIndex].items
      const reorderedItems = reorder(menuItems, sourceIndex, destinationIndex)

      let updatedMenu = [...menu]

      updatedMenu[menuIndex] = { ...updatedMenu[menuIndex], items: reorderedItems }

      setMenu(updatedMenu)
      setOrderChanged(true)

      await handleApiResponse(
        () => updateMenuItemsOrder(updatedMenu[menuIndex].id, { new_order: reorderedItems.map(item => item.id) }),
        {
          error,
          success,
          onError: () => {
            setMenu(oldMenu)
            setOrderChanged(false)
            error('Failed to update order. Changes have been reverted.')
          }
        }
      )
    },
    [menu, error, success]
  )

  return (
    <>
      <Card>
        <CardHeader title='Menu Settings' />
        <Divider />
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Grid container spacing={5}>
              {menu?.length > 0 ? (
                menu.map((item, menuIndex) => (
                  <Grid item sm={12} key={menuIndex}>
                    <Divider textAlign='left' sx={{ '&::before': { width: 0 } }}>
                      <Typography variant='h6'>Menu {item?.name}</Typography>
                    </Divider>
                    <Droppable droppableId={`menu-${menuIndex}`}>
                      {provided => (
                        <Grid container spacing={3} mt={5} ref={provided.innerRef} {...provided.droppableProps}>
                          {item?.items?.length > 0 &&
                            item.items.map((subItem, itemIndex) => (
                              <Draggable
                                key={subItem.id ? String(subItem.id) : `new-${menuIndex}-${itemIndex}`}
                                draggableId={subItem.id ? String(subItem.id) : `new-${menuIndex}-${itemIndex}`}
                                index={itemIndex}
                                isDragDisabled={editingIndex !== null}
                              >
                                {provided => (
                                  <Grid
                                    item
                                    sm={12}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <MenuItemForm
                                      item={subItem}
                                      menuIndex={menuIndex}
                                      itemIndex={itemIndex}
                                      onEdit={handleEdit}
                                      onCancel={handleCancel}
                                      onSave={handleSave}
                                      onDelete={handleDelete}
                                      handleChange={handleChange}
                                      editingIndex={editingIndex}
                                      addingNew={subItem.isNew}
                                    />
                                  </Grid>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                          <Grid item sm={12}>
                            <Button
                              startIcon={<i className='ri-add-line' />}
                              variant='contained'
                              color='success'
                              size='small'
                              onClick={() => handleAddItem(menuIndex)}
                              disabled={editingIndex !== null}
                            >
                              Add Menu Item
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Droppable>
                  </Grid>
                ))
              ) : (
                <Grid item sm={12}>
                  <Typography variant='body1'>No menus available.</Typography>
                </Grid>
              )}
            </Grid>
          </DragDropContext>
        </CardContent>
        <Divider />
      </Card>
      <DialogBasic
        open={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onSubmit={confirmDelete}
        title='Delete Menu Item'
        description='Are you sure to delete this Menu Item?'
      />
      {SnackbarComponent}
      <BackdropLoading open={loading} />
    </>
  )
}

export default MenuForm
