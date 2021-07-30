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

export const GET_RESTAURANT_DISHES = gql`
  query GetRestaurantDishes($id: ID!) {
    restaurant(id: $id) {
      id
      name
      dishes {
        id
        name
        description
        price
        image {
          url
        }
      }
    }
  }
`;
