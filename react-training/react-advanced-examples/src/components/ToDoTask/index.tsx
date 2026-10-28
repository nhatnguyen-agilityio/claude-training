import { ClipboardList } from "lucide-react"
import ToDoCard from "../ToDoCard"
import { useEffect, useState } from "react";
import type { Task } from "@/types/Task";
import { Skeleton } from "@/components/ui/skeleton";
import AddTaskModal from "../AddTaskModal";
import { NavLink } from "react-router-dom";

const ToDoTask = () => {
  const [todoItems, setTodoItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const [completedRes, inProgressRes] = await Promise.all([
          fetch("https://683417dd464b499636014699.mockapi.io/api/v1/tasks?status=Not%20Started&limit=3&sortBy=createdAt&order=desc"),
          fetch("https://683417dd464b499636014699.mockapi.io/api/v1/tasks?status=In%20Progress&limit=3&sortBy=createdAt&order=desc")
        ]);

        const [completedTasks, inProgressTasks] = await Promise.all([
          completedRes.json(),
          inProgressRes.json()
        ]);

        const combined = [...completedTasks, ...inProgressTasks]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        setTodoItems(combined);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [refresh]);

  const handleSuccess = () => {
    setRefresh(refresh + 1);
  }

  return (
    <div className="shadow-xl px-4 py-6">
      <div className="header flex justify-between px-3">
        <div className="title flex">
          <ClipboardList />
          <span className="text-destructive">To-Do</span>
        </div>
        <div className="add-task flex text-xs flex items-center">
          <AddTaskModal onSuccess={handleSuccess} />
        </div>
      </div>
      <div className="mt-6 border-b-2 pb-8">
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full rounded-lg mb-3 h-47"
            />
          ))
          : todoItems.slice(0, 2).map((task) => (
            <NavLink to={`tasks/${task.id}`} key={task.id}>
              <ToDoCard key={task.id} task={task} />
            </NavLink>
          ))}
      </div>
      <div className="pt-6">
        {loading ? <Skeleton className="w-full rounded-lg mb-3 h-47" /> :
          todoItems.slice(2).map((task) => (
            <NavLink to={`tasks/${task.id}`} key={task.id}>
              <ToDoCard key={task.id} task={task} />
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}

export default ToDoTask
