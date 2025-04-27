import MainLayout from "./layout/MainLayout";
import { Card, CardContent } from "./ui/Card";
import { InfoIcon, UserIcon, ShieldIcon } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 text-ytoy-black mb-4">À propos de YTOY Marketplace</h1>
            <p className="lead text-muted">
              Votre destination de confiance pour l'achat et la vente de produits de qualité
            </p>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <p className="mb-4">
                  YTOY Marketplace est une plateforme innovante qui connecte acheteurs et vendeurs
                  dans un environnement sécurisé et convivial. Notre mission est de faciliter
                  les échanges commerciaux en ligne tout en garantissant une expérience
                  utilisateur optimale.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <Card className="h-100 border-0 shadow-sm hover:border-ytoy-orange transition-all">
              <CardContent className="p-4 text-center">
                <div className="rounded-full bg-ytoy-orange/10 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <InfoIcon className="h-8 w-8 text-ytoy-orange" />
                </div>
                <h3 className="h5 mb-3">Notre Vision</h3>
                <p className="text-muted">
                  Devenir la référence des marketplaces en ligne en offrant une expérience
                  d'achat et de vente incomparable.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="col-12 col-md-4">
            <Card className="h-100 border-0 shadow-sm hover:border-ytoy-orange transition-all">
              <CardContent className="p-4 text-center">
                <div className="rounded-full bg-ytoy-orange/10 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-ytoy-orange" />
                </div>
                <h3 className="h5 mb-3">Notre Communauté</h3>
                <p className="text-muted">
                  Une communauté dynamique d'acheteurs et de vendeurs partageant
                  les mêmes valeurs de qualité et de confiance.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="col-12 col-md-4">
            <Card className="h-100 border-0 shadow-sm hover:border-ytoy-orange transition-all">
              <CardContent className="p-4 text-center">
                <div className="rounded-full bg-ytoy-orange/10 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShieldIcon className="h-8 w-8 text-ytoy-orange" />
                </div>
                <h3 className="h5 mb-3">Nos Engagements</h3>
                <p className="text-muted">
                  Sécurité des transactions, protection des données et satisfaction
                  client sont au cœur de nos priorités.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Card className="border-0 bg-ytoy-black text-white">
              <CardContent className="p-4">
                <h3 className="h4 mb-4">Rejoignez-nous</h3>
                <p className="mb-4">
                  Que vous soyez acheteur ou vendeur, YTOY Marketplace vous offre une
                  expérience unique et personnalisée. Rejoignez notre communauté grandissante
                  et profitez de tous les avantages de notre plateforme.
                </p>
                <div className="text-center">
                  <a href="/inscription" className="btn btn-lg text-white" style={{ backgroundColor: '#FF6600' }}>
                    Créer un compte
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;