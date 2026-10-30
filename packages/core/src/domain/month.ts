import { ValidationError } from "./errors";

export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

export type MonthName = (typeof MONTH_NAMES)[number];

/**
 * Value Object: Mês (Month)
 *
 * Representa o mês de uma data e sabe devolver o nome dele em português.
 * Ex.: "24/01/2026" -> "Janeiro".
 */
export class Month {
  private readonly index: number; // 0 = Janeiro ... 11 = Dezembro

  private constructor(index: number) {
    this.index = index;
  }

  // Factory: cria a partir de uma data no formato dd/mm/aaaa.
  static fromString(value: string): Month {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
    if (!match) {
      throw new ValidationError(`Data inválida, use o formato dd/mm/aaaa: ${value}`);
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    // Rejeita datas que não existem no calendário, como 31/02/2026.
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
      throw new ValidationError(`Data inválida: ${value}`);
    }

    return new Month(month - 1);
  }

  // Factory: cria a partir de um Date. Usa UTC porque as datas de
  // `Transaction` são guardadas como meia-noite UTC.
  static fromDate(date: Date): Month {
    if (Number.isNaN(date.getTime())) {
      throw new ValidationError("Data inválida");
    }
    return new Month(date.getUTCMonth());
  }

  // Número do mês, de 1 a 12.
  get number(): number {
    return this.index + 1;
  }

  get name(): MonthName {
    return MONTH_NAMES[this.index] as MonthName;
  }

  toString(): string {
    return this.name;
  }
}
