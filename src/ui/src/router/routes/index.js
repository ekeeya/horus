// ** React Imports
import { Fragment } from 'react'

// ** Routes Imports
import AppRoutes from './Apps'
import PagesRoutes from './Pages'
import DashboardRoutes from './Dashboards'
import AuthenticationRoutes from './Authentication'

// ** Layouts
import VerticalLayout from '@src/layouts/VerticalLayout'
import LayoutWrapper from '@src/@core/layouts/components/layout-wrapper'

// ** Route Components
import PublicRoute from '@components/routes/PublicRoute'
import PrivateRoute from '@components/routes/PrivateRoute'

// ** Utils
import { isObjEmpty } from '@utils'

const getLayout = {
  vertical: <VerticalLayout />
}

// ** Document title
const TemplateTitle = '%s - Cashless';

// ** Default Route
const DefaultRoute = '/dashboard/'

// ** Merge Routes
const Routes = [
  ...AuthenticationRoutes,
  ...DashboardRoutes,
  ...AppRoutes,
  ...PagesRoutes,
]

const getRouteMeta = route => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter(route => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) && defaultLayout === layout)
      ) {
        let RouteTag = PrivateRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === 'blank' ? (isBlank = true) : (isBlank = false)
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = layout => {
  const defaultLayout = layout || 'vertical'
  const layouts = ['vertical']

  const AllRoutes = []

  layouts.forEach(layoutItem => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: '/',
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
