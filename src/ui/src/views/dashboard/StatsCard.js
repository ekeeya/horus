// ** Third Party Components
import classnames from 'classnames'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Spinner} from 'reactstrap'
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {fetchStatistics} from "@src/views/dashboard/store";
import {FaUniversity} from "react-icons/fa";
import {FcBriefcase, FcMoneyTransfer, FcPaid} from "react-icons/fc";
import {FaChildren} from "react-icons/fa6";

const StatsCard = ({ cols }) => {
    // state
    const [data, setData] =  useState([])

    const {userData} = useSelector(store=>store.auth);
    const {statistics, loading} = useSelector(store=>store.dashboard);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchStatistics());
    }, [])

    useEffect(()=>{
        const info =  [];
        if(statistics){
            info.push({title:statistics.students.total.toLocaleString(),subtitle:"Students",color:"light-info",icon:<FaChildren size={24}/>})
            info.push({title:statistics.totalCollections.toLocaleString(),subtitle:"In Collections",color:"light-success",icon:<FcMoneyTransfer size={24}/>})
            info.push({title:statistics.totalPayments.toLocaleString(),subtitle:"In Payments",color:"light-warning",icon:<FcPaid size={24}/>})
            if (userData.role==="ADMIN"){
                info.push({title:statistics.schools,subtitle:"Schools",color:"light-primary",icon:<FaUniversity size={24}/>})
            }else{
                info.push({title:statistics.balance.toLocaleString(),subtitle:"Acc. Balance",color:"light-primary",icon:<FcBriefcase size={24}/>})
            }
        }
        setData(info)
    },[statistics])

    const renderData = () => {
        return data.map((item, index) => {
            const colMargin = Object.keys(cols)
            const margin = index === 2 ? 'sm' : colMargin[0]
            return (
                <Col
                    key={index}
                    {...cols}
                    className={classnames({
                        [`mb-2 mb-${margin}-0`]: index !== data.length - 1
                    })}
                >
                    <div className='d-flex align-items-center'>
                        <Avatar color={item.color} icon={item.icon} className='me-2' />
                        <div className='my-auto'>
                            <h4 className='fw-bolder mb-0 font-small-3'>{item.title}</h4>
                            <CardText className='font-small-2 mb-0'>{item.subtitle}</CardText>
                        </div>
                    </div>
                </Col>
            )
        })
    }

    return (
        <Card className='card-statistics'>
            <CardHeader>
                <CardTitle tag='h4'>Statistics</CardTitle>
            </CardHeader>
            <CardBody className='statistics-body'>
                {loading ? <div className="d-flex flex-row justify-content-center align-items-center" ><Spinner/> </div>: <Row>{renderData()}</Row>}
            </CardBody>
        </Card>
    )
}

export default StatsCard
