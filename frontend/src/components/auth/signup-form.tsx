import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import {z} from "zod"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from "react-router"


const signUpSchema = z.object({
  firstname: z.string().min(1, { message: "First name is required" }),
  lastname: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  password: z.string().min(6, { message: "password must be at least 6 characters" }),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {signUp} = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    const { firstname, lastname, username, email, password } = data
    await signUp(username, password, email, firstname, lastname);
    navigate("/signin");
  } 

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/*header/logo*/}

              <div className="flex flex-col items-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                  <img src="/logo.svg" alt="Moji Logo" className="h-12 w-auto" />
                </a>

                <h1 className="text-2xl font-bold">Create Moji Account</h1>
                <p className="text-muted-foreground text-balance">Join our community and start connecting with others today.</p>
              </div>

              {/*First name and last name*/}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="lastname" className="text-sm block">Last Name</Label>
                  <Input type="text" id="lastname" {...register("lastname")}/>
                  {errors.lastname && <p className="text-sm text-destructive">{errors.lastname.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstname" className="text-sm block">First Name</Label>
                  <Input type="text" id="firstname" {...register("firstname")}/>
                  {errors.firstname && <p className="text-sm text-destructive">{errors.firstname.message}</p>}
                </div>
              </div>

              {/*username*/}
              
              <div className="flex flex-col gap-3">
                <Label htmlFor="username" className="text-sm block">Username</Label>
                <Input type="text" id="username" placeholder="moji"  {...register("username")}/>
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
              </div>
              {/*email*/}
              <div className="flex flex-col gap-3">
                <Label htmlFor="email" className="text-sm block">Email</Label>
                <Input type="email" id="email" placeholder="FbGxP@example.com" {...register("email")}/>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              {/*password*/}

              <div className="flex flex-col gap-3">
                <Label htmlFor="password" className="text-sm block">Password</Label>
                <Input type="password" id="password" placeholder="••••••••" {...register("password")}/>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>

              {/*submit button*/}

              <div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>Create Account</Button>
              </div>
              <div className="text-center text-sm">If you already have an account, <a href="/signin" className="underline underline-offset-3">Sign In</a></div>

            </div>
          </form>
          <div className="relative hidden h-full bg-muted md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
            <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Welcome to Moji
              </p>
              <h2 className="text-2xl font-semibold text-foreground">
                Build your account faster
              </h2>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Create a secure account and start chatting immediately with a clean, modern interface.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-sx text-balance px-6 text-center *:[a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#" className="underline underline-offset-3">Terms of Service</a>{" "}
        and <a href="#" className="underline underline-offset-3">Privacy Policy</a>.
      </div>
    </div>
  )
}
