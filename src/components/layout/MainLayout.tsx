
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        aberto={menuAberto}
        fechar={() => setMenuAberto(false)}
      />

      <div className="min-h-screen lg:ml-64">
        {/* Cabeçalho do celular */}
        <header className="flex h-16 items-center border-b border-slate-200 bg-white px-5 lg:hidden">
          <button
            onClick={() => setMenuAberto(true)}
            className="text-[#010C59]"
            aria-label="Abrir menu"
          >
            <Menu size={25} />
          </button>

          <span className="ml-4 font-bold text-[#010C59]">
            Sistema Interativo IAPEP
          </span>
        </header>

        {/* Conteúdo da página */}
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
