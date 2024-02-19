// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

import {useSelector} from "react-redux";

// ** Icons Imports
import {User} from 'react-feather'

// ** User Components
import ParentStudentsList from "./ParentStudentsList";
import  Transactions from './Transactions'
import {FaMoneyBillTransfer} from "react-icons/fa6";

const UserTabs = ({ active, toggleTab }) => {
    const {selectedStudent} =  useSelector(store=>store.students)
  return (
    <Fragment>
      <Nav pills className='mb-2'>
          <NavItem>
              <NavLink active={active === '1'} onClick={() => toggleTab('1')}>
                  <User className='font-medium-3 me-50' />
                  <span className='fw-bold'>Contributors</span>
              </NavLink>
          </NavItem>
          <NavItem>
              <NavLink active={active === '2'} onClick={() => toggleTab('2')}>
                  <FaMoneyBillTransfer className='font-medium-3 me-50' />
                  <span className='fw-bold'>Transactions</span>
              </NavLink>
          </NavItem>
      </Nav>
      <TabContent activeTab={active}>
          <TabPane tabId='1'>
              {<ParentStudentsList data={selectedStudent.contributors ? selectedStudent.contributors : []} />}
          </TabPane>
        <TabPane tabId='2'>
          <Transactions />
        </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
