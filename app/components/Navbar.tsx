"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const { user, loading } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 sticky top-0 z-50 backdrop-blur-md w-full">
      <Link href="/" className="text-xl font-bold hover:text-cyan-400 transition">
        Orienta
      </Link>

      <div className="flex gap-4 sm:gap-6 items-center text-sm sm:text-base">
        <Link href="/" className="hover:text-cyan-400 transition hidden sm:block">Menú Principal</Link>
        <Link href="/contacto" className="hover:text-cyan-400 transition hidden sm:block">Contáctanos</Link>
        {!loading && user ? (
          <button onClick={() => router.push("/profile")} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition font-medium">
            <User size={16}/> {user.name}
          </button>
        ) : (
          <button onClick={() => router.push("/login")} className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition font-medium">
            Iniciar Sesión
          </button>
        )}
      </div>
    </nav>
  );
}
