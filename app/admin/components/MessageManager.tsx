"use client";

import { useState, useEffect } from "react";
import { Loader2, Mail, MailOpen } from "lucide-react";

interface ContactMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  is_read: number;
  created_at: string;
}

export default function MessageManager({ token }: { token: string }) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/contact/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Error fetching messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("No se pudieron cargar los mensajes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (msg: ContactMessage) => {
    const newStatus = msg.is_read === 1 ? 0 : 1;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/contact/${msg.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_read: newStatus })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: newStatus } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-emerald-500" /></div>;
  if (error) return <div className="text-red-500 p-10">{error}</div>;

  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center text-white/50 flex flex-col items-center">
          <Mail size={48} className="mb-4 opacity-20" />
          <p>No hay mensajes de contacto todavía.</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className={`p-6 rounded-2xl border transition-all ${msg.is_read ? 'bg-white/[0.02] border-white/5 opacity-70' : 'bg-white/10 border-emerald-500/30 shadow-lg'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{msg.first_name} {msg.last_name}</h3>
                <a href={`mailto:${msg.email}`} className="text-emerald-400 text-sm hover:underline">{msg.email}</a>
                <p className="text-xs text-white/40 mt-1">{new Date(msg.created_at).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => toggleReadStatus(msg)}
                className={`p-2 rounded-full transition-all ${msg.is_read ? 'hover:bg-white/10 text-white/40' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'}`}
                title={msg.is_read ? "Marcar como no leído" : "Marcar como leído"}
              >
                {msg.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
              </button>
            </div>
            <div className="bg-black/30 p-4 rounded-xl text-white/80 whitespace-pre-wrap">
              {msg.message}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
