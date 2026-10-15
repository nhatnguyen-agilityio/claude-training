import Image from "@/components/common/Image"
import { Circle } from "lucide-react"

import githubImage from "@/assets/github.png"
import { getStatusColor } from "@/constants/status-class";
import { getPriorityColor } from "@/constants/priority-class";
import type { Task } from "@/types/Task";

const ToDoCard = ({ task }: { task: Task }) => {
  return (
    <div className="flex border border-gray-400 mt-3 p-3 rounded-2xl hover:bg-gray-100">
      <div className="pt-1">
        <Circle className={`mr-4 w-4 h-4 ${getStatusColor(task.status || "")}`} />
      </div>
      <div className="content flex flex-col text-left w-full">
        <div className="flex mb-8 justify-between">
          <div className="flex flex-col w-4/5 min-w-81">
            <h5 className="mb-3 truncate font-extrabold">{task.title}</h5>
            <p className="text-sm mr-3 opacity-70 clamp-4">{task.description}.</p>
          </div>
          <div className="w-22 h-22 mt-7">
            <Image src={task.image || githubImage} alt="Task" className="h-full w-full" />
          </div>
        </div>
        <div className="flex text-[10px]">
          <p className="mr-3">Priority: <span className={getPriorityColor(task.priority || "")}>{task.priority}</span></p>
          <p className="mr-3">Status: <span className={getStatusColor(task.status || "")}>{task.status}</span></p>
          <p>Created on: {new Date(task.createdAt).toISOString().slice(0, 10)}</p>
        </div>
      </div>
    </div>
  )
}

export default ToDoCard
