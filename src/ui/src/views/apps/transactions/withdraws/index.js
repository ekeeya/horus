// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Breadcrumbs from '@components/breadcrumbs'

// ** Third Party Components
import { Row, Col } from 'reactstrap'

// ** Demo Components
import Table from './Table'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Breadcrumbs title='Transactions' data={[{ title: 'Withdraws' }]} />
      <Row>
        <Col sm='12'>
          <Table />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
