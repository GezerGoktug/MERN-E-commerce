import { z } from "zod";

export const schema = z
  .object({
    name: z.string().min(3, "Username cannot be less than 3 characters"),
    email: z.string().email("Email is not in appropriate format"),
    password: z
      .string()
      .min(8, "Password cannot be less than 8 characters")
      .regex(
        /(?=(?:[^a-zA-Z]*[a-zA-Z]){4})/,
        "Password must contain at least 4 letters"
      ),
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const deliveryInfoSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters long"),
  lastName: z.string().min(3, "Last name must be at least 3 characters long"),
  email: z.string().email("İnvalid email"),
  street: z.string().min(3, "Street must be at least 3 characters long"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  phoneNumber: z
    .string()
    .regex(
      /^0 \(\d{3}\) \d{3} \d{2} \d{2}$/,
      "Phone number must be '0 (999) 999 99 99' format."
    ),
  paymentMethod: z
    .string(z.enum(["CASH_ON_DELIVERY", "STRIPE"]))
    .default("CASH_ON_DELIVERY"),
});
