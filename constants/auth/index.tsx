import { InputCustomProps } from "@/types/auth";

export const inputCustomItems: InputCustomProps[] = [
  { placeholder: "Username or PhoneNumber", value: "" },
  { placeholder: "Password", value: "" },
  { placeholder: "Username", value: "" },
  { placeholder: "Fullname", value: "" },
  { placeholder: "Email", value: "" },
  { placeholder: "Phone number", value: "" },
  { placeholder: "Birth", value: "" },
  { placeholder: "Password", value: "" },
  { placeholder: "Gender", value: "" },
  { placeholder: "Confirmed password", value: "" }
];

export const genderList: { key: string; value: string }[] = [
  { key: "male", value: "Male" },
  { key: "female", value: "Female" },
  { key: "other", value: "Others" }
];
