// ** Reactstrap Imports
import {Card, CardTitle, CardBody, CardHeader} from 'reactstrap'
import PaymentTransactions from "@src/views/apps/transactions/payments/Table";

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

const Transactions = ({studentId}) => {
  return (
      <PaymentTransactions student={studentId}/>
  )
}

export default Transactions
