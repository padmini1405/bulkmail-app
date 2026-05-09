import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../Asserts/Images/background_img.jpg";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("All fields are required");
            return;
        }

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/login`,
                {
                    email,
                    password,
                }
            );

            if (res.data.success) {
                navigate("/bulkmail");
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            console.log(err);
            setError("Server Error");
        }
    };
    return (
        <div className="hero-container">
            <div className="logo-section1">
                <h1 className="logo-text1">
                    SpreadLink
                </h1>
                <p className="tagline1">
                    Enterprise-grade precision for your bulk communication.
                </p>
            </div>
            <div className="login-wrapper">
                <div className="login-card">
                    <h1 className="login-title">
                        Login
                    </h1>
                    <p className="login-subtitle">
                        Welcome back! Please enter your details.
                    </p>
                    <form className="login-form" onSubmit={handleSubmit}>
                        {error && (
                            <p className="error">
                                {error}
                            </p>
                        )}
                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="test@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="password-header">
                            <label>Password</label>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">
                            Sign In
                        </button>
                        <div className="divider">
                            <div className="line"></div>
                            <span>
                                OR
                            </span>
                            <div className="line"></div>
                        </div>
                        <h4 className="sign-up-link">
                            Don't have an account?
                            <Link to="/signup">
                                <span>Sign up</span>
                            </Link>
                        </h4>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Login;