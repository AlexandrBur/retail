import Toast from './Toast'

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none">
      <div className="flex flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => onRemove(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ToastContainer

