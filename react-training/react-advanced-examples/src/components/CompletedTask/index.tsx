import { BookmarkCheck } from "lucide-react"
import ToDoCard from "../ToDoCard"
import { useEffect, useState } from "react";
import type { Task } from "@/types/Task";
import { Skeleton } from "@/components/ui/skeleton";
import { NavLink } from "react-router-dom";

const CompletedTask = () => {
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "https://683417dd464b499636014699.mockapi.io/api/v1/tasks?status=Completed&page=1&limit=2&sortBy=createdAt&order=desc"
        );
        const data = await response.json();
        setCompletedTasks(data);
      } catch (error) {
        console.error("Failed to fetch completed tasks", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  return (
    <div className="mt-5 shadow-xl p-3">
      <div className="flex pt-3">
        <BookmarkCheck />
        <span className="text-destructive">Completed Tasks</span>
      </div>
      <div className="p-1">
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full rounded-lg mb-3 h-47"
            />
          ))
          : completedTasks.slice(0, 2).map((task) => (
            <NavLink to={`tasks/${task.id}`} key={task.id}>
              <ToDoCard key={task.id} task={task} />
            </NavLink>))}
      </div>
    </div>
  )
}

export default CompletedTask
