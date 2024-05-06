// ** React Imports
import { Fragment } from 'react'
import Breadcrumbs from '@components/breadcrumbs'
import { Row, Col } from 'reactstrap'
import Table from './Table'
import '@styles/react/libs/tables/react-dataTable-component.scss'

const Tables = () => {
  return (
    <Fragment>
      <Breadcrumbs title='Sales' data={[{ title: 'Sales' }]} />
      <Row>
        <Col sm='12'>
          <Table />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Tables
