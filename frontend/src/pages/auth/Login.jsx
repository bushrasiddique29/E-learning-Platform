import  { useState } from 'react'
import "./auth.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import { CourseData } from '../../context/CourseContext';

const Login = () => {
  const navigate = useNavigate();
  const {loginUser,btnLoading} = UserData();
  const {fetchMyCourse} = CourseData();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState('');

  const submitHandler = async(e)=>{
    e.preventDefault();
    await loginUser(email,password,navigate,fetchMyCourse);
  }

  return (
    <>
    <div className="auth-page">
      <div className="auth-form">
        <h2>Login Form</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor='email'>Email:</label>
          <input type="email" required value={email} onChange={(e)=>{setEmail(e.target.value)}}/>

          <label htmlFor='password'>Password:</label>
          <input type="password" required value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
          
          <button disabled={btnLoading} type='submit' className='common-btn'>
           {btnLoading ? "Please Wait...":"Login"}</button>
        </form>
        <p>Don't Have an account ? <Link to='/register' className='text-decoration-none'>Register</Link></p>
        <p><Link to="/forgot">Forgot Password?</Link></p>
      </div>
    </div>
    </>
  )
}

export default Login