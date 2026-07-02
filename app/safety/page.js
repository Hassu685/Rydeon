import React from 'react';
import Section from '../../components/section';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import SafetySection from '../../components/safetysection';
import HowSafetyWorks from '../../components/safetyworks';

export const metadata = {
  title: "Safety",
};

const page = () => {
    return (
        <>
        <Navbar/>
        <Section/>
        <HowSafetyWorks/>
        <SafetySection/>
        <Footer/>
        </>
    );
}


export default page;