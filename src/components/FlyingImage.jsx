import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

function FlyingImage({ src, startPos, endPos, onComplete }) {
  const [position, setPosition] = useState({
    x: startPos.x,
    y: startPos.y,
    scale: 1,
    opacity: 1
  })
  const [isAnimating, setIsAnimating] = useState(true)
  const startPosRef = useRef(startPos)
  const endPosRef = useRef(endPos)
  const onCompleteRef = useRef(onComplete)

  // Обновляем refs при изменении пропсов
  useEffect(() => {
    startPosRef.current = startPos
    endPosRef.current = endPos
    onCompleteRef.current = onComplete
  }, [startPos, endPos, onComplete])

  useEffect(() => {
    let animationFrameId = null
    let timeoutId = null
    let isCancelled = false

    const startTime = Date.now()
    const duration = 800 // миллисекунды
    const startX = startPosRef.current.x
    const startY = startPosRef.current.y
    const endX = endPosRef.current.x
    const endY = endPosRef.current.y

    const animate = () => {
      if (isCancelled) return

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Используем easing функцию для плавности
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      const currentX = startX + (endX - startX) * easedProgress
      const currentY = startY + (endY - startY) * easedProgress
      
      // Добавляем параболическую траекторию
      const parabola = 4 * progress * (1 - progress)
      const offsetY = -parabola * 100 // высота дуги

      setPosition({
        x: currentX,
        y: currentY + offsetY,
        scale: 1 - progress * 0.6, // уменьшаем размер по мере движения
        opacity: Math.max(0, 1 - progress * 0.8) // более быстрое исчезновение
      })

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        // Анимация завершена
        setIsAnimating(false)
        // Вызываем onComplete сразу, без задержки
        if (!isCancelled) {
          onCompleteRef.current?.()
        }
      }
    }

    // Небольшая задержка для плавного старта
    timeoutId = setTimeout(() => {
      if (!isCancelled) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }, 50)

    return () => {
      isCancelled = true
      if (timeoutId) clearTimeout(timeoutId)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Запускаем только один раз при монтировании

  // Скрываем компонент, если анимация завершена
  if (!isAnimating) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '80px',
        height: '80px',
        transform: `translate(-50%, -50%) scale(${position.scale})`,
        opacity: position.opacity,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform, opacity'
      }}
      className="transition-opacity duration-100"
    >
      <div className="relative w-full h-full">
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover rounded-lg shadow-2xl border-4 border-white dark:border-gray-800"
          style={{
            borderRadius: '12px',
            filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3))'
          }}
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none" />
      </div>
    </div>,
    document.body
  )
}

export default FlyingImage

