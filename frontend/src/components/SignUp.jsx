import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStyles as styles } from "../assets/dummystyle";
import { useUser } from "../context/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { validateEmail } from "../utils/helper";
import { Input } from "./Inputs";

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
      });

      const { token, user } = response.data;
      if (token) {
        login(user, token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.signupTitle}>Create Account</h3>
        <p className={styles.signupSubtitle}>
          Join thousands of professionals today
        </p>
      </div>
      <p></p>

      <form onSubmit={handleSignup} className={styles.signupForm}>
        <Input
          value={fullName}
          onChange={({ target }) => setFullName(target.value)}
          label="Full Name"
          placeholder="Enter your full name"
          type="text"
        />
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="Enter your email"
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 6 characters"
          type="password"
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button
          type="submit"
          className={styles.signupSubmit}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className={styles.switchText}>Already have an account?</p>
        <button
          onClick={() => {
            if (typeof setCurrentPage === "function") {
              setCurrentPage("login");
            } else {
              navigate("/login");
            }
          }}
          type="button"
          className={styles.signupSwitchButton}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignUp;
