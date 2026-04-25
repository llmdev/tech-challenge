"use client";

import { useEffect, useState } from "react";
import { BalanceCard } from "@repo/balance-card";
import { TransactionForm } from "@repo/transaction-form";

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

export function HomeContent() {
  const [balance, setBalance] = useState("R$ ••••••");
  const [balanceVisible, setBalanceVisible] = useState(true);

  useEffect(() => {
    fetch("/api/saldo")
      .then((res) => res.json())
      .then((data: { balance: string }) => setBalance(data.balance));
  }, []);

  return (
    <>
      <BalanceCard
        userName="Joana"
        date={todayLabel()}
        accountType="Conta Corrente"
        balance={balance}
        balanceVisible={balanceVisible}
        onToggleVisibility={() => setBalanceVisible((v) => !v)}
      />
      <TransactionForm />
    </>
  );
}
