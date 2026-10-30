/**
 * Erros de domínio — exceções que representam regras de negócio violadas.
 * Diferente de `InfrastructureError` ou `NotFoundError`, estes indicam
 * que as invariantes da entidade foram quebradas.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = "Recurso não encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InsufficientFundsError extends DomainError {
  constructor(message: string = "Saldo insuficiente") {
    super(message);
    this.name = "InsufficientFundsError";
  }
}
