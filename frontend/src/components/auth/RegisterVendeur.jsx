// src/components/auth/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../../services/api'
import 'bootstrap/dist/css/bootstrap.min.css'
import './RegisterVendeur.css'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

const RegisterVendeur = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    mot_de_passe_confirmation: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    ville: '',
    role: 'vendeur',
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
      const response = await authService.registervendeur(formData)
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

  // return (
  //   <div className=' bg-light py-4 min-vh-100'>
  //     <div className='col-3 '>
  //       <div>
  //         <br />
  //         <br />
  //         <p>
  //           <strong>
  //             <span style={{ color: '#FF6F00' }}>Inscrivez-vous</span>{' '}
  //             <span style={{ color: '#1B5FA3' }}>
  //               {' '}
  //               pour bénéficier des meilleures offres et des
  //             </span>
  //             <span className='text-dark'> offres exclusives </span>
  //             <span style={{ color: '#1B5FA3' }}>avec YtoyMarketplace</span>
  //           </strong>
  //         </p>
  //       </div>
  //       <div style={{ width: '100%' }}>
  //           <img src="http://localhost:5173/image/img_register.svg" alt="" class="img-fluid" />
  //       </div>
  //     </div>

  //     <div className=' row justify-content-center w-100  ' >
  //       <div className='col-11 col-md-9 col-lg-7 col-xl-6 '>
  //         <div className='card shadow-lg border-0 rounded-lg'>
  //           <div className='card-header bg-primary text-white text-center'>
  //             <h3 className='mb-0'>Inscription</h3>
  //           </div>
  //           <div className='card-body'>
  //             {errors.general && (
  //               <div className='alert alert-danger' role='alert'>
  //                 {errors.general}
  //               </div>
  //             )}

  //             <form onSubmit={handleSubmit}>
  //               <div className='row mb-3'>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='email'
  //                       className={`form-control ${
  //                         errors.email ? 'is-invalid' : ''
  //                       }`}
  //                       id='email'
  //                       name='email'
  //                       value={formData.email}
  //                       onChange={handleChange}
  //                       placeholder='Email'
  //                       required
  //                     />
  //                     <label htmlFor='email'>Email</label>
  //                     {errors.email && (
  //                       <div className='invalid-feedback'>{errors.email}</div>
  //                     )}
  //                   </div>
  //                 </div>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <select
  //                       className={`form-select ${
  //                         errors.role ? 'is-invalid' : ''
  //                       }`}
  //                       id='role'
  //                       name='role'
  //                       value={formData.role}
  //                       onChange={handleChange}
  //                       required
  //                     >
  //                       <option value='Vendeur'>Vendeur</option>
  //                       {/* <option value='vendeur'>Vendeur</option> */}
  //                     </select>
  //                     <label htmlFor='role'>Rôle</label>
  //                     {errors.role && (
  //                       <div className='invalid-feedback'>{errors.role}</div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className='row mb-3'>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='text'
  //                       className={`form-control ${
  //                         errors.nom ? 'is-invalid' : ''
  //                       }`}
  //                       id='nom'
  //                       name='nom'
  //                       value={formData.nom}
  //                       onChange={handleChange}
  //                       placeholder='Nom'
  //                       required
  //                     />
  //                     <label htmlFor='nom'>Nom</label>
  //                     {errors.nom && (
  //                       <div className='invalid-feedback'>{errors.nom}</div>
  //                     )}
  //                   </div>
  //                 </div>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='text'
  //                       className={`form-control ${
  //                         errors.prenom ? 'is-invalid' : ''
  //                       }`}
  //                       id='prenom'
  //                       name='prenom'
  //                       value={formData.prenom}
  //                       onChange={handleChange}
  //                       placeholder='Prénom'
  //                       required
  //                     />
  //                     <label htmlFor='prenom'>Prénom</label>
  //                     {errors.prenom && (
  //                       <div className='invalid-feedback'>{errors.prenom}</div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className='row mb-3'>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='password'
  //                       className={`form-control ${
  //                         errors.mot_de_passe ? 'is-invalid' : ''
  //                       }`}
  //                       id='mot_de_passe'
  //                       name='mot_de_passe'
  //                       value={formData.mot_de_passe}
  //                       onChange={handleChange}
  //                       placeholder='Mot de passe'
  //                       required
  //                     />
  //                     <label htmlFor='mot_de_passe'>Mot de passe</label>
  //                     {errors.mot_de_passe && (
  //                       <div className='invalid-feedback'>
  //                         {errors.mot_de_passe}
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='password'
  //                       className='form-control'
  //                       id='mot_de_passe_confirmation'
  //                       name='mot_de_passe_confirmation'
  //                       value={formData.mot_de_passe_confirmation}
  //                       onChange={handleChange}
  //                       placeholder='Confirmez le mot de passe'
  //                       required
  //                     />
  //                     <label htmlFor='mot_de_passe_confirmation'>
  //                       Confirmez le mot de passe
  //                     </label>
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className='row mb-3'>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='tel'
  //                       className={`form-control ${
  //                         errors.telephone ? 'is-invalid' : ''
  //                       }`}
  //                       id='telephone'
  //                       name='telephone'
  //                       value={formData.telephone}
  //                       onChange={handleChange}
  //                       placeholder='Téléphone'
  //                       required
  //                     />
  //                     <label htmlFor='telephone'>Téléphone</label>
  //                     {errors.telephone && (
  //                       <div className='invalid-feedback'>
  //                         {errors.telephone}
  //                       </div>
  //                     )}
  //                   </div>
  //                 </div>
  //                 <div className='col-md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='text'
  //                       className={`form-control ${
  //                         errors.adresse ? 'is-invalid' : ''
  //                       }`}
  //                       id='adresse'
  //                       name='adresse'
  //                       value={formData.adresse}
  //                       onChange={handleChange}
  //                       placeholder='Adresse'
  //                       required
  //                     />
  //                     <label htmlFor='adresse'>Adresse</label>
  //                     {errors.adresse && (
  //                       <div className='invalid-feedback'>{errors.adresse}</div>
  //                     )}
  //                   </div>
  //                 </div>

  //                 <div className='col-12 -md-6'>
  //                   <div className='form-floating mb-3'>
  //                     <input
  //                       type='text'
  //                       className={`form-control w-100  ${
  //                         errors.ville ? 'is-invalid' : ''
  //                       }`}
  //                       id='ville'
  //                       name='ville'
  //                       value={formData.ville}
  //                       onChange={handleChange}
  //                       placeholder='Ville'
  //                       required
  //                     />
  //                     <label htmlFor='ville'>Ville</label>
  //                     {errors.ville && (
  //                       <div className='invalid-feedback'>{errors.ville}</div>
  //                     )}
  //                   </div>
  //                 </div>
  //               </div>

  //               {formData.role === 'vendeur' && (
  //                 <div className='vendeur-fields'>
  //                   <div className='card mb-4 border-success'>
  //                     <div className='card-header bg-light'>
  //                       <h5 className='mb-0 text-success'>
  //                         Informations vendeur
  //                       </h5>
  //                     </div>
  //                     <div className='card-body'>
  //                       <div className='form-floating mb-3'>
  //                         <input
  //                           type='text'
  //                           className={`form-control ${
  //                             errors.nom_boutique ? 'is-invalid' : ''
  //                           }`}
  //                           id='nom_boutique'
  //                           name='nom_boutique'
  //                           value={formData.nom_boutique}
  //                           onChange={handleChange}
  //                           placeholder='Nom de la boutique'
  //                           required
  //                         />
  //                         <label htmlFor='nom_boutique'>
  //                           Nom de la boutique
  //                         </label>
  //                         {errors.nom_boutique && (
  //                           <div className='invalid-feedback'>
  //                             {errors.nom_boutique}
  //                           </div>
  //                         )}
  //                       </div>

  //                       <div className='form-floating mb-3'>
  //                         <textarea
  //                           className={`form-control ${
  //                             errors.description ? 'is-invalid' : ''
  //                           }`}
  //                           id='description'
  //                           name='description'
  //                           value={formData.description}
  //                           onChange={handleChange}
  //                           placeholder='Description'
  //                           style={{ height: '100px' }}
  //                         />
  //                         <label htmlFor='description'>Description</label>
  //                         {errors.description && (
  //                           <div className='invalid-feedback'>
  //                             {errors.description}
  //                           </div>
  //                         )}
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>
  //               )}

  //               <div className='d-grid mt-4'>
  //                 <button
  //                   type='submit'
  //                   className='btn btn-primary btn-lg'
  //                   disabled={loading}
  //                 >
  //                   {loading ? (
  //                     <>
  //                       <span
  //                         className='spinner-border spinner-border-sm me-2'
  //                         role='status'
  //                         aria-hidden='true'
  //                       ></span>
  //                       Inscription en cours...
  //                     </>
  //                   ) : (
  //                     "S'inscrire"
  //                   )}
  //                 </button>
  //               </div>
  //             </form>
  //           </div>
  //           <div className='card-footer text-center py-3'>
  //             <div className='small'>
  //               <p className='mb-0'>
  //                 Vous avez déjà un compte?
  //                 <a href='/login' className='text-decoration-none ms-1'>
  //                   Connectez-vous
  //                 </a>
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  return (
    <div className=' bg-light  min-vh-100 '>
      <div className='row justify-content-center mx-0'>
        {/* colone de gauche */}
        <div className='col-12 col-md-5  bg-light d-flex flex-column justify-content-between '>
          <div  className='image-container'>
            <div className="overlay-text">
                
                <p className=''>« En seulement 1 an, ytoy  markeplace a généré 14 nouveaux clients avec une croissance des ventes totale de 1,5 million de dollars. ».</p>
                
            </div>
          </div>
          {/* <p>
            <strong style={{ fontSize: '1.5rem' }}>
              <span style={{ color: '#FF6F00' }}>Inscrivez-vous</span>{' '}
              <span style={{ color: '#1B5FA3' }}>
                {' '}
                pour bénéficier des meilleures offres et des
              </span>
              <span className='text-dark'> offres exclusives </span>
              <span style={{ color: '#1B5FA3' }}>avec YtoyMarketplace</span>
            </strong>
          </p>
          <div className='text-center mt-4'>
            <img
              src='http://localhost:5173/image/img_register.svg'
              className='img-fluid'
              style={{ maxHeight: '300px' }}
            />
          </div> */}
        </div>

        {/* colone de droite */}
        <div
          className='col-12 col-md-7 py-4  border bg-white'
          style={{ borderColor: '#FF6F00' }}
        >
          <div className='d-flex justify-content-between align-items-center mb-4'>
            <h4 className=' mb-0' style={{ color: '#1B5FA3', paddingRight: '60px' }}>
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
          <p className='text-muted small mb-4'>
            Créez votre compte gratuitement et rejoignez nous sur ytoy_marketplace pour la commercialisation de vos articles.
          </p>

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
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                    id='role'
                    name='role'
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value='Vendeur'>Vendeur</option>
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
                    className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
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
                    <div className='invalid-feedback'>{errors.telephone}</div>
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

              <div className='col-12 -md-6'>
                <div className='form-floating mb-3'>
                  <input
                    type='text'
                    className={`form-control w-100  ${
                      errors.ville ? 'is-invalid' : ''
                    }`}
                    id='ville'
                    name='ville'
                    value={formData.ville}
                    onChange={handleChange}
                    placeholder='Ville'
                    required
                  />
                  <label htmlFor='ville'>Ville</label>
                  {errors.ville && (
                    <div className='invalid-feedback'>{errors.ville}</div>
                  )}
                </div>
              </div>
            </div>

            {formData.role === 'vendeur' && (
              <div className='vendeur-fields'>
                <div className='card mb-4 border-success'>
                  <div className='card-header bg-light'>
                    <h5 className='mb-0 text-success'>Informations vendeur</h5>
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
                      <label htmlFor='nom_boutique'>Nom de la boutique</label>
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
            )}

            <div className='d-grid mt-4'>
              <button
                type='submit'
                className='btn  btn-orange btn-lg'
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
  )
}

export default RegisterVendeur
