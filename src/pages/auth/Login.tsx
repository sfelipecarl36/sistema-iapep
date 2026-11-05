
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import logo from "../../assets/logo/logo-redonda.png";

import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoConta, setTipoConta] = useState<"associado" | "empresa">(
    "associado"
  );
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const { user, role, loading } = useAuth();

  async function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setCarregando(true);
    setMensagem("");

    try {
      if (modoCadastro) {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: {
              tipo_conta: tipoConta
            }
          }
        });

        if (error) throw error;

        setMensagem(
          "Cadastro realizado! Confira seu e-mail para confirmar a conta, se necessário."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha
        });

        if (error) throw error;
      }
    } catch (erro) {
      console.error(erro);
      setMensagem(
        "Não foi possível concluir a operação. Confira os dados e tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

    if (loading) {
        return <div className="p-8 text-center">Carregando...</div>;
    }

    if (user && role) {
    const destinos = {
        admin: "/admin",
        associado: "/associado",
        empresa: "/empresa"
    };

    return <Navigate to={destinos[role]} replace />;
    }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
        
        {/* Logo */}
        <img
            src={logo}
            alt="Logotipo do IAPEP"
            className="mb-5 h-28 w-28 object-contain"
        />

        <h1 className="text-2xl font-bold tracking-tight text-[#010C59]">
            Sistema Interativo
        </h1>

        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
            Instituto de Avaliações e Perícias de Engenharia do Pará
        </p>
        </div>

        <h2 className="mb-5 text-xl font-semibold text-slate-800">
          {modoCadastro ? "Criar conta" : "Entrar na conta"}
        </h2>

        <form onSubmit={enviarFormulario} className="space-y-4">
          {modoCadastro && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                Tipo de conta
              </label>

              <select
                value={tipoConta}
                onChange={(e) =>
                  setTipoConta(e.target.value as "associado" | "empresa")
                }
                className="w-full rounded-lg border border-slate-300 p-3"
              >
                <option value="associado">Profissional / Associado</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              E-mail
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Senha
            </label>

            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3"
              placeholder="Sua senha"
            />
          </div>

          {mensagem && (
            <p className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-lg bg-[#010C59] p-3 font-semibold text-white disabled:opacity-50"
          >
            {carregando
              ? "Aguarde..."
              : modoCadastro
                ? "Criar conta"
                : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setModoCadastro(!modoCadastro);
            setMensagem("");
          }}
          className="mt-5 w-full text-sm font-medium text-[#010C59]"
        >
          {modoCadastro
            ? "Já tenho uma conta"
            : "Ainda não tenho uma conta"}
        </button>
      </div>
    </main>
  );
}
