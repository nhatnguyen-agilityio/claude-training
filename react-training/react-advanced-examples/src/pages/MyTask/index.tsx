import LoadTask from "@/components/LoadTask";

const MyTask =  () => {
  const apiUrl = "https://683417dd464b499636014699.mockapi.io/api/v1/tasks?limit=5&sortBy=createdAt&order=desc"

  return (
    <LoadTask apiUrl={apiUrl} />
  );
};

export default MyTask;
