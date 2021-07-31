import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_RESTAURANTS } from '../../graphql/restaurants';
import Link from 'next/link';

import { Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from 'reactstrap';

export default function RestaurantList(props) {
  const { error, loading, data } = useQuery(GET_ALL_RESTAURANTS);

  if (error) {
    console.log(error);
    return 'Error loading restaurants';
  }
  // if restaurants are returned from the GraphQL query, run the filter query
  // and set equal to variable restaurantSearch

  if (loading) return <h1>Fetching Restaurants</h1>;

  if (data.restaurants && data.restaurants.length) {
    // searchQuery
    const searchQuery = data.restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(props.search),
    );

    if (searchQuery.length != 0) {
      return (
        <Row>
          {searchQuery.map(res => (
            <Col xs='6' sm='4' key={res.id}>
              <Card style={{ margin: '0 0.5rem 20px 0.5rem' }}>
                <CardImg
                  top={true}
                  style={{ height: 250 }}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${res.image[0].url}`}
                />
                <CardBody>
                  <CardTitle>{res.name}</CardTitle>
                  <CardText>{res.description.substring(0, 250) + '...'}</CardText>
                </CardBody>
                <div className='card-footer'>
                  <Link as={`restaurants/${res.id}`} href={`restaurants/${res.id}`}>
                    <a className='btn btn-primary'>View</a>
                  </Link>
                </div>
              </Card>
            </Col>
          ))}

          <style jsx global>
            {`
              a {
                color: white;
              }
              a:link {
                text-decoration: none;
                color: white;
              }
              a:hover {
                color: white;
              }
              .card-columns {
                column-count: 3;
              }
            `}
          </style>
        </Row>
      );
    } else {
      return <h1>No Restaurants found</h1>;
    }
  }

  return <h5>Add Restaurants</h5>;
}
