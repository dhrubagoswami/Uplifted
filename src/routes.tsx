/* eslint-disable react-refresh/only-export-components -- route table, not a component module */
import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from './layouts/PublicLayout'
import { AccountLayout } from './layouts/AccountLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { KioskLayout } from './layouts/KioskLayout'
import { Spinner } from './components/ui/Spinner'
import { DonationFlowProvider } from './contexts/DonationFlowContext'

const Home = lazy(() => import('./pages/public/Home'))
const CampaignsBrowse = lazy(() => import('./pages/public/CampaignsBrowse'))
const CampaignDetail = lazy(() => import('./pages/public/CampaignDetail'))
const DonationFlow = lazy(() => import('./pages/public/DonationFlow'))
const DonationSuccess = lazy(() => import('./pages/public/DonationSuccess'))
const OrganizationProfile = lazy(() => import('./pages/public/OrganizationProfile'))
const HowItWorks = lazy(() => import('./pages/public/HowItWorks'))
const About = lazy(() => import('./pages/public/About'))
const SearchResults = lazy(() => import('./pages/public/SearchResults'))
const Help = lazy(() => import('./pages/public/Help'))
const Login = lazy(() => import('./pages/public/Login'))
const Signup = lazy(() => import('./pages/public/Signup'))
const NotFound = lazy(() => import('./pages/public/NotFound'))
const DevSitemap = lazy(() => import('./pages/public/DevSitemap'))

const AccountOverview = lazy(() => import('./pages/account/AccountOverview'))
const AccountDonations = lazy(() => import('./pages/account/AccountDonations'))
const AccountRecurring = lazy(() => import('./pages/account/AccountRecurring'))
const AccountSaved = lazy(() => import('./pages/account/AccountSaved'))
const AccountSettings = lazy(() => import('./pages/account/AccountSettings'))

const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminCampaigns = lazy(() => import('./pages/admin/AdminCampaigns'))
const AdminCampaignWizard = lazy(() => import('./pages/admin/AdminCampaignWizard'))
const AdminCampaignAnalytics = lazy(() => import('./pages/admin/AdminCampaignAnalytics'))
const AdminDonations = lazy(() => import('./pages/admin/AdminDonations'))
const AdminDonors = lazy(() => import('./pages/admin/AdminDonors'))
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'))
const AdminPayouts = lazy(() => import('./pages/admin/AdminPayouts'))
const AdminKiosks = lazy(() => import('./pages/admin/AdminKiosks'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

const KioskAttract = lazy(() => import('./pages/kiosk/KioskAttract'))
const KioskBrowse = lazy(() => import('./pages/kiosk/KioskBrowse'))
const KioskCampaignDetail = lazy(() => import('./pages/kiosk/KioskCampaignDetail'))
const KioskGive = lazy(() => import('./pages/kiosk/KioskGive'))
const KioskThanks = lazy(() => import('./pages/kiosk/KioskThanks'))

function withSuspense(node: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size={24} />
        </div>
      }
    >
      {node}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: withSuspense(<Home />) },
      { path: '/campaigns', element: withSuspense(<CampaignsBrowse />) },
      { path: '/campaigns/:slug', element: withSuspense(<CampaignDetail />) },
      {
        path: '/campaigns/:slug/donate',
        element: (
          <DonationFlowProvider>
            {withSuspense(<DonationFlow />)}
          </DonationFlowProvider>
        ),
      },
      { path: '/donation/success/:id', element: withSuspense(<DonationSuccess />) },
      { path: '/organizations/:slug', element: withSuspense(<OrganizationProfile />) },
      { path: '/how-it-works', element: withSuspense(<HowItWorks />) },
      { path: '/about', element: withSuspense(<About />) },
      { path: '/search', element: withSuspense(<SearchResults />) },
      { path: '/help', element: withSuspense(<Help />) },
      { path: '/login', element: withSuspense(<Login />) },
      { path: '/signup', element: withSuspense(<Signup />) },
      { path: '/dev/sitemap', element: withSuspense(<DevSitemap />) },
      { path: '*', element: withSuspense(<NotFound />) },
    ],
  },
  {
    path: '/account',
    element: <AccountLayout />,
    children: [
      { index: true, element: withSuspense(<AccountOverview />) },
      { path: 'donations', element: withSuspense(<AccountDonations />) },
      { path: 'recurring', element: withSuspense(<AccountRecurring />) },
      { path: 'saved', element: withSuspense(<AccountSaved />) },
      { path: 'settings', element: withSuspense(<AccountSettings />) },
    ],
  },
  { path: '/admin/login', element: withSuspense(<AdminLoginPage />) },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: withSuspense(<AdminDashboard />) },
      { path: 'campaigns', element: withSuspense(<AdminCampaigns />) },
      { path: 'campaigns/new', element: withSuspense(<AdminCampaignWizard />) },
      { path: 'campaigns/:id', element: withSuspense(<AdminCampaignAnalytics />) },
      { path: 'campaigns/:id/edit', element: withSuspense(<AdminCampaignWizard />) },
      { path: 'donations', element: withSuspense(<AdminDonations />) },
      { path: 'donors', element: withSuspense(<AdminDonors />) },
      { path: 'analytics', element: withSuspense(<AdminAnalytics />) },
      { path: 'payouts', element: withSuspense(<AdminPayouts />) },
      { path: 'kiosks', element: withSuspense(<AdminKiosks />) },
      { path: 'settings', element: withSuspense(<AdminSettings />) },
    ],
  },
  {
    element: <KioskLayout />,
    children: [
      { path: '/kiosk', element: withSuspense(<KioskAttract />) },
      { path: '/kiosk/browse', element: withSuspense(<KioskBrowse />) },
      { path: '/kiosk/campaign/:slug', element: withSuspense(<KioskCampaignDetail />) },
      { path: '/kiosk/give/:slug', element: withSuspense(<KioskGive />) },
      { path: '/kiosk/thanks/:id', element: withSuspense(<KioskThanks />) },
    ],
  },
])
