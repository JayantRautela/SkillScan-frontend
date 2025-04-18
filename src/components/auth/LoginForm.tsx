import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormState {
  username: string;
  password: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormState>({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  }

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const sendFormData = new FormData();

    sendFormData.append("password", formData.password);
    sendFormData.append("username", formData.username);

    try {
      setIsSubmitting(true);
      const response = await axios.post('http://localhost:3000/api/v1/users/login',
        sendFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      console.log(`Upload Success: ${response}`);
      if (response.status === 200) {
        toast.success("User Logged In");
        navigate('/');
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Some error occurred";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
      setFormData({ 
        username: "",
        password: "" 
      });
    }
  }

  return (
    <div>
      <div className="min-h-screen w-full bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-xl p-10 border border-gray-200 rounded-2xl shadow-sm bg-[#fdfdfd]">
          <section className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-black">
              Login to <span className="text-blue-500">SkillScan</span>
            </h1>
          </section>

          <form className="flex flex-col gap-6" onSubmit={submitForm}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username" className="text-base text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                name="username"
                placeholder="Choose a username"
                className="text-base border border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
                autoComplete="username"
                disabled={isSubmitting}
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-base text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className="text-base border border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
                autoComplete="new-password"
                disabled={isSubmitting}
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base py-2 rounded-xl transition-all duration-200 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
