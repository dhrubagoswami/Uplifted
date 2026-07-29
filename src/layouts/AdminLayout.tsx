import { Outlet, useLocation } from 'react-router-dom'
import { RequireAuth } from '../components/RequireAuth'
import { AdminRail } from '../components/AdminRail'
import { AdminTopbar } from '../components/AdminTopbar'

const BREADCRUMBS: { test: RegExp; label: string }[] = [
  { test: /^\/admin\/campaigns\/new$/, label: 'New campaign' },
  { test: /^\/admin\/campaigns\/[^/]+\/edit$/, label: 'Edit campaign' },
  { test: /^\/admin\/campaigns\/[^/]+$/, label: 'Campaign analytics' },
  { test: /^\/admin\/campaigns$/, label: 'Campaigns' },
  { test: /^\/admin\/donations$/, label: 'Donations' },
  { test: /^\/admin\/donors$/, label: 'Donors' },
  { test: /^\/admin\/analytics$/, label: 'Analytics' },
  { test: /^\/admin\/payouts$/, label: 'Payouts' },
  { test: /^\/admin\/kiosks$/, label: 'Kiosks' },
  { test: /^\/admin\/settings$/, label: 'Settings' },
  { test: /^\/admin$/, label: 'Dashboard' },
]

function breadcrumbFor(pathname: string): string {
  return BREADCRUMBS.find((b) => b.test.test(pathname))?.label ?? 'Dashboard'
}

export function AdminLayout() {
  const location = useLocation()

  return (
    <RequireAuth role="admin">
      <div className="flex min-h-screen bg-bg">
        <AdminRail />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar breadcrumb={breadcrumbFor(location.pathname)} />
          <div className="flex-1 p-7">
            <Outlet />
          </div>
        </div>
      </div>
    </RequireAuth>
  )
}
