import * as z from "zod";

// Esquema para el formulario de login/registro
export const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Esquema para el formulario de agregar criptomonedas
export const cryptoFormSchema = z.object({
  crypto_name: z
    .string()
    .min(1, "El nombre de la criptomoneda es requerido")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  
  ticker: z
    .string()
    .min(1, "El ticker es requerido")
    .max(10, "El ticker no puede exceder los 10 caracteres")
    .toUpperCase(),
  
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "La cantidad debe ser un número válido",
    })
    .refine((val) => Number(val) > 0, {
      message: "La cantidad debe ser mayor que 0",
    }),
  
  purchase_price: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "El precio de compra debe ser un número válido",
    })
    .refine((val) => Number(val) >= 0, {
      message: "El precio de compra debe ser mayor o igual a 0",
    }),
  
  note: z
    .string()
    .max(200, "La nota no puede exceder los 200 caracteres")
    .optional(),
  
  type: z
    .enum(["compra", "venta"], {
      errorMap: () => ({ message: "El tipo debe ser 'compra' o 'venta'" }),
    })
    .default("compra"),
    
  image_url: z
    .string()
    .optional(),
});

export type CryptoFormValues = z.infer<typeof cryptoFormSchema>;

// Esquema de validación para el formulario de venta
export const sellCryptoSchema = z.object({
  amount: z
    .string()
    .min(1, "La cantidad es requerida")
    .refine((val) => !isNaN(parseFloat(val)), "Debe ser un número válido")
    .refine((val) => parseFloat(val) > 0, "La cantidad debe ser mayor a 0"),
  sell_price: z
    .string()
    .min(1, "El precio de venta es requerido")
    .refine((val) => !isNaN(parseFloat(val)), "Debe ser un número válido")
    .refine((val) => parseFloat(val) > 0, "El precio de venta debe ser mayor a 0"),
  note: z
    .string()
    .max(200, "La nota no puede exceder los 200 caracteres")
    .optional(),
  add_to_wallet: z
    .boolean()
    .default(false)
    .optional(),
});

export type SellCryptoFormValues = z.infer<typeof sellCryptoSchema>;

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