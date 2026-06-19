import { useState } from 'react'
import "./auth.css";
import { Link, useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';


const Register = () => {

  const navigate = useNavigate();
  const {registerUser,btnLoading} = UserData();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');

  const submitHandler = async(e)=>{
    e.preventDefault();
    await registerUser(name,email,password,navigate);
  }
  return (
     <>
    <div className="auth-page">
      <div className="auth-form">
        <h2>Register </h2>
        <form onSubmit={submitHandler}>
          <label htmlFor='name'>Name:</label>
          <input type="text" required value={name} onChange={(e)=>{setName(e.target.value)}}/>

          <label htmlFor='email'>Email:</label>
          <input type="email" required value={email} onChange={(e)=>{setEmail(e.target.value)}}/>

          <label htmlFor='password'>Password:</label>
          <input type="password" required value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
          <button type='submit' disabled={btnLoading} className='common-btn'>{btnLoading? "Please Wait...":"Register"}</button>
        </form>
        <p>Already Have an account ? <Link to='/login' className='text-decoration-none'>Login</Link></p>
      </div>
    </div>
    </>
  )
}

export default Register