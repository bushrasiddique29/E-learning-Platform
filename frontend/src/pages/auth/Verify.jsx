import { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import ReCAPTCHA from "react-google-recaptcha";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const { btnLoading, verifyOtp } = UserData();
  const [show,setShow] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyOtp(Number(otp), navigate);
  };

  function onChange(value) {
    console.log("Captcha value:", value);
    setShow(true);
  }
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Login Form</h2>
        <form onSubmit={submitHandler}>
          <label htmlFor="otp">OTP</label>
          <input
            type="Number"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            required
          />
          <ReCAPTCHA sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" onChange={onChange} />
           ,
          {show && (
            <button disabled={btnLoading} type="submit" className="common-btn">
              {btnLoading ? "Please Wait..." : "Verify"}
            </button>
          )}
          
        </form>
        <p>
          Go to{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
          Page
        </p>
      </div>
    </div>
  );
};

export default Verify;
