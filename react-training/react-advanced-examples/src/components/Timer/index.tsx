import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

const Timer = () => {
  const [searchParams] =useSearchParams();
  const location = useLocation();
  console.log(location.pathname);
  console.log(location.search);
  console.log(location.hash);
  console.log(location.state);
  console.log(location.key);
  const time = searchParams.get("timer");
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(time ? Number(time) : 10);


  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds <= 0) {
      clearInterval(interval);
      navigate("/docs/")
    }

    return () => clearInterval(interval);
  }, [seconds, navigate]);


  return (
    <div>
      <h1>{seconds}s</h1>
    </div>
  );
}
export default Timer;
