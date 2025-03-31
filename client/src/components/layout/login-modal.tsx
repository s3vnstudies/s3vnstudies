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

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupClick: () => void;
}

const formSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginModal({ isOpen, onClose, onSignupClick }: LoginModalProps) {
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
      });
      onClose();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `${provider} login is not implemented yet.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <i className="ri-login-box-line mr-2 text-primary"></i>
            Login to your account
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access your account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username or email" {...field} />
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
                      placeholder="Enter your password" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button variant="link" className="p-0 h-auto text-sm" type="button">
                Forgot your password?
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign in
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
            Don't have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => {
                onClose();
                onSignupClick();
              }}
            >
              Sign up
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
