import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import "bootstrap/dist/css/bootstrap.min.css";
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    submitted: false,
    error: false,
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ submitted: false, error: false, message: "" });

    try {
      const response = await axiosInstance.post('/api/reset-password', { email });
      setStatus({
        submitted: true,
        error: false,
        message: "Un email de réinitialisation a été envoyé à votre adresse email."
      });
      setEmail("");
    } catch (error) {
      let errorMessage = "Une erreur s'est produite. Veuillez réessayer.";
      
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        // qui ne fait pas partie de la plage 2xx
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors && error.response.data.errors.email) {
          errorMessage = error.response.data.errors.email[0];
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

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Mot de passe oublié</h4>
            </div>
            <div className="card-body">
              {status.submitted && (
                <div className={`alert ${status.error ? "alert-danger" : "alert-success"}`}>
                  {status.message}
                </div>
              )}

              <p className="card-text mb-4">
                Veuillez saisir votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <Link to="/login" className="text-decoration-none">
                  Retour à la page de connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;