// ** Navigation imports
import schools from './schools'
import finances from './finances'
import access from './access'
import dashboards from './dashboards'
import studentsAndParents from './students-parents'

// ** Merge & Export
export default [...dashboards, ...schools,...studentsAndParents, ...finances, ...access]
