import { useState } from 'react'
import ProductCard from './ProductCard'

const products = [
  {
    id: 1,
    name: 'Смартфон iPhone 15',
    price: 89990,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format&fit=crop',
    description: 'Новейший смартфон с отличной камерой'
  },
  {
    id: 2,
    name: 'Ноутбук MacBook Pro',
    price: 149990,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&auto=format&fit=crop',
    description: 'Мощный ноутбук для работы и творчества'
  },
  {
    id: 3,
    name: 'Наушники AirPods Pro',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&auto=format&fit=crop',
    description: 'Беспроводные наушники с шумоподавлением'
  },
  {
    id: 4,
    name: 'Умные часы Apple Watch',
    price: 34990,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop',
    description: 'Фитнес-трекер и умные часы'
  },
  {
    id: 5,
    name: 'Планшет iPad Air',
    price: 59990,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop',
    description: 'Легкий и мощный планшет'
  },
  {
    id: 6,
    name: 'Камера Canon EOS',
    price: 79990,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&auto=format&fit=crop',
    description: 'Профессиональная зеркальная камера'
  },
]

function ProductList({ onAddToCart, onProductClick }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Товары не найдены</p>
        </div>
      )}
    </div>
  )
}

export default ProductList

