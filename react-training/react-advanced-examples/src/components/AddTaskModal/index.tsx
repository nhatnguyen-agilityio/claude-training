import { uploadImage } from "@/utils/handle-upload-image";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { date, file, nonEmpty, object, pipe, string, type InferOutput } from "valibot";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import TaskForm from "../TaskForm";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

const AddTaskFormSchema = object({
  title: pipe(
    string(),
    nonEmpty('Title is required')
  ),
  createdAt: date("Date is required"),
  priority: pipe(
    string(),
    nonEmpty('Priority is required')
  ),
  description: pipe(
    string(),
    nonEmpty('Description is required')
  ),
  image: file("Image is required")
});

const AddTaskModal = ({ onSuccess }: { onSuccess?: () => void }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<InferOutput<typeof AddTaskFormSchema>>({
    resolver: valibotResolver(AddTaskFormSchema),
    defaultValues: {
      title: '',
      createdAt: new Date(),
      priority: '',
      description: '',
      image: undefined
    }
  })

  const onSubmit = async (data: InferOutput<typeof AddTaskFormSchema>) => {
    setIsLoading(true);
    let imageUrl: string | undefined = undefined;
    if (data.image) {
      imageUrl = await uploadImage(data.image as File) ?? undefined;
    }

    const payload = {
      ...data,
      image: imageUrl,
      status: "Not Started"
    };

    fetch("https://683417dd464b499636014699.mockapi.io/api/v1/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then((response) => {
      if (response.ok) {
        setIsLoading(false);
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } else {
        console.error("Failed to add task");
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black opacity-50 shadow-none hover:bg-white hover:border hover:border-destructive">
          <Plus width={12} height={12} className="text-destructive" />
          <span className="ml-1">Add task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-230 h-177" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="hidden">Add Task</DialogTitle>
          <DialogDescription className="hidden">Add Task</DialogDescription>
          <div className="flex justify-between">
            <h4 className="text-xl font-bold"><span className="underline underline-offset-4 decoration-2 decoration-orange-700">Add </span>Task</h4>
            <DialogClose asChild>
              <p className="cursor-pointer text-base underline">
                Go back
              </p>
            </DialogClose>
          </div>
        </DialogHeader>
        <TaskForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskModal
