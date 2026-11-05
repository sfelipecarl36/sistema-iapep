
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";

import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type UserRole = "admin" | "associado" | "empresa";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    let versao = 0;

    async function atualizarSessao(
      novaSessao: Session | null
    ) {
      const atual = ++versao;

      if (!ativo) return;

      setSession(novaSessao);
      setRole(null);
      setLoading(true);

      if (!novaSessao?.user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", novaSessao.user.id)
          .maybeSingle();

        if (error) throw error;

        if (!ativo || atual !== versao) return;

        const papel = data?.role;

        setRole(
          papel === "admin" ||
          papel === "associado" ||
          papel === "empresa"
            ? papel
            : null
        );
      } catch (error) {
        console.error("Erro ao consultar papel:", error);

        if (ativo && atual === versao) {
          setRole(null);
        }
      } finally {
        if (ativo && atual === versao) {
          setLoading(false);
        }
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, novaSessao) => {
        void Promise.resolve().then(() =>
          atualizarSessao(novaSessao)
        );
      }
    );

    return () => {
      ativo = false;
      versao++;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        role,
        loading,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider."
    );
  }

  return context;
}
