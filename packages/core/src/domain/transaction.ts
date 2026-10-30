import { ValidationError } from "./errors";
import type { Money } from "./money";
import { Month } from "./month";

export const TRANSACTION_TYPES = ["credit", "debit"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

// Atributos usados para construir a entidade. Fica restrito a este arquivo:
// o resto do projeto trabalha sempre com a própria `Transaction`.
export interface TransactionProps {
  type: TransactionType;
  category: string;
  description: string;
  institution: string;
  date: Date | string; // Date ou string no formato "dd/mm/aaaa"
  amount: Money; // sempre positivo — o sinal vem de `type`
}

/**
 * Entidade: Transaction
 *
 * Tem identidade (id) e concentra as regras de negócio de uma transação.
 * Não depende de banco, HTTP nem React.
 */
export class Transaction {
  private constructor(
    private readonly _id: string | undefined, 
    private readonly _type: TransactionType,
    private readonly _category: string,
    private readonly _description: string,
    private readonly _institution: string,
    private readonly _dateString: string, // Sempre armazenam como string "dd/mm/aaaa"
    private readonly _amount: Money,
  ) {}

  /**
   * Cria uma transação nova (ainda sem id: quem atribui é a persistência),
   * garantindo as invariantes.
   */
  static create(props: TransactionProps): Transaction {
    if (!TRANSACTION_TYPES.includes(props.type)) {
      throw new ValidationError(`Tipo de transação inválido: ${String(props.type)}`);
    }
    if (!props.amount.isPositive()) {
      throw new ValidationError("O valor da transação deve ser maior que zero");
    }

    // Validar data (será parseada depois)
    try {
      if (typeof props.date === "string") {
        Month.fromString(props.date); // vai validar
      } else {
        if (Number.isNaN(props.date.getTime())) {
          throw new ValidationError("Data da transação inválida");
        }
      }
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new ValidationError("Data da transação inválida");
    }

    if (props.description.trim().length === 0) {
      throw new ValidationError("A descrição é obrigatória");
    }
    return Transaction.build(undefined, props);
  }

  /**
   * Reconstrói uma transação que já existe (vinda do banco ou da API).
   * Não revalida: dados antigos não podem deixar de ser lidos só porque uma
   * regra nova foi criada depois.
   */
  static restore(id: string, props: TransactionProps): Transaction {
    return Transaction.build(id, props);
  }

  private static build(id: string | undefined, props: TransactionProps): Transaction {
    // Converter para string "dd/mm/aaaa" se for Date
    const dateString = dateToString(props.date);
    
    // Validar via Month
    Month.fromString(dateString);

    return new Transaction(
      id,
      props.type,
      props.category,
      props.description,
      props.institution,
      dateString,
      props.amount,
    );
  }

  // Uma transação criada com `create` só ganha identidade ao ser persistida.
  get id(): string {
    if (this._id === undefined) {
      throw new Error("Transação ainda não persistida não possui id");
    }
    return this._id;
  }

  get type(): TransactionType {
    return this._type;
  }

  get category(): string {
    return this._category;
  }

  get description(): string {
    return this._description;
  }

  get institution(): string {
    return this._institution;
  }

  get date(): string {
    return this._dateString;
  }

  get amount(): Money {
    return this._amount;
  }

  get month(): string {
    return Month.fromString(this._dateString).name;
  }

  isCredit(): boolean {
    return this._type === "credit";
  }

  // Valor com sinal: positivo para entradas, negativo para saídas.
  signedAmount(): Money {
    return this.isCredit() ? this._amount : this._amount.negate();
  }
}

// Helper: converte Date em string "dd/mm/aaaa"
function dateToString(date: Date | string): string {
  if (typeof date === "string") return date;
  
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

