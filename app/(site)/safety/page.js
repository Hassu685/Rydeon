import React from 'react';
import Section from '../../../components/section';
import SafetySection from '../../../components/safetysection';
import HowSafetyWorks from '../../../components/safetyworks';

export const metadata = {
  title: "Safety",
};

const page = () => {
    return (
        <>
        <Section/>
        <HowSafetyWorks/>
        <SafetySection/>
        </>
    );
}


export default page;