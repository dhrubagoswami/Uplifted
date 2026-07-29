import { Outlet } from 'react-router-dom'
import { RequireAuth } from '../components/RequireAuth'
import { AccountRail } from '../components/AccountRail'

export function AccountLayout() {
  return (
    <RequireAuth role="donor">
      <div className="flex flex-col bg-bg lg:flex-row">
        <AccountRail />
        <main className="min-w-0 flex-1 px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
          <Outlet />
        </main>
      </div>
    </RequireAuth>
  )
}
