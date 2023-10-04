import React, { useEffect } from 'react'

function Schedule({show}) {
    useEffect(()=>{
        show()
      }, [])
    return (
        <div>Schedule</div>
    )
}

export default Schedule