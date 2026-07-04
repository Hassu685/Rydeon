import React from 'react';
import Hero from '../../../components/hero';
import Center from '../../../components/center';
import WhyChooseUs from '../../../components/whychoose-us';


export const metadata = {
  title: "fair services",
};

const page = () => {
    return (
        <>
          <Hero/>
          <Center/>
          <WhyChooseUs/>
        </>
    );
}


export default page;