import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_RESTAURANTS } from '../../graphql/restaurants';

import { Card, CardBody, CardImg, CardText, CardTitle, Row, Col } from 'reactstrap';

export default function RestaurantList(props) {
  const { error, loading, data } = useQuery(GET_ALL_RESTAURANTS);

  if (data) console.log(data);

  return <div>restaurants</div>;
}
