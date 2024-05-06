// ** React Imports
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import {Card, CardBody, CardText, Button, ButtonGroup} from 'reactstrap'
import {BiPencil} from "react-icons/bi";
import {deleteItems, setSelectedProduct} from "@src/views/apps/inventory/store";
import {HiTrash} from "react-icons/hi";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";


const ProductCards = props => {
  const {
    store,
    products,
    dispatch,
    activeView,
  } = props

  const showSwal = (item)=>{
    withReactContent(Swal).fire({
      title: "Do you want to  Continue?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Cancel`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await dispatch(deleteItems(item.id))
        Swal.fire("Deleted!", "", "success");
      }
    });
  }

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
              <ButtonGroup>
                <Button
                    tag='label'
                    className='btn-wishlist'
                    color='light'
                    onClick={() => dispatch(setSelectedProduct(item))}
                >
                  <BiPencil
                      className={classnames('me-50')}
                      size={14}
                  />
                  <span>Edit</span>
                </Button>
                <Button
                    tag='label'
                    outline
                    className='btn-wishlist'
                    color='danger'
                    onClick={()=> showSwal(item)}
                >
                  <HiTrash
                      className={classnames('me-20')}
                      size={14}
                  />
                  <span>Delete</span>
                </Button>
              </ButtonGroup>

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
