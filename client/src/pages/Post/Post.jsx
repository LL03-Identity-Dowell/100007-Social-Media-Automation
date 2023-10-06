import React, { useEffect } from 'react'

function Post({show}) {
    useEffect(()=>{
        show()
      }, [])
      
    return (
        <div>Post</div>
    )
}

export default Post