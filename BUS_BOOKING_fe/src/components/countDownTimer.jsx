// src/components/CountdownTimer.jsx
import React, { useState, useEffect } from "react";

const CountdownTimer = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expirationTime = new Date(expiresAt);
      const difference = expirationTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        if (onExpire) onExpire();
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  const formatTime = (value) => String(value).padStart(2, "0");

  if (isExpired) {
    return <span className="text-red-500 font-medium">Expired</span>;
  }

  return (
    <div
      className={`font-mono ${
        timeLeft.minutes < 10 ? "text-red-500" : "text-amber-500"
      }`}
    >
      {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
      {formatTime(timeLeft.seconds)}
    </div>
  );
};

export default CountdownTimer;
