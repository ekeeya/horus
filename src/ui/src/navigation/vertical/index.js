// ** Navigation imports
import schools from './schools'
import finances from './finances'
import reports from './reports'
import access from './access'
import dashboards from './dashboards'
//import cardsAndAccounts from './cards-accounts'
import cards from "./cards";
import studentsAndParents from './students-parents'

// ** Merge & Export
export default [...dashboards, ...schools,...cards,...studentsAndParents, ...finances, ...reports, ...access]
