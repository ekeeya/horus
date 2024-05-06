// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import ParentView from "@src/views/apps/parents/view";
import StudentView from "@src/views/apps/students/view";
import PosList from "@src/views/apps/schools/pos/Table";


const UserList = lazy(() => import('../../views/apps/user/list'))
const SchoolList = lazy(() => import('../../views/apps/schools/list'))
const StudentList = lazy(() => import('../../views/apps/students/list'))
const LinkRequestList = lazy(() => import('../../views/apps/students/requests'))
const ParentList = lazy(() => import('../../views/apps/parents/list'))
const UserView = lazy(() => import('../../views/apps/user/view'))
const CardProvisioningRequestList = lazy(() => import('../../views/apps/students/cards'))
const CollectionsList = lazy(() => import('../../views/apps/transactions/collections'))
const PaymentsList = lazy(() => import('../../views/apps/transactions/payments'))
const WithDrawsList = lazy(() => import('../../views/apps/transactions/withdraws'))
const WithdrawRequests = lazy(() => import('../../views/apps/finance/list'))
const VirtualAccounts = lazy(() => import('../../views/apps/finance/accounts'))
const Inventory  = lazy(() => import('../../views/apps/inventory/shop'))
const OrdersList  = lazy(() => import('../../views/apps/inventory/orders'))
const SalesList  = lazy(() => import('../../views/apps/inventory/sales'))
const AppRoutes = [

  {
    element: <UserList />,
    path: '/apps/user/list',
    meta:{
      action:"manage",
      resource:"users"
    }
  },
  {
    element: <SchoolList />,
    path: '/schools/list',
    meta:{
      action:"manage",
      resource:"schools"
    }
  },
  {
    element: <PosList />,
    path: '/schools/pos/list',
    meta:{
      action:"manage",
      resource:"schools"
    }
  },
  {
    element: <StudentList />,
    path: '/students/list',
    meta:{
      action:"manage",
      resource:"students"
    }
  },
  {
    element: <CardProvisioningRequestList />,
    path: '/cards/provisioning',
    meta:{
      action:"manage",
      resource:"cards"
    }
  },
  {
    element: <CollectionsList />,
    path: '/transactions/collections',
    meta:{
      action:"manage",
      resource:"transactions"
    }
  },
  {
    element: <PaymentsList />,
    path: '/transactions/payments',
    meta:{
      action:"manage",
      resource:"transactions"
    }
  },
  {
    element: <WithDrawsList />,
    path: '/transactions/withdraws',
    meta:{
      action:"manage",
      resource:"transactions"
    }
  },
  {
    element: <StudentView />,
    path: '/students/view/:id',
    meta:{
      action:"manage",
      resource:"students"
    }
  },
  {
    element: <LinkRequestList />,
    path: '/parents/links-requests',
    meta:{
      action:"manage",
      resource:"requests"
    }
  },
  {
    element: <ParentList />,
    path: '/parents/list',
    meta:{
      action:"manage",
      resource:"parents"
    }
  },
  {
    element: <ParentView />,
    path: '/apps/parents/view/:id',
    meta:{
      action:"manage",
      resource:"parents"
    }
  },
  {
    path: '/apps/user/view',
    element: <Navigate to='/apps/user/view/1' />,
    meta:{
      action:"manage",
      resource:"users"
    }
  },
  {
    element: <UserView />,
    path: '/apps/user/view/:id',
    meta:{
      action:"manage",
      resource:"users"
    }
  },
  {
    element: <WithdrawRequests />,
    path: '/finance/withdraws-requests',
    meta:{
      action:"manage",
      resource:"finance"
    }
  },
  {
    element: <VirtualAccounts />,
    path: '/finance/virtual-accounts',
    meta:{
      action:"manage",
      resource:"finance"
    }
  },
  {
    element: <Inventory />,
    path: '/inventory/items',
    meta:{
      action:"manage",
      className: 'ecommerce-application',
      resource:"inventory"
    }
  },
  {
    element: <OrdersList />,
    path: '/orders/list',
    meta:{
      action:"manage",
      className: 'ecommerce-application',
      resource:"inventory"
    }
  },
  {
    element: <SalesList />,
    path: '/sales/list',
    meta:{
      action:"manage",
      className: 'ecommerce-application',
      resource:"inventory"
    }
  },
]

export default AppRoutes
