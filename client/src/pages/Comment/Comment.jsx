import React, { useEffect } from 'react'

function Comment({show}) {
    useEffect(()=>{
        show()
      }, [])

    return (
        <div>Comment</div>
    )
}

export default Comment