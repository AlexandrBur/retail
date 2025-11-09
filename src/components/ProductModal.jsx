import { useEffect, useRef } from 'react'

function ProductModal({ isOpen, onClose, product, onAddToCart }) {
  const modalRef = useRef(null)

  // Закрытие по клавише Escape и фокус-трап
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Блокируем прокрутку фона при открытом модальном окне
      document.body.style.overflow = 'hidden'
      
      // Фокус на модальное окно для доступности
      if (modalRef.current) {
        modalRef.current.focus()
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Обработчик клика на затемненный фон
  const handleBackdropClick = (e) => {
    // Закрываем только если клик был именно на фоне, а не на модальном окне
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen || !product) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleAddToCart = (e) => {
    // Получаем позицию изображения в модальном окне
    const imageElement = e.currentTarget.closest('.bg-white, .dark\\:bg-gray-800').querySelector('img')
    const imageRect = imageElement?.getBoundingClientRect()
    
    const startPos = imageRect ? {
      x: imageRect.left + imageRect.width / 2,
      y: imageRect.top + imageRect.height / 2
    } : null
    
    onAddToCart(product, startPos)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in transform transition-all outline-none"
        onClick={(e) => e.stopPropagation()}
      >
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Изображение товара */}
            <div className="relative group">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:scale-110 active:scale-95"
                aria-label="Закрыть модальное окно"
                title="Закрыть (Esc)"
              >
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden shadow-inner">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="flex flex-col">
              <h2 id="modal-title" className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {product.name}
              </h2>
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-auto space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(product.price)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium text-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Добавить в корзину
                    </span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500 transition-all font-medium text-lg"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProductModal

