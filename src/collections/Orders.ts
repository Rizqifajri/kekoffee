import { randomUUID } from 'crypto'
import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'table',
  },
  fields: [
    {
      name: 'table',
      label: 'Table',
      type: 'select',
      options: [
        {
          label: 'Table 1',
          value: '1',
        },
        {
          label: 'Table 2',
          value: '2',
        },
        {
          label: 'Table 3',
          value: '3',
        },
        {
          label: 'Table 4',
          value: '4',
        },
        {
          label: 'Table 5',
          value: '5',
        },
        {
          label: 'Table 6',
          value: '6',
        },
        {
          label: 'Table 7',
          value: '7',
        },
        {
          label: 'Table 8',
          value: '8',
        },
        {
          label: 'Table 9',
          value: '9',
        },
        {
          label: 'Table 10',
          value: '10',
        },
      ],
      required: true,
    },
    {
      name: 'name',
      label: 'Customer Name',
      type: 'text',
      required: false,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      access: {
        update: () => true, // ✅ izinkan update field ini
      },
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'pending',
      required: true,
    },
    {
      name: 'items',
      label: 'Items',
      type: 'relationship',
      relationTo: 'orderItems',
      hasMany: true,
      required: true,
    },
    {
      name: 'totalPrice',
      label: 'Total Price',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    // TAMBAHAN: Field yang missing dari frontend
    {
      name: 'type',
      label: 'Order Type',
      type: 'select',
      options: [
        {
          label: 'Dine In',
          value: 'dine-in',
        },
        {
          label: 'Take Away',
          value: 'takeaway',
        },
      ],
      defaultValue: 'dine-in',
      required: true,
    },
    {
      name: 'payment',
      label: 'Payment Method',
      type: 'select',
      options: [
        {
          label: 'Cash',
          value: 'cash',
        },
        {
          label: 'E-Wallet',
          value: 'ewallet',
        },
      ],
      defaultValue: 'cash',
      required: true,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      required: false,
    },
  ],
}
