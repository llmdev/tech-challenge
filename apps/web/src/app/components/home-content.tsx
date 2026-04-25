"use client";

import { useCallback, useEffect, useState } from "react";
import { BalanceCard } from "@repo/balance-card";
import { TransactionForm } from "@/app/components/transaction-form";

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

function parseBalance(balanceStr: string): number {
  return parseFloat(
    balanceStr.replace("R$", "").trim().replace(/\./g, "").replace(",", ".")
  );
}

export function HomeContent() {
  const [balanceValue, setBalanceValue] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);

  const fetchBalance = useCallback(async () => {
    const res = await fetch("/api/saldo");
    const data: { balance: string } = await res.json();
    setBalanceValue(parseBalance(data.balance));
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  function handleTransactionSuccess() {
    fetchBalance();
    window.dispatchEvent(new CustomEvent("transactionCreated"));
  }

  return (
    <>
      <BalanceCard
        userName="Joana"
        date={todayLabel()}
        accountType="Conta Corrente"
        balanceValue={balanceValue}
        balanceVisible={balanceVisible}
        onToggleVisibility={() => setBalanceVisible((v) => !v)}
      />
      <TransactionForm onSuccess={handleTransactionSuccess} />
    </>
  );
}
