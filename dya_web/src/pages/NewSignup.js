import React from 'react';
import Header from '../components/Header.js'
import SignupAccType from '../components/SignupAccType.js';
import Footer from '../components/Footer.js';

export default function NewSignup(props) {
    const { handleRouteChange } = props

    return (
        <>
            <Header />
            {/* <h1>New sign up page</h1> */}
            <SignupAccType handleRouteChange={handleRouteChange} />
            <Footer />
        </>
    )
}