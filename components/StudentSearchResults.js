import { 
    View, 
    Text,
    ScrollView
} from 'react-native'
import React, { useState } from 'react'
import StudentSearchResult from './StudentSearchResult'

export default function StudentSearchResults() {

    const [studentResults, setStudentResults] = useState([
        {
            id:1,
            fullName:"Elvis Darlington Lubowa",
            school:{id:1, name:"Trinity Primary"},
            className:"P.3A"
        },
        {
            id:2,
            fullName:"Sherinah Malaika Nakyejwe",
            school:{id:1, name:"Trinity Primary"},
            className:"P.1A"
        },
        {
            id:3,
            fullName:"Sherinah Malaika Nakyejwe",
            school:{id:1, name:"Trinity Primary"},
            className:"P.1A"
        },
        {
            id:4,
            fullName:"Sherinah Malaika Nakyejwe",
            school:{id:1, name:"Trinity Primary"},
            className:"P.1A"
        }
    ])
  return (
    <ScrollView className="h-auto">
            {
                studentResults.map((student,idx)=>{
                    return(
                        <StudentSearchResult
                            key={idx}
                            student={student}
                        />
                    )
                })
            }
    </ScrollView>
  )
}