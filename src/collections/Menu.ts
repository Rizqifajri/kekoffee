import { CollectionConfig } from 'payload'

// collections/Menus.ts
const Menus: CollectionConfig = {
  slug: 'menus',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'price', type: 'number', required: true },
    { name: 'category', type: 'select', options: ['food', 'drink'], required: true },
    { name: 'available', type: 'checkbox', defaultValue: true },
    { name: 'popular', type: 'checkbox' },
    {
      name: 'thumbnail',
      label: 'Thumbnail Image',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      required: true,
    },
  ],
}

export default Menus
