import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

type PeopleType = {
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  type: 'student' | 'teacher' | 'admin' | 'guest' | 'other';
};

const People = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PeopleType>();

  const onSubmit: SubmitHandler<PeopleType> = data => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <label htmlFor="firstName">First Name:
        <input type="text" {...register("firstName", { required: true, minLength: 2, maxLength: 20, pattern: /^[A-Za-z]+$/i })} />
      </label>
      {errors.firstName && <span>First name is required and must be 2-20 characters long.</span>}
      <br />
      <label htmlFor="lastName">Last Name:
        <input type="text" {...register("lastName", { required: true, minLength: 2, maxLength: 20, pattern: /^[A-Za-z]+$/i })}/>
      </label>
      {errors.lastName && <span>Last name is required and must be 2-20 characters long.</span>}
      <br />
      <label htmlFor="email">Email:
        <input type="email" {...register("email", { required: true })} />
      </label>
      {errors.email && <span>Email is required.</span>}
      <br />
      <label htmlFor="age">Age:
        <input type="number" {...register("age", { required: true, min: 18, max: 99 })} />
      </label>
      {errors.age && <span>Age is required and must be between 18 and 99.</span>}
      <br />
      <label htmlFor="type">Type:
        <select {...register("type", { required: true })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
          <option value="guest">Guest</option>
          <option value="other">Other</option>
        </select>
      </label>
      {errors.type && <span>Type is required.</span>}
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
export default People;
