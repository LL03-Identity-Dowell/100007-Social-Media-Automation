import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'

function MyPlan({close}) {
    useEffect(() => {
        close()
    }, [])
    return (
        <div className="bg-pens bg-cover bg-center h-[90vh]">
            <div className="bg-overlay max-w-5xl mx-auto my-6 h-[85vh] shadow-lg shadow-gray-400">
                <div className="flex justify-center items-center flex-col h-full w-full">
                    <div>
                        <h2 className="text-customBlue font-bold text-2xl xl:text-4xl pb-12">Choose Your Plan</h2>
                    </div>
                    <div className="flex justify-center items-center mt-6 md:mt-8">
                        <Link to="/"
                              className="bg-customBlue px-10 py-2 text-white rounded-md  flex items-center gap-3">See
                            Pricing</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyPlan