import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSessionStore } from "@/store/sessionStore";

export function SessionSync() {
  const { data: session, status } = useSession();
  const { setSession, setLoading } = useSessionStore();

  useEffect(() => {
    setLoading(status === "loading");
    setSession(session);
  }, [session, status, setSession, setLoading]);

  return null;
}
