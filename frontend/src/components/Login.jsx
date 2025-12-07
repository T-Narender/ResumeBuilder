import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import { useUser } from "../context/UserContext";
import { authStyles as styles } from "../assets/dummystyle";
import { validateEmail } from "../utils/helper";
import { Input } from "./Inputs";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;
      if (token) {
        login(user, token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>
          Sign in to continue building amazing resumes
        </p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          type="email"
          label="Email"
          placeholder="example@gmail.com"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Password"
          type="password"
        />
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
          {/* this tells whether the login is in progress or not */}
        </button>
        <p className={styles.switchText}>
          Don't have an account?{" "}
          <button
            onClick={() => {
              if (typeof setCurrentPage === "function") {
                setCurrentPage("signup");
              } else {
                navigate("/signup");
              }
            }}
            className={styles.switchButton}
            type="button"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
