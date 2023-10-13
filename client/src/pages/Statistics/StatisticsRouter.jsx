import React, { useEffect } from 'react'
import { Route, Routes } from "react-router-dom"

import MyPlan from './MyPlan'
import MyTeam from './MyTeam'
import MyUsage from './MyUsage'
import NotFound from '../NotFound/NotFound'

function StatisticsRouter({show}) {

    useEffect(()=>{
        show()
      }, [])
      
    return (
        <>


                


        </>

    )
}

export default StatisticsRouter