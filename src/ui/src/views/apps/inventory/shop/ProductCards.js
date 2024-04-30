// ** React Imports
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Card, CardBody, CardText, Button } from 'reactstrap'
import {BiPencil} from "react-icons/bi";

const ProductCards = props => {
  const {
    store,
    products,
    dispatch,
    activeView,
    getProducts,
  } = props

  const renderProducts = () => {
    if (products.length) {
      return products.map(item => {

        return (
          <Card className='ecommerce-card' key={item.name}>
            <div className='item-img text-center mx-auto'>
              {/*<img className='img-fluid card-img-top' src={`data:image/png;base64,${item.category.image}`} alt={item.name} />*/}
            </div>
            <CardBody>
              <div className='item-wrapper'>
                <div className='item-cost'>
                  <h6 className='item-price'>${item.price}</h6>
                </div>
              </div>
              <h6 className='item-name'>
                <Link className='text-body' to={`/apps/ecommerce/product-detail/${item.id}`}>
                  {item.name}
                </Link>
              </h6>
              <CardText className='item-description'>{item.category.name}</CardText>
              <CardText className='item-description'>{item.quantity.toLocaleString()} Pieces</CardText>
            </CardBody>
            <div className='item-options text-center'>
              <div className='item-wrapper'>
                <div className='item-cost'>
                  <h4 className='item-price'>{item.price.toLocaleString()}/=</h4>
                </div>
              </div>
              <Button
                className='btn-wishlist'
                color='light'
                onClick={() => console.log(item)}
              >
                <BiPencil
                  className={classnames('me-50')}
                  size={14}
                />
                <span>Edit</span>
              </Button>
            </div>
          </Card>
        )
      })
    }
  }

  return (
    <div
      className={classnames({
        'grid-view': activeView === 'grid',
        'list-view': activeView === 'list'
      })}
    >
      {renderProducts()}
    </div>
  )
}

export default ProductCards
