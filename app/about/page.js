import React from 'react';
import AboutPage from '../../components/about';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export const metadata = {
  title: "About",
};

const page = () => {
    return (
        <>
            <Navbar />
            <AboutPage />
            <Footer />
        </>
    );
}


export default page;