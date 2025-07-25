import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthContext } from "../../../auth/hooks/useAuthContext";

import { login } from "../../apis";

const schema = z.object({
  email: z.string().email("メールアドレスの形式で入力してください"),
  password: z.string().min(8, "8文字以上で入力してください"),
});

export const useLoginTemplate = () => {
  const { signIn } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = handleSubmit(
    useCallback(
      async (values: z.infer<typeof schema>) => {
        const { email, password } = values;
        const res = await login(email, password);
        if (res.code !== 200 || !res.data) {
          setError("email", {
            type: "manual",
            message: res.message,
          });
          return;
        }
        signIn(res.data?.user, res.data?.token);
      },
      [signIn, setError]
    )
  );

  return {
    control,
    errors,
    handleLoginSubmit,
  };
};
