import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const formSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignupModal({ isOpen, onClose, onLoginClick }: SignupModalProps) {
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { confirmPassword, terms, ...userData } = values;
      
      await registerMutation.mutateAsync(userData);
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} signup is not implemented yet.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <i className="ri-user-add-line mr-2 text-primary"></i>
            Create your account
          </DialogTitle>
          <DialogDescription>
            Join our community to access exclusive content and features
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Confirm your password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      I agree to the{" "}
                      <Button variant="link" className="p-0 h-auto text-primary" type="button">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="p-0 h-auto text-primary" type="button">
                        Privacy Policy
                      </Button>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign up
            </Button>
          </form>
        </Form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleSocialLogin("Google")}
            className="flex justify-center"
          >
            <i className="ri-google-fill text-lg"></i>
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleSocialLogin("Facebook")}
            className="flex justify-center"
          >
            <i className="ri-facebook-fill text-lg"></i>
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleSocialLogin("Twitter")}
            className="flex justify-center"
          >
            <i className="ri-twitter-fill text-lg"></i>
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => {
                onClose();
                onLoginClick();
              }}
            >
              Sign in
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
