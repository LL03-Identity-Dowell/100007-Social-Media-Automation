import React, { useEffect } from 'react'

function NotFound({close}) {
    useEffect(()=>{
        close()
      }, [])
    return (
        <div>Page not Found</div>
    )
}

export default NotFound