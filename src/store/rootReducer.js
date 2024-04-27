// ** Reducers Imports
import auth from './auth';
import serverInventory from './serverInventory';
const rootReducer = {
  auth: auth,
  serverInventory: serverInventory,
};
export default rootReducer;
