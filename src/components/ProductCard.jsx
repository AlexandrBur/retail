import { useState } from 'react'

function ProductCard({ product, onAddToCart, onProductClick }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleCardClick = (e) => {
    // Не открываем модальное окно, если клик был на кнопке
    if (e.target.closest('button')) {
      return
    }
    onProductClick?.(product)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Fallback изображение (placeholder)
  const fallbackImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${encodeURIComponent(product.name)}%3C/text%3E%3C/svg%3E`

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-full"></div>
          </div>
        )}
        <img
          src={imageError ? fallbackImage : product.image}
          alt={product.name}
          className={`w-full h-full object-cover hover:scale-110 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const cardElement = e.currentTarget.closest('.bg-white, .dark\\:bg-gray-800')
              const imageRect = cardElement?.querySelector('img')?.getBoundingClientRect()
              
              // Получаем позицию изображения товара
              const startPos = imageRect ? {
                x: imageRect.left + imageRect.width / 2,
                y: imageRect.top + imageRect.height / 2
              } : null
              
              onAddToCart(product, startPos)
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

