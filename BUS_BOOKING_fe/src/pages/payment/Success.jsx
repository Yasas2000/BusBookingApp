import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "src/utils/useToast";

const Success = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { errorToast, successToast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const bookingIds = searchParams.getAll("id");
    const paymentId = searchParams.get("session_id");
    axios
      .post("/payment/book-and-pay", {
        bookingIds: bookingIds,
        paymentId: paymentId,
      })
      .then((res) => successToast("Payment Successful"))
      .catch((err) => {
        errorToast(err);
      })
      .finally(() => {
        navigate("/booking");
      });
  }, []);
  return <div className="flex justify-center items-center h-24">Loading</div>;
};

export default Success;
