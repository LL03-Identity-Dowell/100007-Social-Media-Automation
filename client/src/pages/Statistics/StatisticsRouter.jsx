import React from 'react'
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

            <Routes>

                <Route path="my-plan" element={<MyPlan />} />
                <Route path="my-team" element={<MyTeam />} />
                <Route path="my-usage" element={<MyUsage />} />
                <Route path="*" element={<NotFound />} />

            </Routes>

        </>

    )
}

export default StatisticsRouter