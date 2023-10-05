import React, { useEffect } from 'react'

function MyUsage({show}) {
    useEffect(()=>{
        show()
      }, [])
    return (
        <div>MyUsage</div>
    )
}

export default MyUsage