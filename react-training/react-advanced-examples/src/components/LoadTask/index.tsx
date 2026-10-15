import Loading from "@/components/Loading";
import type { Task } from "@/types/Task";
import { Suspense, useCallback, useEffect, useState } from "react";
import { lazy } from "react";

const Tasks = lazy(() => import("@/components/Tasks"));

const LoadTask = ({ apiUrl }: { apiUrl: string }) => {
  const [loadTasks, setLoadTasks] = useState<{
    listTasks: Task[];
    isInitialLoading: boolean;
    isLoadingMore: boolean;
    page: number;
    hasMore: boolean;
  }>({
    listTasks: [],
    isInitialLoading: true,
    isLoadingMore: false,
    page: 1,
    hasMore: true
  });

  const [refresh, setRefresh] = useState(0);

  const fetchTasks = async (page: number, isRefresh = false) => {
    try {
      const response = await fetch(
        `${apiUrl}&page=${page}`
      );
      const data: Task[] = await response.json();
      setLoadTasks((prev) => ({
        listTasks: isRefresh ? data : [...prev.listTasks, ...data],
        isInitialLoading: false,
        isLoadingMore: false,
        page,
        hasMore: data.length === 5,
      }));
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      setLoadTasks((prev) => ({
        ...prev,
        isInitialLoading: false,
        isLoadingMore: false
      }));
    }
  }

  // Call API to fetch the list of tasks
  useEffect(() => {
    setLoadTasks((prev) => ({ ...prev, isInitialLoading: true }));
    fetchTasks(1, true);
  }, [refresh]);

  const handleChangeTask = useCallback(() => {
    setRefresh(prev => prev + 1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadTasks.isLoadingMore || loadTasks.isInitialLoading || !loadTasks.hasMore) return;

    const nextPage = loadTasks.page + 1;
    setLoadTasks((prev) => ({ ...prev, isLoadingMore: true }));
    fetchTasks(nextPage);
  }, [loadTasks]);

  // Render the loading if API call is in progress
  if (loadTasks.isInitialLoading) {
    return <Loading />;
  }

  // Render the list of tasks
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tasks listTasks={loadTasks.listTasks} onChangeTask={handleChangeTask} onLoadMore={handleLoadMore} />
    </Suspense>
  );
};

export default LoadTask;
