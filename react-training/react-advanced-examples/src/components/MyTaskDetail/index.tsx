import type { Task } from "@/types/Task"
import Image from "../common/Image"

import githubImage from "@/assets/github.png"
import { getPriorityColor } from "@/constants/priority-class"
import { getStatusColor } from "@/constants/status-class"
import DeleteTask from "../DeleteTask"
import EditTaskModal from "../EditTaskModal"

const MyTaskDetail = ({ task, onChangeTask }: { task: Task, onChangeTask: () => void}) => {

  return (
    <>
      <div className="flex text-left">
        <div className="w-36 h-36 mr-4 min-w-36">
          <Image src={task.image || githubImage} alt="Task" className="h-full w-full" />
        </div>
        <div className="flex flex-col justify-end">
          <h4 className="text-md font-extrabold mb-3">{task.title}</h4>
          <p className="mb-3 text-sm">Priority: <span className={getPriorityColor(task.priority || "")}>{task.priority}</span></p>
          <p className="text-sm">Status: <span className={getStatusColor(task.status || "")}>{task.status}</span></p>
          <p className="text-[10px] mt-3 text-gray-400 flex">Created on: {new Date(task.createdAt).toISOString().slice(0, 10)}</p>
        </div>
      </div>
      {task?.description ? (
        <p className="mt-7 text-left text-base leading-relaxed">{task.description}</p>
      ) : null}
      <div className="mt-auto flex justify-end">
        <DeleteTask
          id={task.id || ""}
          title={task?.title || ""}
          onDeleted={onChangeTask}
        />
        <EditTaskModal
          id={task.id || ""}
          title={task?.title || ""}
          description={task?.description || ""}
          createdAt={new Date(task?.createdAt || Date.now())}
          priority={task?.priority || ""}
          onSuccess={onChangeTask}
        />
      </div>
    </>
  )
}

export default MyTaskDetail
