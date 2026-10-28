import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import editIcon from "@/assets/edit.svg"
import Image from "../common/Image";
import { useForm } from "react-hook-form";
import { date, file, nonEmpty, object, optional, pipe, string, type InferOutput } from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { memo, useEffect, useState } from "react";
import { uploadImage } from "@/utils/handle-upload-image";
import TaskForm from "../TaskForm";

const EditTaskFormSchema = object({
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
  image: optional(file())
});

const EditTaskModal = (
  {
    id,
    title,
    description,
    createdAt,
    priority,
    onSuccess
  }: {
    id: string,
    title: string,
    description: string,
    createdAt: Date,
    priority: string,
    onSuccess: () => void
  }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<InferOutput<typeof EditTaskFormSchema>>({
    resolver: valibotResolver(EditTaskFormSchema),
    defaultValues: {
      title: title,
      createdAt: new Date(createdAt),
      priority: priority,
      description: description,
      image: undefined
    }
  })

  useEffect(() => {
    form.reset({
      title,
      createdAt: new Date(createdAt),
      priority,
      description,
      image: undefined
    });
  }, [title, createdAt, priority, description, form]);

  const onSubmit = async (data: InferOutput<typeof EditTaskFormSchema>) => {
    setIsLoading(true);
    let imageUrl: string | undefined = undefined;
    if (data.image) {
      imageUrl = await uploadImage(data.image as File) ?? undefined;
    }

    const payload = {
      ...data,
      image: imageUrl,
    };

    if (!imageUrl) {
      delete payload.image;
    }

    fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/tasks/${id}`, {
      method: "PUT",
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
        console.error("Failed to update task");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 w-9 p-0"><Image src={editIcon} alt="Edit" className="w-auto h-auto cursor-pointer h-full w-full" /></Button>
      </DialogTrigger>
      <DialogContent className="w-230 h-177" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="hidden">Edit Task</DialogTitle>
          <DialogDescription className="hidden">Edit Task</DialogDescription>
          <div className="flex justify-between">
            <h4 className="text-xl font-bold"><span className="underline underline-offset-4 decoration-2 decoration-orange-700">Edit </span>Task</h4>
            <DialogClose asChild>
              <p className="cursor-pointer text-base underline">
                Go back
              </p>
            </DialogClose>
          </div>
        </DialogHeader>
        <TaskForm form={form} onSubmit={onSubmit} isLoading={isLoading} isAdding={false} />
      </DialogContent>
    </Dialog>
  );
}

export default memo(EditTaskModal);
