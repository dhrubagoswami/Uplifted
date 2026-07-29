import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useIdleTimeout } from '../hooks/useIdleTimeout'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export function KioskLayout() {
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const { warning, reset } = useIdleTimeout(60_000, () => navigate('/kiosk'))

  return (
    <div className="min-h-screen bg-bg text-text">
      <Outlet />
      <Modal open={warning} onClose={reset} title="Still there?">
        <p className="mb-6 font-sans text-sm text-text-2">
          This session will reset in a few seconds due to inactivity.
        </p>
        <Button size="lg" className="w-full" onClick={reset}>
          I'm still here
        </Button>
      </Modal>
    </div>
  )
}
