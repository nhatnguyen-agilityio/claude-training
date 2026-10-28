import { maxLength, minLength, object, regex, string, pipe, type InferOutput, boolean } from 'valibot';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { Form, FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
// import UserIcon from '@assets/user.svg';
import userIcon from '@/assets/user.svg';
import passwordIcon from '@/assets/password.svg';
import { useAuth } from '@/Hooks/Auth';
import { useNavigate } from 'react-router-dom';
import Image from '../common/Image';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from 'react';

const LoginFormSchema = object({
  username: pipe(
    string(),
    minLength(2, 'Minimum length is 2'),
    maxLength(30, 'Maximum length is 30'),
    regex(/^(?!.*[_.]{2})[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]{1,18}[a-zA-Z0-9]$/, 'Invalid username'),
  ),
  password: pipe(
    string(),
    minLength(8, 'Minimum length is 8'),
    maxLength(30, 'Maximum length is 30'),
  ),
  rememberMe: boolean(),
})

const LoginForm = () => {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const form = useForm<InferOutput<typeof LoginFormSchema>>({
    resolver: valibotResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false
    },
  })

  useEffect(() => {
    const saveUsername = localStorage.getItem('rememberUsername');
    if (saveUsername) {
      form.setValue('username', saveUsername);
      form.setValue('rememberMe', true);
    }
  }, [form]);

  const onSubmit: SubmitHandler<InferOutput<typeof LoginFormSchema>> = async (data) => {
    const success = await auth.login(data.username, data.password, data.rememberMe);
    if (success) {
      if (data.rememberMe) {
        localStorage.setItem('rememberUsername', data.username);
      }
      else {
        localStorage.removeItem('rememberUsername');
      }
      navigate("/dashboard", { replace: true });
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <h2 className=" font-extrabold text-4xl mb-10 text-start">Sign in</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-1'>
                <div className='relative'>
                  <Image src={userIcon} width={15} height={15} alt="User Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input id="username" {...field} className='pl-10 h-17' placeholder='Enter Username' />
                  </FormControl>
                </div>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-1'>
                <div className='relative'>
                  <Image src={passwordIcon} width={15} height={15} alt="User Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input id="password" {...field} type='password' className='pl-10 h-17' placeholder='Enter Password' />
                  </FormControl>
                </div>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="rememberMe"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      ref={field.ref}
                      name={field.name}
                    />
                  </FormControl>
                  <FormLabel htmlFor="remember">Remember me</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-start mt-8">
            <Button type="submit" className="bg-button-primary opacity-70 w-35 h-19 text-base hover:bg-button-primary hover:opacity-100">
              Login
            </Button>
          </div>
        </form>
      </Form>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              Invalid username or password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
};

export default LoginForm;
