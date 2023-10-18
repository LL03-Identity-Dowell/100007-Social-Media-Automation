import React, { useEffect } from 'react'

function MyTeam({show}) {
    useEffect(()=>{
        show()
      }, [])

    return (
        <div>MyTeam</div>
    )
}

export default MyTeam