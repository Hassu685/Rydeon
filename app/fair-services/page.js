import React from 'react';
import Navbar from '../../components/navbar';
import Hero from '../../components/hero';
import Center from '../../components/center';
import WhyChooseUs from '../../components/whychoose-us';
import Footer from '../../components/footer';

export const metadata = {
  title: "fair services",
};

const page = () => {
    return (
        <>
          <Navbar/>
          <Hero/>
          <Center/>
          <WhyChooseUs/>
          <Footer/>
        </>
    );
}


export default page;