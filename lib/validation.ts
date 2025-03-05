import { z } from "zod";

export const formSchema = z.object({
  name: z.string().optional(),
  email: z.string(),
  password: z.string(),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
    confirmPassword: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });