import React, { createContext, useEffect, useReducer, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '../graphql/users';
import { LOGIN_USER, LOGOUT_USER } from './types';

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

  // Fetch http://localhost:1337/users/me
  // const { error, loading, data } = useQuery(ME, {
  //   onCompleted(data) {
  //     console.log(data);
  //     contextLogin(data.me);
  //   },
  //   onError(error) {
  //     dispatch({ type: LOGOUT_USER });
  //     console.log(error);
  //     console.log(error.graphQLErrors);
  //   },
  // });

  const contextLogin = userData => {
    console.log(userData);
    dispatch({ type: LOGIN_USER, payload: userData });
  };

  const contextLogout = () => dispatch({ type: LOGOUT_USER });

  // if (loading) return <h1>loading...</h1>;

  return (
    <AuthContext.Provider
      value={{ user: state.user, isAuthenticated: !!state.user, contextLogin, contextLogout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
