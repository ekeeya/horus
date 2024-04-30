// ** React Imports
import { Fragment, useState, useEffect } from 'react'
// ** Styles
import '@styles/react/apps/app-ecommerce.scss'

// ** Shop Components
import Sidebar from './Sidebar'
import Products from './Products'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {getCategories, getProducts} from '../store'


const Shop = () => {
  // ** States
  const [activeView, setActiveView] = useState('list')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ** Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.inventory)

  // ** Get products
  useEffect(() => {
      dispatch(getProducts({}))
      dispatch(getCategories({}))
  }, [dispatch])

  return (
    <Fragment>
      <Breadcrumbs title='Inventory' data={
          [
              { title: 'Items' },
              { title: 'List' }
          ]} />
      <Products
        store={store}
        dispatch={dispatch}
        activeView={activeView}
        getProducts={getProducts}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      {<Sidebar sidebarOpen={sidebarOpen} categories={store.categories} />}
    </Fragment>
  )
}
export default Shop
