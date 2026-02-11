
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aros de Gala Rosé',
    price: 45000,
    images: [
      'https://picsum.photos/seed/acc1/600/600',
      'https://picsum.photos/seed/acc2/600/600'
    ],
    stock: 12,
    description: 'Aros elegantes con acabado en oro rosa y cristales brillantes.',
    // Fixed: Changed orderIndex to order_index to match Product type
    order_index: 0,
    category: 'Aros'
  },
  {
    id: '2',
    name: 'Collar Perla Elegance',
    price: 85000,
    images: [
      'https://picsum.photos/seed/acc3/600/600'
    ],
    stock: 5,
    description: 'Collar de perlas cultivadas con broche de seguridad de alta calidad.',
    // Fixed: Changed orderIndex to order_index to match Product type
    order_index: 1,
    category: 'Collares'
  },
  {
    id: '3',
    name: 'Pulsera Cristalina',
    price: 35000,
    images: [
      'https://picsum.photos/seed/acc4/600/600'
    ],
    stock: 20,
    description: 'Pulsera ajustable con dijes de cristal facetado.',
    // Fixed: Changed orderIndex to order_index to match Product type
    order_index: 2,
    category: 'Pulseras'
  }
];

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('es-PY') + ' Gs.';
};
