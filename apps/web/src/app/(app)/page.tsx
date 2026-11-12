import { HomeContent } from "@/app/components/home-content";
import { getBalance, getSession } from "@/lib/server-data";

export default async function Home() {
  const [session, balance] = await Promise.all([getSession(), getBalance()]);
  const userName = session?.user?.name.split(" ")[0] ?? "Usuário";

  return <HomeContent userName={userName} initialBalance={balance} />;
}
