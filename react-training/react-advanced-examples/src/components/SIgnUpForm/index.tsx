import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { boolean, custom, maxLength, minLength, object, pipe, regex, string, type InferInput, type InferOutput } from 'valibot';
import { valibotResolver } from "@hookform/resolvers/valibot";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/Hooks/Auth";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "../common/Image";

import firstNameIcon from '@/assets/first-name-icon.svg'
import lastNameIcon from '@/assets/last-name-icon.svg';
import usernameIcon from '@/assets/username-icon.svg'
import emailIcon from '@/assets/email-icon.svg'
import passwordIcon from '@/assets/password.svg';
import confirmPasswordIcon from '@/assets/confirm-password-icon.svg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BaseSignUpFormSchema = object({
  firstName: pipe(
    string(),
    minLength(2, "First name must be at least 2 characters long"),
    maxLength(20, "First name must be at most 30 characters long"),
    regex(/^[A-Za-z]+$/, "Only letters are allowed"),
  ),
  lastName: pipe(
    string(),
    minLength(2, "Last name must be at least 2 characters long"),
    maxLength(20, "Last name must be at most 30 characters long"),
    regex(/^[A-Za-z]+$/, "Only letters are allowed"),
  ),
  username: pipe(
    string(),
    minLength(2, 'Username must be at least 2 characters long'),
    maxLength(30, 'Username must be at most 30 characters long'),
    regex(/^(?!.*[_.]{2})[a-zA-Z0-9](?!.*[_.]{2})[a-zA-Z0-9._]{1,18}[a-zA-Z0-9]$/, 'Invalid username'),
  ),
  email: pipe(
    string(),
    regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email address'),
  ),
  password: pipe(
    string(),
    minLength(8, 'Password must be at least 8 characters long'),
    maxLength(30, 'Password must be at most 30 characters long'),
    regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 8 characters long. Password must include at least one letter (a–z or A–Z).'),
  ),
  confirmPassword: pipe(
    string(),
    minLength(8, 'Password must be at least 8 characters long'),
    maxLength(30, 'Password must be at most 30 characters long'),
    regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 8 characters long. Password must include at least one letter (a–z or A–Z).'),
  ),
  acceptTerms: pipe(
    boolean(),
    custom(value => value === true, 'You must accept the terms and conditions.')
  ),
});

const SignUpForm = () => {
  const [showUsernameExistsAlert, setShowUsernameExistsAlert] = useState(false);
  const [showSignUpSuccessAlert, setShowSignUpSuccessAlert] = useState(false);
  const [isCorrectPassword, setIsCorrectPassword] = useState(true);
  const auth = useAuth();
  const navigate = useNavigate();
  const form = useForm<InferInput<typeof BaseSignUpFormSchema>>({
    resolver: valibotResolver(BaseSignUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    },
  })

  const onSubmit: SubmitHandler<InferOutput<typeof BaseSignUpFormSchema>> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setIsCorrectPassword(false);
      return
    }

    try {
      const response = await fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/users?username=${data.username}`);
      if (!response.ok) {
        const result = await auth.signUp(data);
        if (result) {
          setShowSignUpSuccessAlert(true);
        }
      }
      else {
        setShowUsernameExistsAlert(true)
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center mr-10">
      <h2 className=" font-extrabold text-4xl mb-10 text-start">Sign Up</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-1'>
                <div className="relative">
                  <Image src={firstNameIcon} width={15} height={15} alt="First Name Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input placeholder="Enter First Name" className='pl-10 h-17' {...field} />
                  </FormControl>
                </div>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-1'>
                <div className="relative">
                  <Image src={lastNameIcon} width={15} height={15} alt="Last Name Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input placeholder="Enter Last Name" className='pl-10 h-17' {...field} />
                  </FormControl>
                </div>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-1'>
                <div className="relative">
                  <Image src={usernameIcon} width={15} height={15} alt="Username Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input placeholder="Enter Username" className='pl-10 h-17' {...field} />
                  </FormControl>
                </div>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-1'>
                <div className="relative">
                  <Image src={emailIcon} width={15} height={15} alt="Email Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input placeholder="Enter Email" className='pl-10 h-17' {...field} />
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
                <div className="relative">
                  <Image src={passwordIcon} width={15} height={15} alt="Password Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input type="password" placeholder="Enter Password" className='pl-10 h-17' {...field} />
                  </FormControl>
                </div>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-1'>
                <div className="relative">
                  <Image src={confirmPasswordIcon} width={15} height={15} alt="Confirm Password Icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      className='pl-10 h-17'
                      {...field}
                      onChange={e => {
                        setIsCorrectPassword(true);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                </div>
                {!isCorrectPassword ? <div className="min-h-5 text-sm text-center text-destructive">Passwords do not match</div> : <div className="min-h-5">
                  <FormMessage />
                </div>}
              </FormItem>
            )}
          />
          <FormField
            name="acceptTerms"
            control={form.control}
            render={({ field }) => (
              <FormItem className='mb-8'>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      ref={field.ref}
                      name={field.name}
                      className="!border-[#212427]"
                    />
                  </FormControl>
                  <FormLabel htmlFor="acceptTerms" className="text-primary">I agree to all terms</FormLabel>
                </div>
                <div className="min-h-5 text-left">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-start mt-6">
            <Button type="submit" className="bg-button-primary w-35 h-19 text-base opacity-70 hover:bg-button-primary hover:opacity-100">Register</Button>
          </div>
        </form>
      </Form>
      <div className='flex mt-5'>
        <p className='mr-1'>Already have an account?</p>
        <NavLink to="/login" className='ml-1 text-blue-500'>Sign In</NavLink>
      </div>
      <AlertDialog open={showUsernameExistsAlert} onOpenChange={setShowUsernameExistsAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>
              Username already exists. Please try with a different username.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUsernameExistsAlert(false)}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showSignUpSuccessAlert} onOpenChange={setShowSignUpSuccessAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Great! You have successfully signed up for the site. Have a nice experience with this site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setShowSignUpSuccessAlert(false);
              navigate("/login", { replace: true });
            }}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
};

export default SignUpForm;
