import React, { useEffect, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const [total, setTotal] = useState(0);
  const location = useLocation();
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const bookings = location.state?.bookings
    const totalPrice = location.state?.total;

    setBookingData(bookings);
    setTotal(totalPrice)
  }, [])

  const getTotalSeats = (seatArray) => {
    return seatArray.length;
  }

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hour = date.getHours();
    const minute = String(date.getMinutes()).padStart(2, "0");

    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    if (hour === 0) hour = 12;

    const hourStr = String(hour).padStart(2, "0");

    return `${year}-${month}-${day} ${hourStr}.${minute} ${ampm}`;
  }

  return (
    <div className="w-full lg:px-28 md:px-16 sm:px-7 px-4 mt-[13ch] mb-[8ch] space-y-14">
      <div className="grid grid-cols-5 gap-16 items-start">
        <div className="col-span-3 space-y-7 pr-20">
          <h2 className="text-xl text-neutral-800 dark:text-neutral-100 font-medium">
            Passenger Information
          </h2>
          <form action="" className="space-y-6">
            <div className="">
              <label htmlFor="fullname" className="block mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                id="fullname"
                placeholder="Enter Full Name"
                className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
              />
            </div>
            <div className="">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="e.g: ymeka2000@gmail.com"
                className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
              />
              <small className="block mt-1 text-xs text-neutral-500 dark:text-neutral-600 font-normal">
                You will get your tickets via this email address.
              </small>
            </div>
            <div className="">
              <label htmlFor="phone" className="block mb-2 font-medium">
                Phone Number
              </label>
              <input
                type="number"
                name="phone"
                id="phone"
                placeholder="eg 0788127829"
                className="w-full appearance-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 inline-block bg-neutral-200/60 dark:bg-neutral-900/60 px-3 h-12 border border-neutral-200 dark:border-neutral-900 rounded-md focus:outline-none focus:bg-neutral-100 dark:focus:bg-neutral-900"
              />
            </div>
          </form>
        </div>
        <div className="col-span-2 space-y-8">
          <div className="bg-neutral-200/50 dark:bg-neutral-900/70 rounded-md py-5 px-7">
            <h2 className="text-xl text-center text-neutral-800 dark:text-neutral-100 font-medium border-b-2 border-neutral-200 dark:border-neutral-800/40 ">
              Your Booking Status
            </h2>

            {bookingData.map((booking) => (
              <div className="space-y-8 pb-3">
                <div className="space-y-4">
                  <h6 className="text-base text-neutral-700 dark:text-neutral-200 font-medium">
                    <span className="font-bold">TRIP ID:- {booking._id}</span>
                  </h6>
                  <div>Trip date/time:- <span></span> {formatDateTime(booking?.trip_id?.departure)}</div>
                  <div className="w-full flex items-center gap-x-3">
                    <div className="w-fit text-base">
                      From:- <span className="ml-1 5">{booking.trip_id.from}</span>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-[1px] border border-dashed border-neutral-400 dark:border-neutral-700/80"></div>
                    </div>
                    <div className="w-fit text-base">
                      To:- <span className="ml-1 5">{booking?.trip_id?.to}</span>
                    </div>
                  </div>
                  <div className="w-full flex items-center gap-x-3">
                    <div className="w-fit text-base">
                      Depart at:-
                      <span className="ml-1 5">
                        {booking.trip_id?.departure ? new Date(booking.trip_id.departure).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="w-full flex items-center justify-between">
                      <h6 className="text-base text-neutral-700 dark:text-neutral-200 font-medium">
                        Total No. of Seats
                      </h6>

                      <h6 className="text-base text-neutral-700 dark:text-neutral-200 font-medium">
                        {getTotalSeats(booking.seatNumbers)}
                      </h6>
                    </div>

                    <div className="w-full flex items-center justify-between">
                      <h6 className="text-base text-neutral-700 dark:text-neutral-200 font-medium">
                        Total amount per trip
                      </h6>

                      <h6 className="text-base text-neutral-700 dark:text-neutral-200 font-medium">
                        {booking?.price}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))
            }
            <br />
            <div className="w-full flex items-center justify-between">
              <h6 className="text-base text-neutral-700 dark:text-neutral-200 font-bold">
                TOTAL AMOUNT TO BE PAID
              </h6>

              <h6 className="text-base text-neutral-700 dark:text-neutral-200 font-medium">
                {total}
              </h6>
            </div>
            <br />
            <button className="w-full px-8 h-12 bg-violet-600 text-neutral-50 text-base font-normal rounded-md flex items-center justify-center gap-x-2">
              Processed to Pay Now <FaArrowRightLong />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
