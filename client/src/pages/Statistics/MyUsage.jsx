import React from 'react'

function MyUsage({show}) {
    useEffect(()=>{
        show()
      }, [])
    return (
        <div>MyUsage</div>
    )
}

export default MyUsage