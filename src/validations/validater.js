import z from "zod"


export const registerValidater = z.object({
  name: z
    .string()
    .trim(),

  email: z
    .string()
    .email({ message: "Please enter a valid email" })
    .trim(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),

  role: z.enum(
    ["admin", "member", "librarian"],
    {
      message: "Invalid role"
    }
  )
});

export const LoginValidater = z.object({
    
    email: z
      .string()
      .email({ message: "Please enter a valid email" })
      .trim(),
  
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
  
  });