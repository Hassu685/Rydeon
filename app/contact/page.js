import React from 'react';
import ContactPage from '../../components/contact';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

export const metadata = {
  title: "Contact",
};

const page = () => {
    return (
        <>
        <Navbar/>
        <ContactPage/>
        <Footer/>
        </>
    );
}

export default page;