/**
 * @repo/core - Camada de negócio da aplicação
 *
 * Exporta:
 * - domain/: entidades, value objects, erros
 * - application/: casos de uso, portas (interfaces)
 * - main/factories: instâncias prontas dos casos de uso (repositório HTTP)
 */

// Domain exports
export * from "./domain/index";

// Application exports
export * from "./application/index";

// Factories
export * from "./main/factories";

// Erro HTTP lançado pelos casos de uso das factories
export { HttpError } from "./infra/http/HttpClient";

// DTO serializável + mapper: permite buscar dados no servidor (RSC) e
// reidratar as entidades de domínio no cliente.
export { TransactionMapper } from "./infra/mappers/transaction.mapper";
export type { Transaction as TransactionDto } from "./infra/http/dtos/transaction-dto";
