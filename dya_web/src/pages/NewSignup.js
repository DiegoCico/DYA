import React from 'react';
import SignupMain from '../components/SignupMain';

export default function NewSignup(props) {
    const { handleRouteChange } = props

    return (
        <>
            <SignupMain handleRouteChange={handleRouteChange}/>
        </>
    )
}