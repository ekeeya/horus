// ** Reducers Imports
import auth from './auth';
import students from './students';
import transactions from './transactions';
import wallet from './wallet';

const rootReducer = {
  auth,
  students,
  transactions,
  wallet
};
export default rootReducer;