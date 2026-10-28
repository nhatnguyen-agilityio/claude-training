import { BookCheck } from "lucide-react";
import ChartCard from "../ChartCard";
import { useEffect, useState } from "react";

const statuses = ["Not Started", "In Progress", "Completed"];

const colors: Record<string, string> = {
  "Not Started": "#dc2626",
  "In Progress": "#1d4ed8",
  "Completed": "#15803d",
};

console.log(colors)

const TaskStatus = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const urls = statuses.map(
        (status) =>
          `https://683417dd464b499636014699.mockapi.io/api/v1/tasks?status=${status}`
      )

      const responses = await Promise.all(
        urls.map((url) =>
          fetch(url)
            .then((res) => res.json())
            .catch(() => [])
        )
      )

      const newCounts: Record<string, number> = {}
      responses.forEach((data, i) => {
        newCounts[statuses[i]] = data.length
      })

      const totalCount = Object.values(newCounts).reduce(
        (sum, val) => sum + val,
        0
      )

      setCounts(newCounts)
      setTotal(totalCount)
    }
    fetchCounts()
  }, []);


  return (
    <div className="shadow-xl p-3 mt-3">
      <div className="flex">
        <BookCheck />
        <span className="text-destructive">Task Status</span>
      </div>
      <div className="flex pb-7">
        {statuses.map((status, index) => {
          const count = counts[status] || 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0
          const data = [
            { name: status, value: count, fill: colors[status] },
            {
              name: "others",
              value: total - count,
              fill: "#e5e7eb",
            },
          ]
            return (
              <ChartCard
                key={status}
                data={data}
                index={index}
                status={status}
                percent={percent}
              />
            )
          })}
      </div>
    </div>
  )
};

export default TaskStatus;
