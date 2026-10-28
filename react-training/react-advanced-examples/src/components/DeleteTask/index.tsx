import Image from "../common/Image"

import trashIcon from "@/assets/trash.svg"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from 'react';

const DeleteTask = ({ id, title, onDeleted }: { id: string, title: string, onDeleted: () => void }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDeleteTask = () => {
    setIsLoading(true)
    fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/tasks/${id}`, {
      method: "DELETE"
    }).then((response) => {
      if (response.ok) {
        onDeleted()
        setIsOpen(false);
      } else {
        console.error("Failed to delete task")
      }
    }).catch((error) => {
      console.error("Failed to delete task", error)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
        <Button className="h-9 w-9 p-0 mr-3">
          <Image src={trashIcon} alt="Delete" className="w-auto h-auto cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-150" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="hidden">Delete Task</DialogTitle>
            <DialogDescription className="hidden">Delete Task</DialogDescription>
          <div className="flex justify-between">
            <h4 className="text-xl font-bold"><span className="underline underline-offset-4 decoration-2 decoration-orange-700">Confirm </span>delete</h4>
            <DialogClose asChild>
              <p className="cursor-pointer text-base underline">
                Go back
              </p>
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="mt-5">
          <p className="mb-7 border-y py-4">Are you sure you want to delete task <span className="font-bold">{title}</span>?</p>
          <div className="flex justify-end">
              <Button className="bg-destructive text-white mr-2 hover:bg-destructive hover:opacity-80" disabled={isLoading} onClick={handleDeleteTask}>{isLoading ? "Deleting..." : "Delete"}</Button>
              <DialogClose asChild>
                <Button className="bg-white text-destructive border-2 border-destructive hover:bg-red-100 hover:opacity-80">Cancel</Button>
              </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTask
