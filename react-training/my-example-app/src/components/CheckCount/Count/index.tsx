import { useState } from "react";

export default function Count({ count }: { count: number }) {
  console.log(count);
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState<string>("0");

  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? "increasing" : "descreasing");
  }

  return (
    <div>
      <h2>Count</h2>
      <p>Count: {count}</p>
      <p>The count is {trend}</p>
    </div>
  );
}
