import React, { useEffect } from 'react'

function NotFound({show}) {
    useEffect(()=>{
        show()
      }, [])
    return (
        <div>Page not Found</div>
    )
}

export default NotFound