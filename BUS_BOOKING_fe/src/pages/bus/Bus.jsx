import React from 'react'

import Bus1 from '../../assets/bus1.png'

const Bus = () => {
  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 my-[8ch]">
        <div className="w-full grid-cols-6 gap-14 bg-neutral-200/60 dark:bg-neutral-900 rounded-md px-6 py-5 items-center justify-between">
            <div className="flex items-center gap-x-2.5 col-span-2">
            <input
              type="number"
              name="seat"
              id="seat"
              placeholder="Search Buses"
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            />
            </div>
        </div>
    </div>
  )
}

export default Bus