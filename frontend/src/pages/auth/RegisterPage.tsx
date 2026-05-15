import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { registerUser } from "../../features/auth/authSlice";
import { UserRole } from "../../types";

export function RegisterPage(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
    confirmPassword: "",
    role_name: "candidate" as UserRole,
  });

  const [formError, setFormError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!formData.email || !formData.full_name || !formData.password) {
      setFormError("Tous les champs sont obligatoires");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Le mot de passe doit avoir au moins 6 caractères");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const result = await dispatch(
        registerUser({
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password,
          role_name: formData.role_name,
        }),
      ).unwrap();

      if (result) {
        // Redirection selon le rôle
        const roleRoutes: Record<UserRole, string> = {
          candidate: "/candidate/dashboard",
          recruiter: "/recruiter/dashboard",
          admin: "/admin/dashboard",
        };
        navigate(roleRoutes[formData.role_name]);
      }
    } catch (err) {
      setFormError(error || "Erreur d'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inscription</h1>
          <p className="text-gray-600 text-sm mt-2">
            Créez un compte pour accéder à la plateforme
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="votre@email.com"
            />
          </div>

          {/* Nom complet */}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom complet
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={formData.full_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Jean Dupont"
            />
          </div>

          {/* Rôle */}
          <div>
            <label
              htmlFor="role_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Je suis un(e):
            </label>
            <select
              id="role_name"
              name="role_name"
              value={formData.role_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="candidate">Demandeur d'emploi (Candidat)</option>
              <option value="recruiter">Recruteur</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.role_name === "candidate"
                ? "Vous pourrez chercher et postuler à des offres d'emploi"
                : "Vous pourrez créer et gérer des offres d'emploi"}
            </p>
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Erreurs */}
          {(formError || error) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{formError || error}</p>
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        {/* Lien vers connexion */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Vous avez déjà un compte?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Connexion
          </a>
        </p>
      </div>
    </div>
  );
}
