import React, { useState } from "react";
import api from "../services/api";

const AuthForm = ({ setToken, setUser, onNotify }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const resetRegisterForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setProfilePicture(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        onNotify?.({
          type: "success",
          title: "Connexion reussie",
          message: "Bienvenue dans votre dashboard TaskFlow.",
        });
        return;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        onNotify?.({
          type: "success",
          title: "Inscription reussie",
          message: "Vous pouvez maintenant vous connecter.",
        });
        setIsLogin(true);
        resetRegisterForm();
      }
    } catch (err) {
      onNotify?.({
        type: "error",
        title: "Action impossible",
        message: err.response?.data?.message || "Erreur lors de la soumission.",
      });
    }
  };

  return (
    <section className="auth-card">
      <p className="ui-kicker">Acces securise</p>
      <h1>{isLogin ? "Connexion" : "Inscription"}</h1>
      <p className="auth-intro">
        {isLogin
          ? "Connectez-vous pour retrouver vos taches personnelles."
          : "Creez un compte pour commencer a organiser vos taches."}
      </p>

      <form onSubmit={handleSubmit} className="form-stack">
        {!isLogin && (
          <label className="field">
            <span>Nom complet</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Hicham Abbouz"
            />
          </label>
        )}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
        </label>

        <label className="field">
          <span>Mot de passe</span>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {!isLogin && (
          <label className="field">
            <span>Photo de profil</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </label>
        )}

        <button type="submit" className="primary-button full-width">
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setIsLogin((current) => !current)}
        className="ghost-button full-width"
      >
        {isLogin ? "Pas de compte ? S'inscrire" : "Deja un compte ? Se connecter"}
      </button>
    </section>
  );
};

export default AuthForm;
