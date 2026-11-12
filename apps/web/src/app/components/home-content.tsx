"use client";

import { useRef, useState } from "react";
import { BalanceCard } from "@repo/balance-card";
import { TransactionForm } from "@/app/components/transaction-form";
import { useAppSelector, useAppStore } from "@/store/hooks";
import { balanceHydrated, selectBalance } from "@/store/transactions-slice";

const PT_DAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function todayLabel(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${PT_DAYS[d.getDay()]}, ${dd}/${mm}/${d.getFullYear()}`;
}

// initialBalance vem do servidor e é copiado para o store no primeiro render.
// O saldo passa a ser estado GLOBAL (lido do store); quando o formulário cria
// uma transação, o thunk atualiza o saldo e este componente re-renderiza.
export function HomeContent({
  userName,
  initialBalance,
}: {
  userName: string;
  initialBalance: number;
}) {
  const store = useAppStore();
  const hydrated = useRef(false);
  if (!hydrated.current) {
    store.dispatch(balanceHydrated(initialBalance));
    hydrated.current = true;
  }

  const balanceValue = useAppSelector(selectBalance);

  // Nem tudo vai para o Redux: mostrar/ocultar o saldo só interessa a este
  // componente, então continua como estado LOCAL.
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <>
      <BalanceCard
        userName={userName}
        date={todayLabel()}
        accountType="Conta Corrente"
        balanceValue={balanceValue}
        balanceVisible={balanceVisible}
        onToggleVisibility={() => setBalanceVisible((v) => !v)}
      />
      <TransactionForm variant="card" />
    </>
  );
}
