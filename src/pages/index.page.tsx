import { PublicLayoutFrontend } from "../layouts/public.client";
import { PublicLayoutBackend } from "../layouts/public.server";

import { useEffect, useState } from "react";
import { client, fetchGQL } from "../utils/apiClient";
import { useForm } from "react-hook-form";
import { getUsersWithHobbies } from "../graphql/users/documents/getUsersWithHobbies";

interface PageProps {}

export default PublicLayoutFrontend.use<PageProps>((args) => {
  return {
    children: (
      <div>
        <h1>This is just nice to know</h1>
      </div>
    ),
  };
});

export const getServerSideProps = PublicLayoutBackend.use<PageProps>({});
