import React, { useEffect } from 'react'

function Topic({show}) {
  useEffect(()=>{
    show()
  }, [])

  return (
    <div>Topic</div>
  )
}

export default Topic