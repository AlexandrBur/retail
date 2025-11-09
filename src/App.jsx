import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import ProductList from './components/ProductList'
import Cart from './components/Cart'
import ToastContainer from './components/ToastContainer'

const CART_STORAGE_KEY = 'internet-shop-cart'
const THEME_STORAGE_KEY = 'internet-shop-theme'

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    return savedCart ? JSON.parse(savedCart) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const [toasts, setToasts] = useState([])

  // Функция для добавления тоста
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  // Функция для удаления тоста
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // Экспорт функции для оформления заказа (используется в Cart)
  useEffect(() => {
    window.showOrderToast = () => {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const formattedTotal = new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'RUB', 
        minimumFractionDigits: 0 
      }).format(total)
      showToast(`Заказ на сумму ${formattedTotal} успешно оформлен!`, 'success', 4000)
    }
    return () => {
      delete window.showOrderToast
    }
  }, [cartItems, showToast])

  // Применение темы к документу
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    // Проверяем, есть ли товар в корзине перед обновлением
    const existingItem = cartItems.find(item => item.id === product.id)
    
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === product.id)
      if (item) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...product, quantity: 1 }]
    })
    
    // Показываем уведомление один раз
    if (existingItem) {
      showToast(`Количество "${product.name}" увеличено в корзине`, 'success')
    } else {
      showToast(`"${product.name}" добавлен в корзину`, 'success')
    }
  }

  const removeFromCart = (productId) => {
    const item = cartItems.find(item => item.id === productId)
    if (item) {
      showToast(`"${item.name}" удален из корзины`, 'info')
    }
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const item = cartItems.find(item => item.id === productId)
    if (item) {
      showToast(`Количество "${item.name}" изменено на ${quantity}`, 'info', 2000)
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        cartItemCount={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
      <main className="container mx-auto px-4 py-8">
        <ProductList onAddToCart={addToCart} />
      </main>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

export default App

