// ** Navigation imports
import schools from './schools'
import finances from './finances'
import access from './access'
import dashboards from './dashboards'
import studentsAndParents from './students-parents'
import inventory from "@src/navigation/pos/inventory";

// ** Merge & Export
export default [...dashboards, ...schools,...studentsAndParents, ...finances, ...access]
