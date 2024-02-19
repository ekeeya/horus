import { lazy } from 'react'

const DashboardAnalytics = lazy(() => import('../../views/dashboard/analytics'))

const DashboardRoutes = [
  {
    path: '/dashboard/',
    element: <DashboardAnalytics />,
    meta:{
      action:"read",
      resource:"dashboard"
    }
  }
]

export default DashboardRoutes
