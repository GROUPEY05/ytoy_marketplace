// src/components/Home.jsx

import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './Home.css'
import { apiClient } from '../services/api'
import { FaPercent} from "react-icons/fa";
import { FaStore} from "react-icons/fa";
import HomeCategoryPreview from './products/HomeCategoryPreview'
import PromotionSection from './acheteur/PromotionSection'

import Header from './layout/Header'
import Footer from './layout/Footer'
import MenuCategories from './layout/MenuCategories'
import HomeProducts from './products/HomeProducts'


const Home = () => {
  const { isAuthenticated, currentUser } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const searchInputRef = useRef(null)

  const promotionsRef = useRef(null);
 
  
  // Fonction pour défiler vers la référence
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }; // Added missing closing brace
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('http://localhost:8000/api/categories')
        setCategories(response.data)
        setError('')
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err)
        setError('Impossible de charger les catégories.')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <div className="">
      <Header />
    
      <div className='container  mt-3'>
        <div className='d-flex  gap-5'>
          {/* menu */}
          
          <MenuCategories />
          <div className='mt-2'>
            <p style={{ color: '#FF6F00', fontSize: '15px' }}>
              {' '}
              <strong> Toutes les Catégories </strong>
            </p>
          </div>
            {/* promotion */}
          <div className='justify-content-center  mt-2' >
            
            <a href="/acheteur/promotion-liste" style={{ color: '#FF6F00', fontSize: '15px', textDecoration: 'none', marginLeft: '250px' }} onClick={() => scrollToRef(promotionsRef)}><FaPercent className=""style={{color: 'black'}} /> <strong>Promotions </strong></a>
          </div>
          {/* devenir vendeur */}
          <div className='justify-content-end  mt-2'>
            
            <a href="/RegisterVendeur" style={{ color: '#FF6F00', fontSize: '15px', textDecoration: 'none', marginLeft: '242px' }}><FaStore className="me-2" style={{color: 'black'}}/> <strong>Devenir Vendeur </strong></a>
          </div>
        </div>
      </div>
      {/* le caroussel */}
      <div className=' '>
        <div
          id='carouselExampleAutoplaying'
          className='carousel slide'
          data-bs-ride='carousel'
           data-bs-interval='2000'
        >
          <div className='carousel-inner'>
            <div className='carousel-item active'>
              <img
                src='http://localhost:5173/image/xiaomi.webp'
                className='d-block w-100'
                alt='...'
              />
            </div>
            <div className='carousel-item ' style={{ height: '500px' }}>
              <img
                src='http://localhost:5173/image/sale.jpg'
                className='d-block w-100'
                alt='...'
              />
            </div>
            <div className='carousel-item'>
              <img
                src='http://localhost:5173/image/tvsmart.webp'
                className='d-block w-100'
                alt='...'
              />
            </div>
            <div className='carousel-item'>
              <img
                src='http://localhost:5173/image/ramadan.webp'
                className='d-block w-100'
                alt='...'
              />
            </div>
          </div>
          <button
            className='carousel-control-prev'
            type='button'
            data-bs-target='#carouselExampleAutoplaying'
            data-bs-slide='prev'
          >
            <span className='carousel-control-prev-icon' aria-hidden='true'></span>
            <span className='visually-hidden'>Previous</span>
          </button>
          <button
            className='carousel-control-next'
            type='button'
            data-bs-target='#carouselExampleAutoplaying'
            data-bs-slide='next'
          >
            <span className='carousel-control-next-icon' aria-hidden='true'></span>
            <span className='visually-hidden'>Next</span>
          </button>
        </div>
        {/* <div className="row justify-content-center">
  <div className="col-md-8">
    <div className="card">
      <div className="card-header bg-primary text-white">
        <h2 className="mb-0">Bienvenue sur notre plateforme</h2>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <h3>Notre marketplace</h3>
          <p className="lead">
            Découvrez un large choix de produits et services proposés par nos vendeurs partenaires.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg">
              Se connecter
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg">
              S'inscrire
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h4 className="mb-3">Bonjour, {currentUser.prenom} {currentUser.nom}</h4>
            {currentUser.role === 'administrateur' && (
              <Link to="/admin/dashboard" className="btn btn-primary btn-lg">
                Accéder au tableau de bord administrateur
              </Link>
            )}
            {currentUser.role === 'vendeur' && (
              <Link to="/vendeur/dashboard" className="btn btn-primary btn-lg">
                Accéder à votre espace vendeur
              </Link>
            )}
            {currentUser.role === 'acheteur' && (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Accéder à votre espace personnel
              </Link>
            )}
          </div>
        )}
      </div>
    </div>

    <div className="row mt-5">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <i className="bi bi-shop fs-1 text-primary mb-3"></i>
            <h4>Vendez vos produits</h4>
            <p>Devenez vendeur et proposez vos produits sur notre plateforme.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <i className="bi bi-cart-check fs-1 text-primary mb-3"></i>
            <h4>Achetez en toute sécurité</h4>
            <p>Profitez d'une expérience d'achat sécurisée et transparente.</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <i className="bi bi-star fs-1 text-primary mb-3"></i>
            <h4>Partagez votre avis</h4>
            <p>Évaluez les produits et partagez votre expérience avec la communauté.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> */}
      </div>
       {/* les boutiques */}
      <div className=' container mt-5'>
        {/* bloc1 */}
        <div className='d-flex'>
          <h3 className='justify-content-start'> <strong>Nos boutiques</strong></h3>
          <button className='btn  btn-success justify-content-end ' type='submit' style={{backgroundColor: '#000000', border:'none', marginLeft: '820px'}}>
              <a href="/produit-par-categorie" style={{color: '#ffffff', textDecoration: 'none'}}> <strong>voir plus</strong> </a>
              
            </button>

        </div>
        {/* bloc2 */}
        <div className='d-flex gap-5' style={{marginLeft:'20px'}}>
          {/* boutique1 */} 
          <div className='card border-0 shadow-sm mt-5' style={{width: "272.32px"}}  >
          <img 
            src="http://localhost:5173/image/perruques_metisse1.jpeg" 
            alt="Beauty Corporate" 
            className="card-img-top img-fluid rounded-3"
            style={{
              height: "150px",
              objectFit: "cover",
              borderRadius: "12px"
            }}
          />
          <div 
            className="position-absolute top-0 start-0 rounded-3" 
            style={{
              width: "272.32px",
              height: "150px",
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px"
            }}
          >

          </div>
            <div className="overlay-text2 mt-5 ">
                
                <p className=''><strong>Beauty corporate</strong></p>
                
            </div>
            <a href="/boutique_jane" className='text-center mt-2' style={{color:'#000000', textDecoration:'none', fontSize:'25px'}}><strong>By jane smith</strong></a>

          </div>
          {/* boutique2 */}
          <div className='card border-0 shadow-sm mt-5' style={{width: "272.32px"}}  >
          <img 
            src="http://localhost:5173/image/habits1.jpeg" 
            alt="Beauty Corporate" 
            className="card-img-top img-fluid rounded-3 "
            style={{
              height: "150px",
              objectFit: "cover",
              borderRadius: "12px"

            }}
          />
          <div 
            className="position-absolute top-0 start-0 rounded-3" 
            style={{
              width: "272.32px",
              height: "150px",
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px"
            }}
          >

          </div>
            <div className="overlay-text3 mt-5 ">
                
                <p className='text-center'><strong>Dress   Well</strong></p>
                
            </div>
            <a href="/boutique_john" className='text-center mt-2' style={{color:'#000000', textDecoration:'none', fontSize:'25px'}}><strong>By john doe</strong></a>

          </div>
          {/* boutique3 */}
          <div className='card border-0 shadow-sm mt-5' style={{width: "272.32px"}}  >
          <img 
            src="http://localhost:5173/image/high_tech1.jpeg" 
            alt="Beauty Corporate" 
            className="card-img-top img-fluid rounded-3"
            style={{
              height: "150px",
              objectFit: "cover",
              borderRadius: "12px"
            }}
          />
          <div 
            className="position-absolute top-0 start-0 rounded-3" 
            style={{
              width: "272.32px",
              height: "150px",
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px"
            }}
          >

          </div>
            <div className="overlay-text4 mt-5 ">
                
                <p className=''><strong>Hight-tech empire</strong></p>
                
            </div>
            <a href="/boutique_jane" className='text-center mt-2' style={{color:'#000000', textDecoration:'none', fontSize:'25px'}}><strong>By wifried  N.</strong></a>

          </div>
          {/* boutique4 */}
          <div className='card border-0 shadow-sm mt-5' style={{width: "272.32px"}}  >
          <img 
            src="http://localhost:5173/image/all_shop1.jpeg" 
            alt="Beauty Corporate" 
            className="card-img-top img-fluid rounded-3"
            style={{
              height: "150px",
              objectFit: "cover",
              borderRadius: "12px"
            }}
          />
          <div 
            className="position-absolute top-0 start-0 rounded-3" 
            style={{
              width: "272.32px",
              height: "150px",
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px"
            }}
          >

          </div>
            <div className="overlay-text3 mt-5 ">
                
                <p className=''><strong>All-shop</strong></p>
                
            </div>
            <a href="/boutique_jane" className='text-center mt-2' style={{color:'#000000', textDecoration:'none', fontSize:'25px'}}><strong>By Schékina  y.</strong></a>

          </div>
        </div>

      </div>

      {/* Affichage des produits */}
      <HomeProducts /><br /><br />

      {/* <HomeCategoryPreview /><br /><br /> */}

      {/* Affichage des offres */}
      <PromotionSection />


      {/* card offres */}
      <div  className= "mt-5" style={{background:' rgba(217, 217, 217, 0.4)',}} > <br />
        <div  className='container h3' > <strong>Nos Offres</strong></div><br />
          {/* bloc1 */}
        <div className='container d-flex justify-content-between'>
          {/* card1 bloc1 */}
          <div className='my-card' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }} >
            <h4 className='mt-3 text-center' style={{marginLeft:'10px'}}><strong>Cuisine et maison</strong></h4>
            <div className='d-flex gap-3 p-4 justify-content-center'>
              <div>
                <img  src='http://localhost:5173/image/electromenager.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2' style={{fontSize:'10px'}}> <strong> Petit électroménager </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/refrigerateur2.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Réfrigérateur </strong></p>
              </div>
            </div>


            <div className='d-flex gap-3 p-4 justify-content-center mt-0'>            
              <div>
                <img  src='http://localhost:5173/image/meubles.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong>Meubles</strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/ustensile.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Ustensile </strong></p>
              </div>
            </div>
          </div>

          {/* card2 bloc1 */}
          <div className='my-card' style={{ backgroundColor:'#FFFFFF' }}>
            <h4 className='mt-3 text-center'><strong>Bureau</strong></h4>  
            <div className='d-flex gap-3 p-4 justify-content-center'>
              <div>
                <img  src='http://localhost:5173/image/tablette1.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Tablettes tactiles </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/laptop1.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Ordinateurs portables </strong></p>
              </div>
            </div>

            <div className='d-flex gap-3 p-4 justify-content-center mt-0'>            
              <div>
                <img  src='http://localhost:5173/image/ordi.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2' style={{fontSize:'10px'}}> <strong> Ordinateurs de bureau </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/fourniture.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Fournitures de bureau </strong></p>
              </div>
            </div>
          </div>
          {/* card3 bloc1 */}
          <div className='my-card' style={{backgroundColor:'#FFFFFF'}}>
            <h4  className='mt-3 text-center'><strong>Maison</strong></h4>  
            <div className='d-flex gap-3 p-4 justify-content-center'>
              <div>
                <img  src='http://localhost:5173/image/chambre.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Chambre </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/salon.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Salon</strong></p>
              </div>
            </div>

            <div className='d-flex gap-3 p-4 justify-content-center mt-0'>            
              <div>
                <img  src='http://localhost:5173/image/bain.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Salle De Bain </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/cuisine1.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Cuisine </strong></p>
              </div>
            </div>  
          </div>
        </div>

        {/* bloc2 */}

        <div className='container justify-content-between d-flex gap-2 mt-5 '>
          {/* card1 bloc2 */}
          <div className='my-card' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }} >
            <h4 className='mt-3 text-center' style={{marginLeft:'10px'}}><strong>Accessoires</strong></h4>
            <div className='d-flex gap-3 p-4 justify-content-center'>
              <div>
                <img  src='http://localhost:5173/image/casque.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Casque JBL </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/chargeur_oraimo_1.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Chargeur ORAIMO </strong></p>
              </div>
            </div>


            <div className='d-flex gap-3 p-4 justify-content-center mt-0'>            
              <div>
                <img  src='http://localhost:5173/image/aiport.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong>Ecouteur sans fil</strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/montre_connecte.jpeg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Montre connectée </strong></p>
              </div>
            </div>
          </div>

          {/* card2 bloc2 */}
          <div className='my-card' style={{ backgroundColor:'#FFFFFF' }}>
            <h4 className='mt-3 text-center'><strong>Perruque</strong></h4>  
            <div className='d-flex gap-3 p-4 justify-content-center'>
              <div>
                <img  src='http://localhost:5173/image/fumy.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Fumy </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/curly.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Pixie curly </strong></p>
              </div>
            </div>

            <div className='d-flex gap-3 p-4 justify-content-center mt-0'>            
              <div>
                <img  src='http://localhost:5173/image/metisse.jpg'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Métissé </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/wave.jpg' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Body Wave </strong></p>
              </div>
            </div>
          </div>
          {/* card3 bloc3 */}
          <div className='my-card' style={{ backgroundColor:'#FFFFFF'}}>
            <h4  className='mt-3 text-center'><strong>vêtements</strong></h4>  
            <div className='d-flex gap-3 p-4 justify-content-center'>
              <div>
                <img  src='http://localhost:5173/image/dim.webp'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Soutien Dim </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/puma.webp' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Puma </strong></p>
              </div>
            </div>

            <div className='d-flex gap-3 p-4 justify-content-center mt-0'>            
              <div>
                <img  src='http://localhost:5173/image/qixui.webp'style={{width: '100px', height: '80px'}} alt="..." /> 
                <p  className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Chemise Qixui </strong></p>
              </div>
              <div>
                <img src='http://localhost:5173/image/pull.webp' style={{width: '100px', height: '80px'}} alt="..."/>
                <p className='mt-2 text-center' style={{fontSize:'10px'}}> <strong> Pull Levis </strong></p>
              </div>
            </div>  
          </div>
        </div><br /> <br />
        
      </div> 

      {/* card super deals */}
      <div className='container   mt-5'ref={promotionsRef} style={{background:'rgba(232, 185, 161, 0.4)'}} > <br />
          <h3  style={{marginLeft:'20px'}}> <strong>Super Deals de la Semaine</strong></h3><br />
          {/* bloc1 */}
          <div className='d-flex ' style={{marginLeft:'20px'}}>
            {/*  card1 bloc1 */}
            <div className='container d-flex '>
                <div className='my-card d-flex gap-3' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }}>
                    <div>
                        <div  className='text-center' style={{background:'rgba(249, 139, 58, 0.9)', borderRadius: '12px 0px', height:'30px', width:'100px'}}> 
                          <h6 style={{color:'white'}}>Nouveau!!!</h6>
                        </div>
                        <div style={{marginLeft:'10px', maxWidth:'200px'}}>
                            <p>Samsung Galaxy A56 5G 
                            - 256 Go - 8GO RAM - 6.7 </p>
                            <span className='text-danger text-center' style={{fontSize:'15px', marginLeft:'50px'}}> <strong>255,000 FCFA </strong> </span>
                            <span className='text-black text-center' style={{fontSize:'15px', marginLeft:'50px', textDecoration:'underline'}}> <strong> 300,000 FCFA </strong> </span>
                        </div>
                    </div>
                    <div className='image-container2'>
                    <img  style={{width: '100px', height: '80px'}} alt="..." /> 
                    </div>
                </div>
            </div>
            {/* card2 bloc1 */}
            <div className='container d-flex '>
                <div className='my-card d-flex gap-3' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }}>
                    <div>
                        <div  className='text-center' style={{background:'#3488CA', borderRadius: '12px 0px', height:'30px', width:'100px'}}> 
                          <h6 style={{color:'white'}}>Super Deal !!</h6>
                        </div>
                        <div style={{marginLeft:'10px', maxWidth:'200px'}}>
                            <p>Magnifique Robe De Soirée avec un corsage </p>
                            <span className='text-danger text-center' style={{fontSize:'15px', marginLeft:'50px'}}> <strong>145,000 FCFA  </strong> </span>
                            <span className='text-black text-center' style={{fontSize:'15px', marginLeft:'50px', textDecoration:'underline'}}> <strong> 218,500-FCFA </strong> </span>
                        </div>
                    </div>
                    <div className='image-container3'>
                    <img  style={{width: '100px', height: '80px'}} alt="..." /> 
                    </div>
                </div>
            </div>

             {/* card3 bloc1 */}
             <div className='container d-flex '>
                <div className='my-card d-flex gap-3' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }}>
                    <div>
                        <div  className='text-center' style={{background:'#4C3A08', borderRadius: '12px 0px', height:'30px', width:'100px'}}> 
                          <h6 style={{color:'white'}}>Promotions !!</h6>
                        </div>
                        <div style={{marginLeft:'10px', maxWidth:'200px'}}>
                            <p>Perruques Vietnamien 2 Ton  </p>
                            <span className='text-danger text-center' style={{fontSize:'15px', marginLeft:'50px'}}> <strong>60,000 FCFA  </strong> </span>
                            <span className='text-black text-center' style={{fontSize:'15px', marginLeft:'50px', textDecoration:'underline'}}> <strong> 98000-FCFA </strong> </span>
                        </div>
                    </div>
                    <div className='image-container4'>
                    <img  style={{width: '100px', height: '80px'}} alt="..." /> 
                    </div>
                </div>
            </div>
          </div>
          {/* bloc2 */}
          
          <div className='d-flex mt-5 ' style={{marginLeft:'20px'}}>
            {/*  card1 bloc2 */}
            <div className='container d-flex '>
                <div className='my-card d-flex gap-3' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }}>
                    <div>
                        <div  className='text-center' style={{background:'#63A154', borderRadius: '12px 0px', height:'30px', width:'100px'}}> 
                          <h6 style={{color:'white'}}>Top Deals !!</h6>
                        </div>
                        <div style={{marginLeft:'10px', maxWidth:'200px'}}>
                            <p>Salle A Manger Tendances  06 Places</p>
                            <span className='text-danger text-center' style={{fontSize:'15px', marginLeft:'50px'}}> <strong>70,000 FCFA  </strong> </span>
                            <span className='text-black text-center' style={{fontSize:'15px', marginLeft:'50px', textDecoration:'underline'}}> <strong> 150,500-FCFA </strong> </span>
                        </div>
                    </div>
                    <div className='image-container5'>
                    <img  style={{width: '100px', height: '80px'}} alt="..." /> 
                    </div>
                </div>
            </div>
            {/* card2 bloc2 */}
            <div className='container d-flex '>
                <div className='my-card d-flex gap-3' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }}>
                    <div>
                        <div  className='text-center' style={{background:'#1230A7', borderRadius: '12px 0px', height:'30px', width:'100px'}}> 
                          <h6 style={{color:'white'}}>Offre Special !!</h6>
                        </div>
                        <div style={{marginLeft:'10px', maxWidth:'200px'}}>
                            <p>MacBook - 256 Go SSD - 16 GO RAM</p>
                            <span className='text-danger text-center' style={{fontSize:'15px', marginLeft:'50px'}}> <strong>190,000 FCFA   </strong> </span>
                            <span className='text-black text-center' style={{fontSize:'15px', marginLeft:'50px', textDecoration:'underline'}}> <strong> 300,500-FCFA </strong> </span>
                        </div>
                    </div>
                    <div className='image-container6'>
                    <img  style={{width: '100px', height: '80px'}} alt="..." /> 
                    </div>
                </div>
            </div>

             {/* card3 bloc2 */}
             <div className='container d-flex '>
                <div className='my-card d-flex gap-3' style={{marginLeft:'10px', backgroundColor:'#FFFFFF' }}>
                    <div>
                        <div  className='text-center' style={{background:'#A2A4AF', borderRadius: '12px 0px', height:'30px', width:'100px'}}> 
                          <h6 style={{color:'white'}}>Le Njoh!!</h6>
                        </div>
                        <div style={{marginLeft:'10px', maxWidth:'200px'}}>
                            <p>Réfrigateur 200watts </p>
                            <span className='text-danger text-center' style={{fontSize:'15px', marginLeft:'50px'}}> <strong>300,000 FCFA   </strong> </span>
                            <span className='text-black text-center' style={{fontSize:'15px', marginLeft:'50px', textDecoration:'underline'}}> <strong> 400,500-FCFA </strong> </span>
                        </div>
                    </div>
                    <div className='image-container7'>
                    <img  style={{width: '100px', height: '80px'}} alt="..." /> 
                    </div>
                </div>
            </div>
          </div> <br />
      </div>

     
      {/* high_tech produit */}
      <div className='container mt-5' >
        <div>
          <h2> <strong>Hight-tech empire</strong></h2>
        </div>
        <div className='d-flex gap-5 mt-4' style={{marginLeft:'20px'}}>
          {/* produit1 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/phone2.jpg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Samsung Galaxy A56 5G - 256 Go </p>
            <p  style={{marginLeft:'10px'}}><strong>By Hight-tech empire</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A',}}><strong>255,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px', }}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>30 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit2 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/ordi2.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>MacBook - 256 Go SSD - 16 GO RAM  </p>
            <p  style={{marginLeft:'15px'}}><strong>By Hight-tech empire</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>190,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>20 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit3 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/imprimante1.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Imprimante Dernière Génération </p><br />
            <p  style={{marginLeft:'15px'}}><strong>By Hight-tech empire</strong></p>
            <div className='d-flex gap-4'  style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>79,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>10 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
           {/* produit4 */}
           <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/tablette1.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>HAWUE MediaPad T5Wi-Fi Tablette  </p>
            <p  style={{marginLeft:'15px'}}><strong>By Hight-tech empire</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>60,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>10 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>


        </div>

      </div>
       {/*Beauty Corporate */}
      <div className='container mt-5' >
        <div>
          <h2> <strong>Beauty corporate</strong></h2>
        </div>
        <div className='d-flex gap-5 mt-4' style={{marginLeft:'20px'}}>
          {/* produit1 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/perruques_metisse1.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Pérruque Métissé  Taille 18</p>
            <p  style={{marginLeft:'15px'}}><strong>By Beauty corporate</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>50,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
               <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>40 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit2 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/perruque_vietnamienne.webp" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'> Vietnamienne taille 12 </p>
            <p  style={{marginLeft:'15px'}}><strong>By Beauty corporate</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>45,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>10 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit3 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/bob1.jpg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Pérruque Bob taille 12</p>
            <p  style={{marginLeft:'15px'}}><strong>By Beauty corporate</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>20,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>50 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
           {/* produit4 */}
           <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/curly.jpg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Perruque Pixie curly </p>
            <p  style={{marginLeft:'15px'}}><strong>By Beauty corporate</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>12,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>35 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>


        </div>

      </div>
             {/*Dress Well */}
      <div className='container mt-5' >
        <div>
          <h2> <strong>Dress Well</strong></h2>
        </div>
        <div className='d-flex gap-5 mt-4' style={{marginLeft:'20px'}}>
          {/* produit1 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/jeans.jpg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Pantalon jeans soft</p>
            <p  style={{marginLeft:'15px'}}><strong>By Dress well</strong></p>
            <div className='d-flex gap-2'>
              <p style={{color: '#F98B3A', marginLeft:'15px'}}><strong>2,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px', marginLeft:'55px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>20 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit2 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/Pull1.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'> Pull-Over Blanc </p>
            <p  style={{marginLeft:'15px'}}><strong>By Dress well</strong></p>
            <div className='d-flex gap-2'>
              <p style={{color: '#F98B3A', marginLeft:'15px'}}><strong>4,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px', marginLeft:'55px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>50 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit3 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/jupe2.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Chic Jupe en Soie</p>
            <p  style={{marginLeft:'15px'}}><strong>By Dress well</strong></p>
            <div className='d-flex gap-2'>
              <p style={{color: '#F98B3A', marginLeft:'15px'}}><strong>3,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px', marginLeft:'55px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>10 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
           {/* produit4 */}
           <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/chic_robe2.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Chic Robe de soirée </p>
            <p  style={{marginLeft:'15px'}}><strong>By Dress well</strong></p>
            <div className='d-flex gap-4 ' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>10,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>40 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>


        </div>

      </div>

      {/*All-shop */}
     <div className='container mt-5' >
        <div>
          <h2> <strong>Dress Well</strong></h2>
        </div>
        <div className='d-flex gap-5 mt-4' style={{marginLeft:'20px'}}>
          {/* produit1 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/fer2.jpg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Puissant Lisseur </p>
            <p  style={{marginLeft:'15px'}}><strong>By All-shop</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>7,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>25 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit2 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/sofa1.jpg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'> Canapé confortable  </p>
            <p  style={{marginLeft:'15px'}}><strong>By All-shop</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>20,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>35 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
          {/* produit3 */}
          <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/fruit1.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Panier de fruit tropicaux</p>
            <p  style={{marginLeft:'15px'}}><strong>By All-shop</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>8,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>28 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>
           {/* produit4 */}
           <div className='card' style={{width: "272.32px", borderTopLeftRadius:'8px', borderTopRightRadius:'8px', borderBottomLeftRadius:'0px', borderBottomRightRadius:'0px'}}>
            <img 
              src="http://localhost:5173/image/salle_manger.jpeg" 
              alt="Beauty Corporate" 
              className="card-img-top img-fluid rounded-3"
              style={{
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxSizing: "border-box",
                
              }}
            />
            <p className='text-center mt-2'>Salle a Mangé Moderne </p>
            <p  style={{marginLeft:'15px'}}><strong>By All-shop</strong></p>
            <div className='d-flex gap-4' style={{marginLeft:'15px',  marginRight:'5px'}}>
              <p style={{color: '#F98B3A'}}><strong>80,000 FCFA</strong></p>
              <button style={{backgroundColor: '#F98B3A', height: '25px' , border: 'none', borderRadius: '5px', fontSize: '12px'}}>
                <a href="/panier" style={{color: 'white', textDecoration: 'none'}}>
                 <i className='bi bi-cart-fill' style={{ fontSize: '12px' }}></i>
                   <strong> Ajouter </strong> 
               </a>
              </button>
             
            </div>
            {/* <p className='d-flex gap-2' style={{marginLeft:'15px'}}>
                <FaCheck  className='mt-1' style={{color: '#F98B3A'}}/>
                <strong> 
                  <span style={{color: '#F98B3A'}}> 
                    En stock 
                  </span>
                  <span style={{marginLeft:'10px'}}>26 </span>
                  <span style={{color: '#666B71'}}> produits</span>
                  
                </strong>
              </p> */}
          </div>


        </div>

      </div> <br /><br />
      <Footer />
    </div>
  )
}

export default Home;
