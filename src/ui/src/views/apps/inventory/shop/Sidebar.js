// ** Custom Hooks
import { useRTL } from '@hooks/useRTL'

import classnames from 'classnames'

// ** Reactstrap Imports
import { Card, CardBody, Row, Col, Input, Button, Label } from 'reactstrap'


const Sidebar = props => {
  // ** Props
  const { sidebarOpen } = props
  const {categories } = props


  // ** Hooks
  const [isRtl] = useRTL()

  // ** Array of categories


  return (
    <div className='sidebar-detached sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('sidebar-shop', {
            show: sidebarOpen
          })}
        >
          <Row>
            <Col sm='12'>
              <h6 className='filter-heading d-none d-lg-block'>Categories</h6>
            </Col>
          </Row>
          <Card>
            <CardBody>
              <div id='product-categories'>
                <div id='clear-filters' className="mb-2">
                  <Button color='primary' block>
                    Add Category
                  </Button>
                </div>
                <ul className='list-unstyled categories-list'>
                  {categories.map(category => {
                    return (
                      <li key={category.id}>
                        <div className='form-check'>
                          <Input
                            type='radio'
                            id={category.id.toString()}
                            name='category-radio'
                            defaultChecked={category.defaultChecked}
                          />
                          <Label className='form-check-label' for={category.id.toString()}>
                            {category.name}
                          </Label>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div id='clear-filters'>
                <Button color='primary' block>
                  Clear All Filters
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
