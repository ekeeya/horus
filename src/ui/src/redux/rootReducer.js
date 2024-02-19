// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import users from '@src/views/apps/user/store'
import schools from '@src/views/apps/schools/store'
import students from '@src/views/apps/students/store'
import transactions from "@src/views/apps/transactions/store"
import finance from "@src/views/apps/finance/store"
import dashboard from "@src/views/dashboard/store";

const rootReducer = {
  auth,
  schools,
  students,
  users,
  transactions,
  finance,
  dashboard,
  navbar,
  layout
}

export default rootReducer
