import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import { PublicLayoutFrontend } from "../../layouts/public.client";
import { PublicLayoutBackend } from "../../layouts/public.server";
import { cn } from "../../utils/cn";
import common from "../common.module.scss";
import styles from "./create.module.scss";
import { client } from "../../utils/apiClient";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface Props {}
export default PublicLayoutFrontend.use<Props>(() => {
  const Form = useForm<{ title: string; content: string }>();
  const router = useRouter();

  async function handleSubmit(data: { title: string; content: string }) {
    console.log(data);
    try {
      const { newPost } = await client["/post"]["/create"].post({ body: { content: data.content, title: data.title } });
      router.push("/post/" + newPost.uuid);
    } catch {
      toast.error("Failed to create the post");
    }
  }

  return {
    children: (
      <div>
        <h2>Create Post</h2>
        <form className={cn(common.form, styles.form)} onSubmit={Form.handleSubmit(handleSubmit)}>
          <label htmlFor="title">Title</label>
          <input type="text" {...Form.register("title", { required: true })} placeholder="Enter a catchy title here" />

          <label htmlFor="content">Content</label>
          <textarea {...Form.register("content", { required: true })} placeholder="Enter your post here" />

          <Button.Default onClick="submit" maxWidth disabled={Form.formState.isSubmitting}>
            Create
          </Button.Default>
        </form>
      </div>
    ),
  };
});

export const getServerSideProps = PublicLayoutBackend.use<Props>({
  layoutGsspOptions: { mustBeLoggedIn: true },
});
