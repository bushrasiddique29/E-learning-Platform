import { useNavigate } from 'react-router-dom'
import "./home.css";
import Testimonial from '../../components/testimonials/Testimonial';

const Home = () => {

  const navigate = useNavigate();

  return (
    <>
    <div className="home">
      <div className="home-content">
        <h1>Welcome to our E-Learning Platform</h1>
        <p>Learn, Grow, Excel</p>
        <button className='common-btn' onClick={()=> navigate("/courses")}>Get Started</button>
      </div>
    </div>
    <Testimonial/>
    </>
  )
}

export default Home;