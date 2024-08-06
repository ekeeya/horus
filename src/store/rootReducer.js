// ** Reducers Imports
import auth from './auth';
import inventory from './inventory';
import orders from './orders';
import payment from './payment';
import reports from './reports';
const rootReducer = {
  auth: auth,
  inventory: inventory,
  orders: orders,
  payment: payment,
  reports: reports,
};
export default rootReducer;
