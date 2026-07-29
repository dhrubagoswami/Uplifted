import { Outlet } from 'react-router-dom'
import { RequireAuth } from '../components/RequireAuth'
import { AccountRail } from '../components/AccountRail'

export function AccountLayout() {
  return (
    <RequireAuth role="donor">
      <div className="flex bg-bg">
        <AccountRail />
        <main className="min-w-0 flex-1 px-12 py-10">
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  )
}
