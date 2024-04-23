import { 
    View, 
    Text,
    ScrollView
} from 'react-native'
import React, { useState } from 'react'
import StudentSearchResult from './StudentSearchResult'

export default function StudentSearchResults() {

    
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