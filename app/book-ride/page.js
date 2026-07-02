import React from 'react';
import Navbar from '../../components/navbar';
import BookRidePage from '../../components/book-ride';
import Footer from '../../components/footer';

const page = () => {
    return (
        <>
            <Navbar />
            <BookRidePage />
            <Footer />
        </>
    );
}

export default page;