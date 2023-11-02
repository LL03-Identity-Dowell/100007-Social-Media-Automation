import React, { useEffect } from 'react'

function Article({show}) {
  useEffect(()=>{
    show()
  }, [])
  
  return (
    <div>Article</div>
  )
}

export default Article
