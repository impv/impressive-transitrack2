import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    router.push(session ? "/dashboard" : "/auth/login");
  }, [session, status, router]);

  return <div>読み込み中...</div>;
};

export default Home;
