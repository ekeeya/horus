// ** Reducers Imports
import auth from './auth';
import inventory from './inventory';
import orders from './orders';
const rootReducer = {
  auth: auth,
  inventory: inventory,
  orders: orders,
};
export default rootReducer;
