// Mirrors com.farmafriend.erp.constants.ProductCategory on the backend.
export const PRODUCT_CATEGORIES = [
  'SEEDS',
  'FERTILIZERS',
  'PESTICIDES',
  'FUNGICIDES',
  'HERBICIDES',
  'PLANT_GROWTH_REGULATORS',
  'MICRONUTRIENTS',
  'BIO_FERTILIZERS',
  'DRIP_IRRIGATION',
  'SPRAYERS',
  'IRRIGATION_EQUIPMENT',
  'FARM_TOOLS',
  'AGRICULTURAL_MACHINERY',
  'ANIMAL_FEED',
  'VETERINARY_PRODUCTS',
  'ORGANIC_FARMING',
  'GREENHOUSE_SUPPLIES',
  'HARVESTING_EQUIPMENT',
  'STORAGE_PRODUCTS',
  'GARDENING_PRODUCTS',
]

export const formatCategoryLabel = (category) =>
  category ? category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : ''
