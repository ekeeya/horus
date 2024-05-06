// ** React Imports
import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { Row, Col } from 'reactstrap'
import Table from './Table'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Breadcrumbs title='Orders' data={[{ title: 'Orders' }]} />
      <Row>
        <Col sm='12'>
          <Table />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
