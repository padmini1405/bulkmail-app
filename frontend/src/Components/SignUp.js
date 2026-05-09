import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    async function handleSignup(e) {

        e.preventDefault();
        setFormError("");
        setEmailError("");
        setPasswordError("");

        // Validation
        if (!email.trim() || !password.trim()) {
            setFormError("Please fill all fields");
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // email empty
        if (!email) {
            setEmailError("Email is required");
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailError("Enter valid email address");
            return;
        }

        // Password length validation
        // password empty
        if (!password) {
            setPasswordError("Password is required");
            return;
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

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
                        {formError && (
                            <p className="form-error">{formError}</p>
                        )}
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && (
                            <p className="field-error">{emailError}</p>
                        )}
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
                        {passwordError && (
                            <p className="field-error">{passwordError}</p>
                        )}
                    </div>
                    <button type="submit" className="signup-btn">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignUp;