import React, { useState } from "react";

const DepartTime = () => {
  const [departBus, setDepartBus] = useState("");

  const handleDepartBusChange = (e) => {
    setDepartBus(e.target.value);
  };
  return (
    <div className="w-full space-y-4">
      {!departBus ? (
        <div className="w-full grid grid-cols-2 gap-10">
          <div className="col-span-1 space-y-4">
            <label
              htmlFor="departBus"
              className="block mb-2 font-medium text-neutral-900 dark:text-neutral-50"
            >
              Depart Time
            </label>
            <input
              type="text"
              name="departBus"
              id="departBus"
              value={departBus}
              onChange={handleDepartBusChange}
              placeholder="Enter Location"
              className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="w-full flex items-center gap-x-3">
            <div className="w-fit text-base font-semibold">
              Bus Depart at:-{" "}
              <span className="ml-1 5 font-medium">{departBus}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartTime;
