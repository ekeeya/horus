// ** Reactstrap Imports
import {
    Row,
    Col,
    CardHeader,
    Card,
    CardText,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button,
} from 'reactstrap'
import CardWelcome from "@src/views/dashboard/CardWelcome";
import StatsCard from "@src/views/dashboard/StatsCard";
import ChartjsPolarAreaChart from "../charts/ChartjsPolarAreaChart"
import {useContext, useEffect, useState} from "react";
import {useSkin} from "@hooks/useSkin";
import {ThemeColors} from "@src/utility/context/ThemeColors";
import Collections from "@src/views/apps/transactions/collections/Table";
import Payments from "@src/views/apps/transactions/payments/Table";
import WithDraws from "@src/views/apps/transactions/withdraws/Table";
import {ChevronDown} from "react-feather";
import ApexRadiarChart from "@src/views/dashboard/charts/ApexRadiarChart";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchCardProvisioningRequestsSummary,
    fetchLinkRequestSummary,
    fetchPosSalesSummary, fetchSchoolSalesSummary
} from "@src/views/dashboard/store";
// ** Styles

import HorizontalBarChart from "@src/views/dashboard/charts/ChartjsHorizontalBarChart";
import {generateColors} from "@utils";
const AnalyticsDashboard = () => {

    const dispatch  =  useDispatch();
    const {userData} =  useSelector(store=>store.auth)
    const [type, setType] =  useState( {value:"PAYMENT", label:"Select Expenditure"},);

    const [types, setTypes] = useState([
        {value:"PAYMENT", label:"Purchase Expenditure"},
        {value:"COLLECTION", label:"Card Deposit Expenditure"},
        {value:"WITHDRAW", label:"Cash Withdraw Expenditure"},
    ])

    const { colors } = useContext(ThemeColors),
        { skin } = useSkin(),
        gridLineColor = 'rgba(200, 200, 200, 0.2)',
        labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b'

    useEffect(()=>{
        if (userData.role === "ADMIN"){
            dispatch(fetchCardProvisioningRequestsSummary())
            dispatch(fetchSchoolSalesSummary())
        }else{
            dispatch(fetchPosSalesSummary())
            dispatch(fetchLinkRequestSummary())
        }

    }, [userData])

  return (
    <div id='dashboard-analytics' className="h-25">
      <Row >
        <Col xl='4' md='6' xs='12'>
            <CardWelcome />
        </Col>
          <Col xl='8' md='6' xs='12'>
              <StatsCard cols={{ xl: '3', sm: '6' }} />
          </Col>
      </Row>
      <Row >
          <Col lg='4' xs='12'>
              <ChartjsPolarAreaChart
                  labelColor={labelColor}
              />
          </Col>
          <Col lg='4' xs='12'>
              <ApexRadiarChart/>
          </Col>
          <Col lg='4' xs='12'>
              <HorizontalBarChart
                  labelColor={labelColor}
                  gridLineColor={gridLineColor}
              />
          </Col>
      </Row>
        <Row className='match-height'>
            <Col xl='12' md='12' xs='12'>
                <Card>
                    <CardHeader >
                        <CardText className='card-text font-small-2 me-25 mb-0'>
                            <UncontrolledDropdown >
                                <DropdownToggle className='cursor-pointer' tag='span'>
                                    <Button size="sm" outline >
                                        <ChevronDown size={20}/>
                                        {type.label}
                                    </Button>
                                </DropdownToggle>
                                <DropdownMenu end>
                                    <DropdownItem onClick={()=>{setType(types[0])}} active={type.value==="PAYMENT"} className='w-100'>Purchase Transactions</DropdownItem>
                                    <DropdownItem onClick={()=>{setType(types[1])}} active={type.value==="COLLECTION"} className='w-100'>Card Deposit Transactions</DropdownItem>
                                    <DropdownItem onClick={()=>{setType(types[2])}} active={type.value==="WITHDRAW"} className='w-100'>Cash WithDraw Transactions</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </CardText>

                    </CardHeader>
                    {
                        type.value === "PAYMENT" && <Payments/>
                    }
                    {
                        type.value === "COLLECTION" && <Collections/>
                    }
                    {
                        type.value === "WITHDRAW" && <WithDraws/>
                    }
                </Card>

            </Col>
        </Row>
    </div>
  )
}

export default AnalyticsDashboard
