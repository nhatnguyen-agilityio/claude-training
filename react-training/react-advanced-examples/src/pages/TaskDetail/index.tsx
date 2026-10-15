import Image from "@/components/common/Image";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import githubImage from "@/assets/github.png"
import { useEffect, useState } from "react";
import type { Task } from "@/types/Task";
import { getPriorityColor } from "@/constants/priority-class";
import { getStatusColor } from "@/constants/status-class";
import { Skeleton } from "@/components/ui/skeleton";

import EditTaskModal from "@/components/EditTaskModal";
import DeleteTask from "@/components/DeleteTask";
import NotFound from "@/components/NotFound";


const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [taskDetail, setTaskDetail] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [isNotFound, setIsNotFound] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/tasks/${taskId}`);
        console.log(response)
        if (!response.ok) {
          if (response.status === 404) {
            setIsNotFound(true);
          }
          throw new Error("Failed to fetch task detail");
        }
        const data = await response.json();
        setTaskDetail(data);
      } catch (error) {
        console.error("Failed to fetch task detail", error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetail();
    }
  }, [taskId, refresh]);

  const handleEditSuccess = () => {
    setRefresh(refresh + 1);
  }

  const handleDeleteSuccess = () => {
    navigate("/dashboard", { replace: true });
  }

  if (isNotFound) {
    return <NotFound />
  }

  return (
    <div className="rounded-2xl shadow-sm border-1 p-4 min-h-210 flex flex-col">
      <div className="flex">
        <div className="h-50 w-50 mr-7">
          <Image src={taskDetail?.image || githubImage} alt="Task" className="w-full h-full" />
        </div>
        <div className="text-left">
          <div className="text-2xl font-extrabold">{loading ? <Skeleton className="w-70 rounded-lg mb-3 h-3 " /> : taskDetail?.title}</div>
          <div className="text-xs mt-3 flex">Priority:{loading ? <Skeleton className="w-20 rounded-lg mb-3 h-3 ml-2" /> : <span className={`${getPriorityColor(taskDetail?.priority || "")} ml-2`}> {taskDetail?.priority}</span>}</div>
          <div className="text-xs mt-3 flex">Status: {loading ? <Skeleton className="w-20 rounded-lg mb-3 h-3 ml-2" /> : <span className={`${getStatusColor(taskDetail?.priority || "")} ml-2`}>{taskDetail?.status}</span>}</div>
          <div className="text-[10px] mt-3 text-gray-400 flex">Created on: {loading ? <Skeleton className="w-20 rounded-lg mb-3 h-3 ml-2" /> : new Date(taskDetail?.createdAt || "").toISOString().slice(0, 10)}</div>
        </div>
        <NavLink to="/dashboard" className={"ml-auto underline decoration-1.5 w-50 pt-1 h-fit"}>Go back</NavLink>
      </div>
      <div className="text-left mt-10">{loading ? <Skeleton className="w-full rounded-lg mb-3 h-50" /> : taskDetail?.description}</div>
      <div className="mt-auto flex justify-end">
        <DeleteTask
          id={taskId || ""}
          title={taskDetail?.title || ""}
          onDeleted={handleDeleteSuccess}
        />
        <EditTaskModal
          id={taskId || ""}
          title={taskDetail?.title || ""}
          description={taskDetail?.description || ""}
          createdAt={new Date(taskDetail?.createdAt || Date.now())}
          priority={taskDetail?.priority || ""}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  );
};

export default TaskDetail;
