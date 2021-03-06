import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation RegisterMutation($registerInput: UsersPermissionsRegisterInput!) {
    register(input: $registerInput) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGIN = gql`
  mutation LoginUser($loginInput: UsersPermissionsLoginInput!) {
    login(input: $loginInput) {
      jwt
      user {
        id
        username
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation LogoutUser {
    logout {
      authorized
      message
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`;
