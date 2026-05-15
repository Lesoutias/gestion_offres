import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser, fetchCurrentUser } from "../features/auth/authSlice";
import { Button, Card, Layout } from "../components";

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const getDashboardPath = (role: string | undefined) => {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "recruiter":
        return "/recruiter/dashboard";
      case "candidate":
        return "/candidate/dashboard";
      default:
        return "/login";
    }
  };

  useEffect(() => {
    if (auth.token && auth.user) {
      navigate(getDashboardPath(auth.user.role_name));
    }
  }, [auth.token, auth.user, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      const user = await dispatch(fetchCurrentUser()).unwrap();
      navigate(getDashboardPath(user.role_name));
    } catch (err: any) {
      setError(err || "Impossible de se connecter");
    }
  };

  return (
    <Layout title="Connexion">
      <Card className="max-w-md mx-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-200"
              htmlFor="password"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
          Pas encore de compte ?{" "}
          <Link
            className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100"
            to="/register"
          >
            Inscrivez-vous
          </Link>
        </p>
      </Card>
    </Layout>
  );
}

export default LoginPage;
