import React from 'react'

function ExtraSmallBtn({ title, onClick }) {
    return (
        <>
            <div>
                <button type="button" className="px-6 py-2 text-xs font-medium text-center text-white bg-customBlue rounded-lg hover:bg-blue-800   dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={onClick}>{title}</button>
            </div>

        </>

    )
}

export default ExtraSmallBtn