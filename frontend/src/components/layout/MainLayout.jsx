import React from 'react';
import Header from './Header'; // Assurez-vous d'avoir un composant Header
import Footer from './Footer'; // Assurez-vous d'avoir un composant Footer

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;