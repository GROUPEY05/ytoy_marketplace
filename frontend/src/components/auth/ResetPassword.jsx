import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState({
    submitted: false,
    error: false,
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Récupérer le token depuis l'URL
  const token = new URLSearchParams(location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ submitted: false, error: false, message: "" });

    if (password !== passwordConfirmation) {
      setStatus({
        submitted: true,
        error: true,
        message: "Les mots de passe ne correspondent pas."
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/update-password", {
        token,
        password,
        password_confirmation: passwordConfirmation
      });

      setStatus({
        submitted: true,
        error: false,
        message: response.data.message
      });

      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      
      if (error.response) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          const firstError = Object.values(error.response.data.errors)[0];
          errorMessage = firstError[0];
        }
      }
      
      setStatus({
        submitted: true,
        error: true,
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Lien de réinitialisation invalide. Veuillez demander un nouveau lien.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Réinitialisation du mot de passe</h4>
            </div>
            <div className="card-body">
              {status.submitted && (
                <div className={`alert ${status.error ? "alert-danger" : "alert-success"}`}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="passwordConfirmation" className="form-label">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="passwordConfirmation"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Réinitialisation en cours...
                      </>
                    ) : (
                      "Réinitialiser le mot de passe"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
