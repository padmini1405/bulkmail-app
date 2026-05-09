import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/signup`,
                {
                    email,
                    password,
                }
            );
            if (res.data.success) {
                alert("Signup Successful");
                navigate("/");
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Signup Failed");
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="logo-section">
                    <h1 className="logo-text">
                        SpreadLink
                    </h1>
                    <p className="tagline">
                        Enterprise-grade precision for your bulk communication.
                    </p>
                </div>
                <form className="signup-form" onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <div className="password-top">
                            <label>Password</label>
                        </div>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="signup-btn">
                        Sign Up
                    </button>
                    {/* <div className="divider">
                        <span>OR</span>
                    </div>  */}
                </form>
                {/* <p className="bottom-text">
                    Already have an account?
                    <span> Sign In</span>
                </p> */}
            </div>
            <footer className="footer">
                <div className="footer-left">
                    <h3>SpreadLink</h3>
                    <p>© 2024 SpreadLink Enterprise Solutions. All rights reserved.</p>
                </div>
                <div className="footer-right">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">API Documentation</a>
                    <a href="#">System Status</a>
                </div>
            </footer>
        </div>
    )
}

export default SignUp;