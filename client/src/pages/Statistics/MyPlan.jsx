import React, { useEffect } from 'react'

function MyPlan({show}) {
    useEffect(()=>{
        show()
      }, [])
    return (
        <div className='border-blue-600 border'>MyPlan</div>
    )
}

export default MyPlan