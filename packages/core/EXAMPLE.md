// Exemplo de como usar @repo/core em um app

import { Transaction, Money, ValidationError } from "@repo/core/domain";
import { CreateTransactionUseCase } from "@repo/core/application";
import { InMemoryTransactionRepository } from "@repo/core/testing";

// 1. Criar uma transação
const tx = Transaction.create({
  type: "credit",
  category: "salario",
  description: "Salário mensal",
  institution: "Banco Inter",
  date: new Date(),
  amount: Money.fromDecimal(5000),
});

// 2. Usar o caso de uso
const repository = new InMemoryTransactionRepository();
const createUseCase = new CreateTransactionUseCase(repository);

const created = await createUseCase.execute("user-123", tx);
console.log(`Transação criada: ${created.id}`);

// 3. Operações com Money
const salary = Money.fromDecimal(5000);
const expense = Money.fromDecimal(250);
const remaining = salary.minus(expense);

console.log(`Saldo: R$ ${remaining.toDecimal()}`);
