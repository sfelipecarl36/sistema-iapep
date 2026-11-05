import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  UserRound,
  CreditCard,
  BriefcaseBusiness,
  LogOut,
  X
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo/logo.png";

type SidebarProps = {
  aberto: boolean;
  fechar: () => void;
};

export default function Sidebar({
  aberto,
  fechar
}: SidebarProps) {
  const { role, signOut } = useAuth();

  const menus = {
    admin: [
      { nome: "Visão geral", rota: "/admin", icone: LayoutDashboard },
      { nome: "Associados", rota: "/admin/associados", icone: Users },
      { nome: "Propostas", rota: "/admin/propostas", icone: FileText },
      { nome: "Empresas", rota: "/admin/empresas", icone: Building2 }
    ],

    associado: [
      { nome: "Meu painel", rota: "/associado", icone: LayoutDashboard },
      { nome: "Meu cadastro", rota: "/associado/cadastro", icone: UserRound },
      { nome: "Proposta de admissão", rota: "/associado/proposta", icone: FileText },
      { nome: "Carteirinha", rota: "/associado/carteirinha", icone: CreditCard }
    ],

    empresa: [
      { nome: "Meu painel", rota: "/empresa", icone: LayoutDashboard },
      { nome: "Minhas demandas", rota: "/empresa/demandas", icone: BriefcaseBusiness },
      { nome: "Meu cadastro", rota: "/empresa/cadastro", icone: Building2 }
    ]
  };

  const itens = role ? menus[role] : [];

  return (
    <>
      {/* Fundo escuro no celular */}
      {aberto && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={fechar}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          bg-[#010C59] text-white
          transition-transform duration-300
          lg:translate-x-0
          ${aberto ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-6">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="h-12 w-12 object-contain"
            />

            <div>
              <h2 className="text-lg font-bold">IAPEP</h2>
              <p className="text-xs text-white/60">
                Sistema Interativo
              </p>
            </div>
          </div>

          <button
            onClick={fechar}
            className="text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {itens.map((item) => {
            const Icone = item.icone;

            return (
              <NavLink
                key={item.rota}
                to={item.rota}
                end
                onClick={fechar}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-[#00ECFD] font-semibold text-[#010C59]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icone size={19} />
                {item.nome}
              </NavLink>
            );
          })}
        </nav>

        {/* Rodapé */}
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => void signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            <LogOut size={19} />
            Sair da conta
          </button>
        </div>
      </aside>
    </>
  );
}
