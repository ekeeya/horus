// ** React Imports
import { Outlet } from 'react-router-dom'

// ** Core Layout Import
import Layout from '@layouts/VerticalLayout'

// ** Menu Items Array
import navigation from '../navigation/admins';
import schoolNav from "@src/navigation/school";
import posNav from "@src/navigation/pos";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

const VerticalLayout = props => {
    const [nav, setNav] = useState([])

    const {userData} =  useSelector(store=>store.auth);

    useEffect(()=>{
        const sideBarNav = userData.role === "SCHOOL" ? schoolNav : userData.role === "POS" ? posNav  :navigation;
        setNav(sideBarNav);
    },[userData])


  return (
    <Layout menuData={nav} {...props}>
      <Outlet />
    </Layout>
  )
}

export default VerticalLayout
