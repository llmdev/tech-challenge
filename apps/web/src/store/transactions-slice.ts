// ─────────────────────────────────────────────────────────────────────────────
// Slice de transações — "fatia" do estado global com:
//   • state inicial
//   • reducers síncronos (actions geradas automaticamente pelo RTK)
//   • thunks assíncronos (createAsyncThunk) que chamam os use cases do @repo/core
//
// Fluxo (State Manager Pattern / Flux):
//   componente ──dispatch(action)──▶ store ──reducer──▶ novo state ──▶ selectors ──▶ componentes re-renderizam
//
// Antes do Redux, HomeContent disparava `window.dispatchEvent("transactionCreated")`
// e StatementContent escutava esse evento para refazer o fetch. Agora existe uma
// única fonte de verdade: quem cria a transação atualiza o store, e qualquer
// componente que lê o store reage sozinho.
// ─────────────────────────────────────────────────────────────────────────────
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TransactionItemData } from "@repo/statement";
import {
  Money,
  Transaction,
  createTransactionUseCase,
  getBalanceUseCase,
  listLast5TransactionsUseCase,
  updateTransactionUseCase,
} from "@repo/core";
import { toStatementItem } from "@/lib/statement-items";

// O state do Redux precisa ser SERIALIZÁVEL (objetos/arrays/primitivos).
// Por isso guardamos `number` e `TransactionItemData` — e não as classes
// de domínio `Money`/`Transaction`, que têm métodos e campos privados.
export interface TransactionsState {
  balance: number;
  lastItems: TransactionItemData[];
  status: "idle" | "saving" | "failed";
  error: string | null;
}

const initialState: TransactionsState = {
  balance: 0,
  lastItems: [],
  status: "idle",
  error: null,
};

// Dados crus do formulário — o argumento de um thunk também deve ser serializável.
export interface TransactionInput {
  type: "credit" | "debit";
  category: string;
  description: string;
  institution: string;
  date: string;
  amount: string; // decimal com ponto, ex: "150.90"
}

interface AccountSnapshot {
  balance: number;
  lastItems: TransactionItemData[];
}

function toDomain(input: TransactionInput): Transaction {
  return Transaction.create({ ...input, amount: Money.fromDecimal(input.amount) });
}

// Depois de qualquer escrita, buscamos saldo e extrato juntos para o store
// refletir o servidor.
async function fetchAccountSnapshot(): Promise<AccountSnapshot> {
  const [balance, last5] = await Promise.all([
    getBalanceUseCase.execute(),
    listLast5TransactionsUseCase.execute(),
  ]);
  return { balance: balance.toDecimal(), lastItems: last5.map(toStatementItem) };
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Erro desconhecido";
}

// createAsyncThunk<Retorno, Argumento, Config> gera 3 actions automaticamente:
//   transactions/create/pending → transactions/create/fulfilled | transactions/create/rejected
export const createTransaction = createAsyncThunk<
  AccountSnapshot,
  TransactionInput,
  { rejectValue: string }
>("transactions/create", async (input, { rejectWithValue }) => {
  try {
    await createTransactionUseCase.execute(toDomain(input));
    return await fetchAccountSnapshot();
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const updateTransaction = createAsyncThunk<
  AccountSnapshot,
  { id: string; input: TransactionInput },
  { rejectValue: string }
>("transactions/update", async ({ id, input }, { rejectWithValue }) => {
  try {
    await updateTransactionUseCase.execute(id, toDomain(input));
    return await fetchAccountSnapshot();
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    // Hidratação: os Server Components já buscaram os dados; essas actions
    // apenas copiam esses valores iniciais para dentro do store.
    // (O RTK usa Immer — dá para "mutar" o draft com segurança.)
    balanceHydrated(state, action: PayloadAction<number>) {
      state.balance = action.payload;
    },
    lastItemsHydrated(state, action: PayloadAction<TransactionItemData[]>) {
      state.lastItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Os dois thunks têm o mesmo efeito no state, então compartilham os handlers.
    for (const thunk of [createTransaction, updateTransaction]) {
      builder
        .addCase(thunk.pending, (state) => {
          state.status = "saving";
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.status = "idle";
          state.balance = action.payload.balance;
          state.lastItems = action.payload.lastItems;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload ?? action.error.message ?? "Erro desconhecido";
        });
    }
  },
});

export const { balanceHydrated, lastItemsHydrated } = transactionsSlice.actions;
export const transactionsReducer = transactionsSlice.reducer;

// Selectors: a única forma de os componentes lerem o state. Se o formato do
// state mudar, só os selectors precisam ser ajustados.
type WithTransactions = { transactions: TransactionsState };
export const selectBalance = (state: WithTransactions) => state.transactions.balance;
export const selectLastItems = (state: WithTransactions) => state.transactions.lastItems;
export const selectIsSaving = (state: WithTransactions) => state.transactions.status === "saving";
export const selectTransactionsError = (state: WithTransactions) => state.transactions.error;
