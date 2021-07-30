import { gql } from '@apollo/client';

export const GET_ALL_RESTAURANTS = gql`
  query getAllRestaurants {
    restaurants {
      id
      name
      description
      image {
        url
      }
    }
  }
`;
