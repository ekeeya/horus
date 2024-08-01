// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap'

import {useSelector} from "react-redux";

// ** Icons Imports
import {User} from 'react-feather'

// ** User Components
import ParentStudentsList from "./ParentStudentsList";
import  Expenditure from './Expenditure'
import {FaMoneyBillTransfer} from "react-icons/fa6";
import Deposits from "@src/views/apps/students/view/Deposits";
import {MdOutlinePayments} from "react-icons/md";
import {AiOutlineMoneyCollect} from "react-icons/ai";

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
                  <MdOutlinePayments className='font-medium-3 me-50' />
                  <span className='fw-bold'>Expenditure</span>
              </NavLink>
          </NavItem>
          <NavItem>
              <NavLink active={active === '3'} onClick={() => toggleTab('3')}>
                  <AiOutlineMoneyCollect className='font-medium-3 me-50' />
                  <span className='fw-bold'>Deposits</span>
              </NavLink>
          </NavItem>
      </Nav>
      <TabContent activeTab={active}>
          <TabPane tabId='1'>
              {<ParentStudentsList data={selectedStudent.contributors ? selectedStudent.contributors : []} />}
          </TabPane>
        <TabPane tabId='2'>
          <Expenditure student={selectedStudent.id}/>
        </TabPane>
          <TabPane tabId='3'>
            <Deposits student={selectedStudent.id}/>
          </TabPane>
      </TabContent>
    </Fragment>
  )
}
export default UserTabs
