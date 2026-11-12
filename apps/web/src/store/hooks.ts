import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./index";

// Versões tipadas dos hooks do react-redux: use sempre estas nos componentes,
// assim `state` e os thunks já vêm com os tipos corretos.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
