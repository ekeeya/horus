// ** Reducers Imports
import auth from './auth';
import inventory from './inventory';
import orders from './orders';
import payment from './payment';
const rootReducer = {
  auth: auth,
  inventory: inventory,
  orders: orders,
  payment: payment,
};
export default rootReducer;
