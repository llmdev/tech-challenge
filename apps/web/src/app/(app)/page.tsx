import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { HomeContent } from "@/app/components/home-content";

export default async function Home() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  const userName = session?.user?.name.split(" ")[0] ?? "Usuário";

  return <HomeContent userName={userName} />;
}
