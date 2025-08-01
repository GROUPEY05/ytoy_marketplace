// src/components/auth/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Register.css'
const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    mot_de_passe_confirmation: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    role: 'acheteur',
    nom_boutique: '',
    description: '',
    adresse_livraison: '',
    preferences: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await authService.register(formData)
      alert('Inscription réussie! Veuillez vérifier votre email.')
      navigate('/login')
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors)
      } else {
        setErrors({ general: error.message || 'Une erreur est survenue.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='container all' style={{ overflowX: 'hidden ' }}>
      <div className='img-container'>
        <div className='content'>
          <strong className='text-content'>
            <span style={{ color: '#FF6F00' }}>Inscrivez-vous</span>{' '}
            <span style={{ color: '#1B5FA3' }}>
              {' '}
              pour bénéficier des meilleures offres et des
            </span>
            <span className='text-dark'> offres exclusives </span>
            <span style={{ color: '#1B5FA3' }}>avec YtoyMarketplace</span>
          </strong>
        </div>

        <div style={{ width: '100%' }}>
            <img src="http://localhost:5173/image/img_register.svg" alt="" className="" />
        </div>
      </div>
      <div className=''>
        <div className=''>
          <div className='card border-0 rounded-lg'>
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h4 className='  ms-4 mb-0' style={{ color: '#1B5FA3', paddingRight: '60px' }}>
              {' '}
              <strong> INSCRIPTION </strong>
            </h4>
            <div style={{ paddingRight: '60px' }}>
              <img
                src='http://localhost:5173/image/logo_ytoy.png'
                alt='Logo'
                style={{ maxWidth: '100px' }}
              />
            </div>
          </div>
            <div className='card-body'>
              {errors.general && (
                <div className='alert alert-danger' role='alert'>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <input
                        type='email'
                        className={`form-control ${
                          errors.email ? 'is-invalid' : ''
                        }`}
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        placeholder='Email'
                        required
                      />
                      <label htmlFor='email'>Email</label>
                      {errors.email && (
                        <div className='invalid-feedback'>{errors.email}</div>
                      )}
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <select
                        className={`form-select ${
                          errors.role ? 'is-invalid' : ''
                        }`}
                        id='role'
                        name='role'
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value='acheteur'>Acheteur</option>
                        {/* <option value='vendeur'>Vendeur</option> */}
                      </select>
                      <label htmlFor='role'>Rôle</label>
                      {errors.role && (
                        <div className='invalid-feedback'>{errors.role}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <input
                        type='text'
                        className={`form-control ${
                          errors.nom ? 'is-invalid' : ''
                        }`}
                        id='nom'
                        name='nom'
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder='Nom'
                        required
                      />
                      <label htmlFor='nom'>Nom</label>
                      {errors.nom && (
                        <div className='invalid-feedback'>{errors.nom}</div>
                      )}
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <input
                        type='text'
                        className={`form-control ${
                          errors.prenom ? 'is-invalid' : ''
                        }`}
                        id='prenom'
                        name='prenom'
                        value={formData.prenom}
                        onChange={handleChange}
                        placeholder='Prénom'
                        required
                      />
                      <label htmlFor='prenom'>Prénom</label>
                      {errors.prenom && (
                        <div className='invalid-feedback'>{errors.prenom}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <input
                        type='password'
                        className={`form-control ${
                          errors.mot_de_passe ? 'is-invalid' : ''
                        }`}
                        id='mot_de_passe'
                        name='mot_de_passe'
                        value={formData.mot_de_passe}
                        onChange={handleChange}
                        placeholder='Mot de passe'
                        required
                      />
                      <label htmlFor='mot_de_passe'>Mot de passe</label>
                      {errors.mot_de_passe && (
                        <div className='invalid-feedback'>
                          {errors.mot_de_passe}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <input
                        type='password'
                        className='form-control'
                        id='mot_de_passe_confirmation'
                        name='mot_de_passe_confirmation'
                        value={formData.mot_de_passe_confirmation}
                        onChange={handleChange}
                        placeholder='Confirmez le mot de passe'
                        required
                      />
                      <label htmlFor='mot_de_passe_confirmation'>
                        Confirmez le mot de passe
                      </label>
                    </div>
                  </div>
                </div>

                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <input
                        type='tel'
                        className={`form-control ${
                          errors.telephone ? 'is-invalid' : ''
                        }`}
                        id='telephone'
                        name='telephone'
                        value={formData.telephone}
                        onChange={handleChange}
                        placeholder='Téléphone'
                        required
                      />
                      <label htmlFor='telephone'>Téléphone</label>
                      {errors.telephone && (
                        <div className='invalid-feedback'>
                          {errors.telephone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <div className='form-floating mb-3'>
                      <input
                        type='text'
                        className={`form-control ${
                          errors.adresse ? 'is-invalid' : ''
                        }`}
                        id='adresse'
                        name='adresse'
                        value={formData.adresse}
                        onChange={handleChange}
                        placeholder='Adresse'
                        required
                      />
                      <label htmlFor='adresse'>Adresse</label>
                      {errors.adresse && (
                        <div className='invalid-feedback'>{errors.adresse}</div>
                      )}
                    </div>
                  </div>
                </div>

                {formData.role === 'acheteur' && (
                  <div className='acheteur-fields'>
                    <div className='card mb-4 ' style={{ borderColor:'#FF6F00'}}>
                      <div className='card-header bg-light'>
                        <h5 className='mb-0 ' style={{ color:'#FF6F00'}}>
                          Informations acheteur
                        </h5>
                      </div>
                      <div className='card-body'>
                        <div className='form-floating mb-3'>
                          <input
                            type='text'
                            className='form-control'
                            id='adresse_livraison'
                            name='adresse_livraison'
                            value={formData.adresse_livraison}
                            onChange={handleChange}
                            placeholder='Adresse de livraison'
                          />
                          <label htmlFor='adresse_livraison'>
                            Adresse de livraison
                          </label>
                        </div>
                        <div className='form-floating mb-3'>
                          <textarea
                            className='form-control'
                            id='preferences'
                            name='preferences'
                            value={formData.preferences}
                            onChange={handleChange}
                            placeholder='Préférences'
                            style={{ height: '100px' }}
                          />
                          <label htmlFor='preferences'>Préférences</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* {formData.role === 'vendeur' && (
                  <div className='vendeur-fields'>
                    <div className='card mb-4 border-success'>
                      <div className='card-header bg-light'>
                        <h5 className='mb-0 text-success'>
                          Informations vendeur
                        </h5>
                      </div>
                      <div className='card-body'>
                        <div className='form-floating mb-3'>
                          <input
                            type='text'
                            className={`form-control ${
                              errors.nom_boutique ? 'is-invalid' : ''
                            }`}
                            id='nom_boutique'
                            name='nom_boutique'
                            value={formData.nom_boutique}
                            onChange={handleChange}
                            placeholder='Nom de la boutique'
                            required
                          />
                          <label htmlFor='nom_boutique'>
                            Nom de la boutique
                          </label>
                          {errors.nom_boutique && (
                            <div className='invalid-feedback'>
                              {errors.nom_boutique}
                            </div>
                          )}
                        </div>
                        <div className='form-floating mb-3'>
                          <textarea
                            className={`form-control ${
                              errors.description ? 'is-invalid' : ''
                            }`}
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            placeholder='Description'
                            style={{ height: '100px' }}
                          />
                          <label htmlFor='description'>Description</label>
                          {errors.description && (
                            <div className='invalid-feedback'>
                              {errors.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}

                <div className='d-grid mt-4'>
                  <button
                    type='submit'
                    className='btn btn-orange btn-lg' 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className='spinner-border spinner-border-sm me-2'
                          role='status'
                          aria-hidden='true'
                        ></span>
                        Inscription en cours...
                      </>
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className='card-footer text-center py-3'>
              <div className='small'>
                <p className='mb-0'>
                  Vous avez déjà un compte?
                  <a href='/login' className='text-decoration-none ms-1' style={{ color:'#FF6F00'}}>
                    Connectez-vous
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
