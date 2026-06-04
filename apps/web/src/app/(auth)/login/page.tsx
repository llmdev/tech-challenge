"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@repo/button";
import { Input } from "@repo/input";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const result = await signIn.email({ email, password });
        if (result.error) {
          setError(result.error.message ?? "Credenciais inválidas.");
          return;
        }
      } else {
        const result = await signUp.email({ name, email, password });
        if (result.error) {
          setError(result.error.message ?? "Erro ao criar conta.");
          return;
        }
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="w-full max-w-sm">
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-7 h-7 text-primary-foreground"
            aria-hidden="true"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Tech Challenge
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {mode === "login"
            ? "Bem-vindo de volta"
            : "Crie sua conta gratuitamente"}
        </p>
      </div>

      {/* Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
        {/* Tabs */}
        <div className="flex p-1 bg-muted rounded-xl mb-6">
          {(["login", "register"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "register" && (
            <Input
              label="Nome completo"
              type="text"
              placeholder="Joana da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              disabled={loading}
            />
          )}

          <Input
            label="E-mail"
            type="email"
            placeholder="joana@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete={mode === "login" ? "email" : "new-email"}
            disabled={loading}
          />

          <Input
            label="Senha"
            type="password"
            placeholder={mode === "login" ? "••••••••" : "Mínimo 8 caracteres"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            disabled={loading}
          />

          {error && (
            <p
              role="alert"
              className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-1"
            size="lg"
          >
            {loading
              ? mode === "login"
                ? "Entrando…"
                : "Criando conta…"
              : mode === "login"
                ? "Entrar"
                : "Criar conta"}
          </Button>
        </form>

        {/* Footer hint */}
        <p className="text-center text-xs text-muted-foreground mt-5">
          {mode === "login" ? (
            <>
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-primary font-medium hover:underline"
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-primary font-medium hover:underline"
              >
                Entrar
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
