import Decimal from "decimal.js";
import { ValidationError } from "./errors";

/**
 * Value Object: Dinheiro (Money)
 *
 * Encapsula operações monetárias com precisão — sem erros de arredondamento
 * de ponto flutuante. Usa Decimal.js internamente.
 */
export class Money {
  private readonly amount: Decimal;

  private constructor(amount: Decimal) {
    this.amount = amount;
  }

  // Factory: cria a partir de um número decimal (string ou number).
  static fromDecimal(value: string | number): Money {
    let decimal: Decimal;
    try {
      decimal = new Decimal(value);
    } catch {
      // Decimal lança o próprio erro para strings não numéricas (ex.: "", ".").
      throw new ValidationError(`Valor monetário inválido: ${value}`);
    }
    if (decimal.isNaN()) {
      throw new ValidationError(`Valor monetário inválido: ${value}`);
    }
    return new Money(decimal);
  }

  // Factory: valor zero.
  static zero(): Money {
    return new Money(new Decimal(0));
  }

  // Operações.
  plus(other: Money): Money {
    return new Money(this.amount.plus(other.amount));
  }

  minus(other: Money): Money {
    return new Money(this.amount.minus(other.amount));
  }

  multiply(factor: Decimal | string | number): Money {
    return new Money(this.amount.times(new Decimal(factor)));
  }

  divide(divisor: Decimal | string | number): Money {
    return new Money(this.amount.dividedBy(new Decimal(divisor)));
  }

  negate(): Money {
    return new Money(this.amount.negated());
  }

  // Predicados.
  isPositive(): boolean {
    return this.amount.isPositive();
  }

  isNegative(): boolean {
    return this.amount.isNegative();
  }

  isZero(): boolean {
    return this.amount.isZero();
  }

  equals(other: Money): boolean {
    return this.amount.equals(other.amount);
  }

  greaterThan(other: Money): boolean {
    return this.amount.greaterThan(other.amount);
  }

  lessThan(other: Money): boolean {
    return this.amount.lessThan(other.amount);
  }

  greaterThanOrEqual(other: Money): boolean {
    return this.amount.greaterThanOrEqualTo(other.amount);
  }

  lessThanOrEqual(other: Money): boolean {
    return this.amount.lessThanOrEqualTo(other.amount);
  }

  // Serialização.
  toDecimal(): number {
    return this.amount.toNumber();
  }

  toString(): string {
    return this.amount.toString();
  }

  // Formato de exibição em reais: "R$ 1.234,56".
  format(): string {
    const formatted = this.amount.toNumber().toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `R$ ${formatted}`;
  }
}
