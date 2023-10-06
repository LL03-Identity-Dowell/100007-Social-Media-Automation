import React from 'react'

function ExtraSmallBtn({ title }) {
    return (
        <>
            <div>
                <button type="button" class="px-3 py-2 text-xs font-medium text-center text-white bg-customBlue rounded-lg hover:bg-blue-800   dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{title}</button>
            </div>

        </>

    )
}

export default ExtraSmallBtn