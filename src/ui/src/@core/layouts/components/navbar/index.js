// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'
import {useSelector} from "react-redux";
import NavbarBookmarks from "@layouts/components/navbar/NavbarBookmarks";

const ThemeNavbar = props => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props
    const {userData} = useSelector(state => state.auth)
  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
          <NavbarBookmarks setMenuVisibility={setMenuVisibility} />
      </div>
      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
