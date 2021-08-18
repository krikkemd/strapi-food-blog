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
  //   const [loading, setLoading] = useState(true);

  //   const fetchMe = () => {
  //     console.log('running fetchMe');
  //     fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
  //       credentials: 'include',
  //     })
  //       .then(async res => {
  //         if (!res.ok) {
  //           dispatch({ type: LOGOUT_USER });
  //           setLoading(false);
  //           return null;
  //         }

  //         const data = await res.json();
  //         console.log(data);
  //         setLoading(false);
  //       })
  //       .catch(error => {
  //         console.log(error);
  //         setLoading(false);
  //       });
  //   };

  //   useEffect(() => {
  //     fetchMe();
  //   }, []);

  const { error, loading, data } = useQuery(ME, {
    onCompleted(data) {
      console.log(data);
    },
    onError(error) {
      dispatch({ type: LOGOUT_USER });
      console.log(error);
      console.log(error.graphQLErrors);
    },
  });

  const contextLogin = userData => {
    console.log(userData);
    dispatch({ type: LOGIN_USER, payload: userData });
  };

  const contextLogout = () => dispatch({ type: LOGOUT_USER });

  if (loading) return <h1>loading...</h1>;

  return (
    <AuthContext.Provider
      value={{ user: state.user, isAuthenticated: !!state.user, contextLogin, contextLogout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
