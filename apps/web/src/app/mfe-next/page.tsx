import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { HomeContent } from "@/app/components/home-content";
import MfeUnmountClient from "./mfe-unmount-client";

export default async function Page() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userName = session?.user?.name.split(' ')[0] ?? "Usuário";

  return (
    <>
      <MfeUnmountClient />
      <HomeContent userName={userName} />
    </>
  );
}
