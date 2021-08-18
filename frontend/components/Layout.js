import React, { useContext } from 'react';

// Context
import { AuthContext } from '../context/AuthContext';

// Next
import Head from 'next/head';
import Link from 'next/link';

// React Strap
import { Container, Nav, NavItem } from 'reactstrap';
import { useMutation } from '@apollo/client';
import { LOGOUT } from '../graphql/users';

export default function Layout(props) {
  const title = 'Welcome to Nextjs';
  const { contextLogout, user } = useContext(AuthContext);

  const [logout] = useMutation(LOGOUT, {
    onCompleted: data => {
      console.log(data);
      contextLogout();
    },
    onError: error => console.log(error),
  });

  const handleLogout = e => {
    e.preventDefault();
    logout();
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <link
          rel='stylesheet'
          href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
          integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm'
          crossOrigin='anonymous'
        />
        <script src='https://js.stripe.com/v3' />
      </Head>
      <header>
        <style jsx>
          {`
            a {
              color: white;
            }
          `}
        </style>
        <Nav className='navbar navbar-dark bg-dark'>
          <NavItem>
            <Link href='/'>
              <a className='navbar-brand'>Home</a>
            </Link>
          </NavItem>

          <NavItem className='ml-auto'>
            {user ? (
              <Link href='/'>
                <a className='nav-link'>{user.username}</a>
              </Link>
            ) : (
              <Link href='/login'>
                <a className='nav-link'>Login</a>
              </Link>
            )}
          </NavItem>

          <NavItem>
            {user ? (
              <Link href='/'>
                <a className='nav-link' onClick={handleLogout}>
                  Logout
                </a>
              </Link>
            ) : (
              <Link href='/register'>
                <a className='nav-link'>Sign Up</a>
              </Link>
            )}
          </NavItem>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
}
