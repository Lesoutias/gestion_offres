import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { loadCurrentUser, logout } from "./features/auth/authSlice";
import AppRouter from "./router/AppRouter";

export default function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(loadCurrentUser());
    }
    const onLogout = () => dispatch(logout());
    window.addEventListener("auth:logout", onLogout);
    return () => window.removeEventListener("auth:logout", onLogout);
  }, [dispatch, token]);

  return <AppRouter />;
}
