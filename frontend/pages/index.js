import { Button } from 'reactstrap';
import RestaurantList from '../components/RestaurantList';

export default function Home() {
  return (
    <div>
      <div>
        &nbsp; <Button color='primary'>Hello from nextjs</Button>
        <RestaurantList />
      </div>
    </div>
  );
}
