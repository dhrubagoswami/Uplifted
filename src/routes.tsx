import { createBrowserRouter } from 'react-router-dom'
import Shell from './pages/public/Shell'
import DevSitemap from './pages/public/DevSitemap'

export const router = createBrowserRouter([
  { path: '/', element: <Shell /> },
  { path: '/dev/sitemap', element: <DevSitemap /> },
])
