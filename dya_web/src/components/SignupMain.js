import React from 'react';
import Header from './Header';
import SignupAccType from './SignupAccType';
import Footer from './Footer';

export default function SignupMain(props) {
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