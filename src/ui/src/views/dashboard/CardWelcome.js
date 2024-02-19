// ** Reactstrap Imports
import {Card, CardBody, CardText, Button} from 'reactstrap'

// ** Images
import medal from '@src/assets/images/illustration/badge.svg'
import {useSelector} from "react-redux";
import {FaHandHoldingDollar} from "react-icons/fa6";
import {Link} from "react-router-dom";

const CardWelcome = () => {

    const {userData} = useSelector(store => store.auth);
    return (
        <Card className='card-congratulations-medal'>
            <CardBody>
                <h5>Welcome 🎉 {userData.firstName}!</h5>
                {
                    userData.role === "ADMIN" ?
                        (<CardText className='font-small-3'>
                            You are logged in as system admin
                        </CardText>) :
                        (<CardText className='font-small-3'>
                            You are logged on behalf of <br/><b>{userData.school.name}</b>
                        </CardText>)
                }
                <h3 className='mb-75 mt-2 pt-50'>
                    <a href='/' onClick={e => e.preventDefault()}>

                    </a>
                </h3>
                <Button size="sm" outline color='info' onClick={()=>{
                    window.location.href="/apps/user/list"
                }}>
                    User Management
                </Button>
                <img className='congratulation-medal' src={medal} alt='Medal Pic'/>
            </CardBody>
        </Card>
    )
}

export default CardWelcome
