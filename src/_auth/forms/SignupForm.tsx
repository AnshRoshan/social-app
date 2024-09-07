import type * as z from 'zod'
import { useForm, type Control } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loader from '@/components/shared/Loader'
import { useToast } from '@/components/ui/use-toast'

import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { SignupValidation } from '@/lib/validation'
import { useUserContext } from '@/context/AuthContext'

interface FormFieldComponentProps {
  control: Control<z.infer<typeof SignupValidation>> // Corrected type for control
  name: 'name' | 'username' | 'email' | 'password'
  label: string
  type: string
}

const FormFieldComponent = ({ control, name, label, type }: FormFieldComponentProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className='shad-form_label'>{label}</FormLabel>
        <FormControl>
          <Input type={type} className='shad-input rounded-[4px]' {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
)

const SignupForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  //Queries
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()
  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount()

  // 2. Define a submit handler.
  const handleSignup = async (values: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(values)

      if (!newUser) {
        toast({ title: 'Sign up failed. Please try again.' })
        return
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      })

      if (!session) {
        toast({ title: 'Something went wrong. Please login to your account.' })
        navigate('/sign-in')
        return
      }

      const isLoggedIn = await checkAuthUser()

      if (isLoggedIn) {
        form.reset()
        navigate('/')
      } else {
        toast({ title: 'Sign up failed. Please try again.' })
        return
      }
    } catch (error) {
      toast({ title: 'An error occurred. Please try again.' })
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-420">
        <img src='/assets/images/logo.svg' alt='logo' />

        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>Create a new account.</h2>
        <p className="small-medium md:base-regular mt-2 text-light-3">
          To use Snapgram, please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignup)}
          className="mt-4 flex w-full flex-col gap-5"
        >
          <FormFieldComponent control={form.control} name='name' label='Name' type='text' />
          <FormFieldComponent control={form.control} name='username' label='Username' type='text' />
          <FormFieldComponent control={form.control} name='email' label='Email' type='email' />
          <FormFieldComponent
            control={form.control}
            name='password'
            label='Password'
            type='password'
          />

          <Button type='submit' className='shad-button_primary rounded-full'>
            {isCreatingAccount || isSigningInUser || isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading...
              </div>
            ) : (
              'Sign up'
            )}
          </Button>

          <p className="mt-2 text-center text-light-2 text-small-regular">
            Already have an account?
            <Link
              to='/sign-in'
              className="ml-1 text-primary-500 text-small-semibold hover:text-primary-600 hover:underline hover:underline-offset-2"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
