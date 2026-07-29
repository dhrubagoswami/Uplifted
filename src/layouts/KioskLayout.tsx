import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useIdleTimeout } from '../hooks/useIdleTimeout'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Logo } from '../components/ui/Logo'

export function KioskLayout() {
  const navigate = useNavigate()
  const [exitPromptOpen, setExitPromptOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const { warning, reset } = useIdleTimeout(60_000, () => navigate('/kiosk'))

  return (
    <div className="min-h-screen bg-bg text-text">
      <button
        type="button"
        aria-label="Exit kiosk mode"
        onClick={() => setExitPromptOpen(true)}
        className="fixed left-5 top-5 z-40 flex items-center justify-center rounded-xl bg-surface/80 p-1.5 shadow-[0_4px_20px_rgba(0,0,0,.35)] backdrop-blur-sm"
        style={{ minWidth: 44, minHeight: 44 }}
      >
        <Logo size={32} />
      </button>

      <Outlet />

      <Modal open={warning} onClose={reset} title="Still there?">
        <p className="mb-6 font-sans text-sm text-text-2">
          This session will reset in a few seconds due to inactivity.
        </p>
        <Button size="lg" className="w-full" onClick={reset}>
          I'm still here
        </Button>
      </Modal>

      <Modal open={exitPromptOpen} onClose={() => setExitPromptOpen(false)} title="Leave kiosk mode?">
        <p className="mb-6 font-sans text-sm text-text-2">
          You'll return to the main Uplifted site and this session will be reset.
        </p>
        <div className="flex flex-col gap-2.5">
          <Button size="lg" className="w-full" onClick={() => navigate('/')}>
            Yes, go to home
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="w-full"
            onClick={() => setExitPromptOpen(false)}
          >
            Stay in kiosk
          </Button>
        </div>
      </Modal>
    </div>
  )
}
