import React from 'react'

function MyPlan({show}) {
    useEffect(()=>{
        show()
      }, [])
    return (
        <div>MyPlan</div>
    )
}

export default MyPlan