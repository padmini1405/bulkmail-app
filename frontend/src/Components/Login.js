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
        <div
            className="hero-container"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="navbar">
                <h1 className="logo">SPREADLINK</h1>
            </div>

            <div className="hero-content">
                <h1 className="main-heading">
                    Can Send Unlimited Mails
                </h1>

                <h3 className="sub-heading">
                    Corparate Internal Communication | Educational Institution | Community Groups
                </h3>


                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />


                    <button type="submit">Sign In</button>

                    <h4 className="sign-up-link">
                        Do you have an account ? <Link to="/signup"> Signup </Link>
                    </h4>
                </form>
            </div>
        </div>
    );
}
export default Login;