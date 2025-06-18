import { CollectionConfig } from 'payload'

export const OrderItems: CollectionConfig = {
  slug: 'orderItems',
  admin: {
    useAsTitle: 'desc',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  timestamps: false,
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const menuId = doc.menu
          const quantity = doc.quantity
          if (menuId) {
            try {
              const response = await fetch(`http://localhost:3000/api/menus/${menuId}`)
              const menu = await response.json()
              const updatedDesc = `${menu.name} x ${quantity}`

              // Update field `desc` setelah dibuat
              await req.payload.update({
                collection: 'orderItems',
                id: doc.id,
                data: { desc: updatedDesc },
              })
            } catch (err) {
              console.error('Error updating desc in orderItems:', err)
            }
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'desc',
      label: 'Description',
      type: 'text',
      defaultValue: '', 
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'menu',
      label: 'Menu',
      type: 'relationship',
      relationTo: 'menus',
      required: true,
    },
    {
      name: 'quantity',
      label: 'Quantity',
      type: 'number',
      required: true,
    },
    {
      name: 'note',
      label: 'Note',
      type: 'text',
    },
  ],
}
