import { useEffect, useState, useRef } from "react";
import type { Task } from "@/types/Task"
import MyTaskDetail from "../MyTaskDetail"
import ToDoCard from "../ToDoCard"

const Tasks = ({
  listTasks = [],
  onChangeTask,
  onLoadMore,
}: {
  listTasks: Task[],
  onChangeTask: () => void,
  onLoadMore: () => void
}) => {
  const [taskDetail, setTaskDetail] = useState<Task>(listTasks[0]);
  const [taskId, setTaskId] = useState<string>(listTasks[0].id);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentTask = listTasks.find(task => task.id === taskId);

    if (currentTask) {
      setTaskDetail(currentTask);
    }
  }, [listTasks, taskId]);

  // Handle infinite scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        onLoadMore();
      }
    };

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [onLoadMore]);

  return (
    <div className="grid grid-cols-2 gap-5 min-h-200 mt-15" >
      <div className="h-200 overflow-y-auto border rounded-md scrollbar-none shadow-md border-gray-300" ref={scrollContainerRef}>
        <div className="sticky top-0 bg-white p-3 pl-5 z-10">
          <h4 className="text-xl font-bold text-left">
            <span className="underline underline-offset-6 decoration-2 decoration-orange-700">My </span>Tasks
          </h4>
        </div>
        <div className="p-5 pt-0">
          {listTasks.map((task) => (
            <div key={task.id} className="cursor-pointer" onClick={() => setTaskId(task.id)}>
              <ToDoCard task={task} />
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-white p-3 z-10"></div>
      </div>
      <div className="shadow-md border border-gray-300 rounded-md p-5 flex flex-col">
        <MyTaskDetail task={taskDetail} onChangeTask={onChangeTask} />
      </div>
    </div>
  )
}

export default Tasks

