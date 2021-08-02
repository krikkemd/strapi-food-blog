import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_RESTAURANT_DISHES } from '../../graphql/restaurants';

import { Button, Card, CardTitle, CardText, CardImg, Col, Row, CardBody } from 'reactstrap';

export default function restaurants() {
  const {
    query: { id },
  } = useRouter();

  const { error, loading, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id },
    onError(error) {
      console.log(error.graphQLErrors);
    },
  });

  if (error) return <h2>Error fetching dishes: {error.graphQLErrors[0].message}</h2>;
  if (loading) return <h1>Fetching dishes..</h1>;

  if (data.restaurant) {
    const { restaurant } = data;
    return (
      <>
        <h1>{restaurant.name}</h1>
        <Row>
          {restaurant.dishes.map(dish => (
            <Col xs='6' sm='4' key={dish.id}>
              <Card style={{ margin: '0 0.5rem 20px 0.5rem' }}>
                {/* Image */}
                <CardImg
                  top={true}
                  style={{ height: 250 }}
                  src={`${process.env.NEXT_PUBLIC_API_URL}${dish.image.url}`}
                  alt='Dish Picture'
                />

                <CardBody>
                  {/* Name  */}
                  <CardTitle>{dish.name}</CardTitle>

                  {/* Description */}
                  <CardText style={{ height: 100 }}>{dish.description}</CardText>
                </CardBody>

                {/* Button */}
                <Button color='primary'>+ Add to Card</Button>

                <style jsx>
                  {`
                    a {
                      color: white;
                    }
                    a:link {
                      text-decoration: none;
                      color: white;
                    }
                    .container-fluid {
                      margin-bottom: 30px;
                    }
                    .btn-outline-primary {
                      color: #007bff !important;
                    }
                    a:hover {
                      color: white !important;
                    }
                  `}
                </style>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  }
  return <h1>Add Dishes</h1>;
}
