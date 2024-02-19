
import { Fragment } from 'react'
import Spinner from '@components/spinner/Loading-spinner'
import { CardText } from 'reactstrap'
const Loader = () => {
    return (
      <Fragment>
        <Spinner />
        <CardText className='mb-0 mt-1 text-white'>Please Wait...</CardText>
      </Fragment>
    )
  }

  export default Loader;