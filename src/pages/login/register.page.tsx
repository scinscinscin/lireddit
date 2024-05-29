import { useRouter } from "next/router";
import { PublicLayoutFrontend } from "../../layouts/public.client";
import { PublicLayoutBackend } from "../../layouts/public.server";
import { client } from "../../utils/apiClient";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import common from "../common.module.scss";
import { Button } from "../../components/Button";
import { cn } from "../../utils/cn";
import styles from "./login.module.scss";
import Link from "next/link";

export default PublicLayoutFrontend.use<{}>(() => {
  const LoginForm = useForm<{ username: string; password: string }>();
  const isDisabled = LoginForm.formState.isSubmitting;
  const router = useRouter();

  return {
    children: (
      <div className={styles.container}>
        <h2>Create Account</h2>

        <form
          className={cn(common.form, styles.form)}
          onSubmit={LoginForm.handleSubmit(async ({ username, password }) => {
            try {
              await client["/user"]["/register"].post({ body: { username, password } });
              router.push("/login");
            } catch {
              toast.error("Incorrect credentials");
            }
          })}
        >
          <label htmlFor="username">Username</label>
          <input {...LoginForm.register("username", { required: true })} placeholder="Username" />

          <label htmlFor="password">Password</label>
          <input {...LoginForm.register("password", { required: true })} placeholder="Password" type="password" />
          <Button.Default onClick="submit" maxWidth disabled={isDisabled}>
            Login
          </Button.Default>
        </form>

        <p className={styles.cta}>
          Already have an account? <Link href="/login">Log in.</Link>
        </p>
      </div>
    ),
  };
});

export const getServerSideProps = PublicLayoutBackend.use<{}>(() => {});
