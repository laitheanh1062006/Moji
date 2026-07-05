import { SignInForm } from '@/components/auth/signin-form'

const SignInPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
      <div className="w-full max-w-5xl">
        <SignInForm />
      </div>
    </div>
  )
}

export default SignInPage
