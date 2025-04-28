import React, { useState } from "react";

const Destination = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleFromChange = (e) => {
    setFrom(e.target.value);
  };
  const handleToChange = (e) => {
    setTo(e.target.value);
  };
  const isDestinationSelected = from && to;

  return (
    <div className="w-full space-y-4">
      {!isDestinationSelected ? (
        <div className="w-full grid grid-cols-2 gap-10">
          <div className="col-span-1 space-y-4">
            <label
              htmlFor="from"
              className="block mb-2 font-medium text-neutral-900 dark:text-neutral-50"
            >
              From
            </label>
            <input
              type="text"
              name="from"
              id="from"
              value={from}
              onChange={handleFromChange}
              placeholder="Enter Location"
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            />
          </div>
          <div className="col-span-1 space-y-4">
            <label
              htmlFor="to"
              className="block mb-2 font-medium text-neutral-900 dark:text-neutral-50"
            >
              To
            </label>
            <input
              type="text"
              name="to"
              id="to"
              value={to}
              onChange={handleToChange}
              placeholder="Enter Location"
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <h1 className="text-xl text-neutral-800 dark:text-neutral-100 font-medium">
            Your Destination
          </h1>
          <div className="w-full flex items-center gap-x-3">
            <div className="w-fit text-base font-semibold">
              From:- <span className="ml-1 5 font-medium">{from}</span>
            </div>
            <div className="flex-1">
              <div className="w-full h-[1px] border border-dashed-neutral-200 dark:border-neutral-800/80"></div>
            </div>
            <div className="w-fit text-base font-semibold">
              To:- <span className="ml-1 5 font-medium">{}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Destination;
