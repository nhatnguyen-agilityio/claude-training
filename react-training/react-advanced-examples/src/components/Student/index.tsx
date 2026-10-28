import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { object, string, number, minLength, maxLength, regex, pipe, minValue, maxValue } from 'valibot'
import type { InferOutput } from 'valibot'
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

type StudentForm = {
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
}

const studentFormSchema = object({
  firstName: pipe(
    string(),
    minLength(2, 'Minimum length is 2'),
    maxLength(20, 'Maximum length is 20'),
    regex(/^[A-Za-z]+$/, 'Only letters are allowed'),
  ),
  lastName: pipe(
    string(),
    minLength(2, 'Minimum length is 2'),
    maxLength(20, 'Maximum length is 20'),
    regex(/^[A-Za-z]+$/, 'Only letters are allowed'),
  ),
  email: pipe(
    string(),
    regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
  ),
  age: pipe(
    number(),
    minValue(18, 'Minimum age is 18'),
    maxValue(99, 'Maximum age is 99'),
  ),
})

const Student = () => {
  const form = useForm<InferOutput<typeof studentFormSchema>>({
    resolver: valibotResolver(studentFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
    },
  });

  const onSubmit: SubmitHandler<StudentForm> = data => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="firstName"
          control={form.control}
          rules={{ required: 'First name is required', minLength: { value: 2, message: 'Minimum length is 2' }, maxLength: { value: 20, message: 'Maximum length is 20' } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <FormControl>
                <Input id="firstName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          rules={{ required: 'Last name is required', minLength: { value: 2, message: 'Minimum length is 2' }, maxLength: { value: 20, message: 'Maximum length is 20' } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <FormControl>
                <Input id="lastName" {...field} />
              </FormControl>
              <FormMessage />

            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          rules={{ required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input id="email" type="email" {...field} />
              </FormControl>
              <FormMessage />

            </FormItem>
          )}
        />
        <FormField
          name="age"
          control={form.control}
          rules={{ required: 'Age is required', min: { value: 18, message: 'Minimum age is 18' }, max: { value: 99, message: 'Maximum age is 99' } }}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="age">Age</FormLabel>
              <FormControl>
                <Input id="age" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">Submit</Button>
      </form>
    </Form>
  );
}

export default Student;
