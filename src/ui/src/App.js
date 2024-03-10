import React, { Suspense, useEffect } from 'react'

// ** Router Import
import Router from './router/Router'
import { useDispatch, useSelector } from "react-redux";
import {tokenIsExpired} from "@utils";
import {handleLogout, refreshTokens} from "@store/authentication";
import toast from "react-hot-toast";


const App = () => {
    const { accessToken, refreshToken, userData } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        const interval = setInterval(() => {
            if (userData.id) {
                // Execute your task here
                // check if refresh token is expired
                if (tokenIsExpired(refreshToken.createdAt, refreshToken.expiresIn)) {
                    dispatch(handleLogout())
                    toast.error("Your Session has expired, we are logging you out", {
                        position: "top-center"
                    });
                    setTimeout(()=>{
                        window.location.reload();
                    }, 4000) // delay a bit
                }
                // then the accessToken
                if (tokenIsExpired(accessToken.createdAt, accessToken.expiresIn)) {
                    // if expired call refresh token
                    dispatch(refreshTokens());
                }
            }

        }, 200000); // refresh every 3 mins
        return () => clearInterval(interval); // Cleanup function to clear interval when component unmounts

    }, [userData, accessToken, refreshToken]);
  return (
    <Suspense fallback={null} className="root">
      <Router />
    </Suspense>
  )
}

export default App
