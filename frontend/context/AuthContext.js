import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/users';
import { LOGIN_USER, LOGOUT_USER } from './types';
import { setAccessTokenInMemory } from '../util/accessToken';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null,
  isAuthenticated: false,
  contextLogin: userData => {},
  contextLogout: () => {},
};

const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = useState(true);
  const [loadOnLogin, setLoadOnLogin] = useState(false);

  const refreshToken = appShouldLoad => {
    setLoadOnLogin(appShouldLoad);
    fetch('http://localhost:1337/auth/refreshToken', {
      method: 'POST',
      credentials: 'include',
    })
      .then(async res => {
        // we receive the accessToken inside this data, if the refreshtoken was valid
        // no need to check more
        const data = await res.json();
        console.log(data);

        if (data.accessToken) {
          // store the access token in memory, so it can be added to the headers. This is async, so we are loading before this is complete
          setAccessTokenInMemory(data.accessToken);

          // decode the accessToken which contains userdata
          const user = jwtDecode(data.accessToken);
          console.log(user);

          // silently refresh the accessToken just before it expires using the post request with the refresh token
          setTimeout(() => {
            console.log('timer running');
            refreshToken();
          }, 29000); // accessToken expires in 30s

          // add the userdata to the context from the decoded accessToken
          contextLogin(user);
        }

        // accessToken is set to memory, and user is set to context at this point. we can stop loading, and render our app
        setLoading(false);
        setLoadOnLogin(false);
      })
      .catch(e => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const contextLogin = userData => {
    console.log(userData);
    dispatch({ type: LOGIN_USER, payload: userData });
  };

  const contextLogout = () => {
    setAccessTokenInMemory('');
    dispatch({ type: LOGOUT_USER });
  };

  if (loading || loadOnLogin) return <h1>loading...</h1>;

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: !!state.user,
        contextLogin,
        contextLogout,
        refreshToken,
      }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
