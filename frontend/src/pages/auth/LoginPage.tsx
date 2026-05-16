import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "../../features/auth/authSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import type { UserRole } from "../../types";

const redirectByRole: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  autorite_publique: "/authority/dashboard",
  entreprise: "/company/dashboard",
  commission_evaluation: "/commission/dashboard",
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

<<<<<<< HEAD
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const user = await dispatch(login({ email, password })).unwrap();
    const role = (user.role?.name || user.role_name) as UserRole;
    const fallback = redirectByRole[role] || "/";
    navigate((location.state as { from?: { pathname?: string } })?.from?.pathname || fallback);
=======
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formError, setFormError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!formData.email || !formData.password) {
      setFormError("Email et mot de passe sont obligatoires");
      return;
    }

    try {
      await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        }),
      ).unwrap();

      navigate("/dashboard");
    } catch (err) {
      setFormError(error || "Erreur de connexion");
    }
>>>>>>> 225b83bb86ef1ee73f1852449d2e0cf0729e6585
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">Connexion</h1>
        <p className="mt-1 text-sm text-slate-600">Acceder au portail des appels d'offres de la mairie de Goma.</p>
        <div className="mt-6 grid gap-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</Button>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Entreprise ? <Link className="font-medium text-emerald-700" to="/register-company">Creer un compte</Link>
        </p>
      </form>
    </main>
  );
}
