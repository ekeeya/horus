// ** Reactstrap Imports
import { Card, CardTitle, CardBody, Table, Input, Button } from 'reactstrap'

const typesArr = [
  {
    title: 'New for you',
    defaultChecked: ['email']
  },
  {
    title: 'Account activity',
    defaultChecked: ['browser', 'app']
  },
  {
    title: 'A new browser used to sign in',
    defaultChecked: ['email', 'browser', 'app']
  },
  {
    title: 'A new device is linked',
    defaultChecked: ['browser']
  }
]

const Transactions = () => {
  return (
    <Card>
      <CardBody>
        <CardTitle className='mb-50' tag='h4'>
          Transactions
        </CardTitle>
      </CardBody>
    </Card>
  )
}

export default Transactions
