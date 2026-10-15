import { format } from "date-fns"
import type { UseFormReturn, FieldValues, SubmitHandler, Path } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Dot, ImageIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { getPriorityColor } from "@/constants/priority-class";
import { useState } from "react";

const prioriryOptions = [
  {
    id: "Extreme",
    label: "Extreme"
  },
  {
    id: "Moderate",
    label: "Moderate"
  },
  {
    id: "Low",
    label: "Low"
  }
]

const TaskForm = <T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  isLoading,
  isAdding=true
}: {
  form: UseFormReturn<T>,
  onSubmit: SubmitHandler<T>,
  isLoading: boolean,
  isAdding?: boolean
}) => {
  const [filename, setFileName] = useState<string | null>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("Validation errors:", errors))}>
        <FormField
          control={form.control}
          name={"title" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <div className="grid flex-1 gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...field} />
              </div>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"createdAt" as Path<T>}
          render={({ field }) => (
            <FormItem className="grid flex-1 gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-[240px] justify-between text-left font-normal ${!field.value && "text-muted-foreground"}`}
                  >
                    <span>{field.value && format(field.value, "PPP")}</span>
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="min-h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"priority" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="priority">Priority</Label>
              <div className="flex gap-2">
                {prioriryOptions.map((item) => (
                  <div className="flex items-center mr-7" key={item.id}>
                    <Dot className={`h-12 w-12 ${getPriorityColor(item.label)}`} />
                    <Label key={item.id} className="flex items-center gap-3">
                      <span className="text-sm font-normal">{item.label}</span>
                      <Input
                        type="radio"
                        value={item.id}
                        checked={field.value === item.id}
                        onChange={() => field.onChange(item.id)}
                        name={field.name}
                        className="shadow-none"
                      />
                    </Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Label htmlFor="description" className="mt-5">Description</Label>
        <div className="flex mt-3">
          <div className="w-3/5">
            <FormField
              control={form.control}
              name={"description" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <div className="grid flex-1 gap-3 mr-7">
                    <Textarea id="description" className="h-50" placeholder="Start writing here..." {...field} />
                  </div>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="w-2/5 border-2 flex flex-col items-center justify-center mb-7">
            <ImageIcon className="w-12 h-12 opacity-30" />
            <p className="mt-3 text-xs opacity-30">Drag&Drop file here or</p>
            <FormField
              control={form.control}
              name={"image" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-col items-center justify-center">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setFileName(file.name);
                        } else {
                          field.onChange(undefined);
                          setFileName(null);
                        }
                      }}
                      className="hidden"
                    />

                    <label
                      htmlFor="image"
                      className="cursor-pointer px-3 py-2 opacity-30 rounded text-sm w-max border-2 my-3"
                    >
                      Browser
                    </label>

                    <p className="text-sm text-gray-600">
                      {filename ?? ""}
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading} className={`bg-destructive text-white`}>
          {isLoading ? (isAdding ? "Adding..." : "Updating...") : "Done"}
        </Button>
      </form>
    </Form>
  )
}

export default TaskForm
