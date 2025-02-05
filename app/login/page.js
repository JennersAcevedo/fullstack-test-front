"use client";
import styles from "@/styles/login.module.css";
import Navbar from "@/components/loginNavbar/loginNavbar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  useEffect(() => {
    deleteCookie("authToken");
  }, [router]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendLoginInfo = async (user, password) => {
    // if phone has data means the data was filled by a bot because phone is outside of the screen
    if (form['phone']==="") {
      let url = `http://localhost:4000/auth/login/${user}/${password}`;
      const loginResponse = await axios.get(url, {
        withCredentials: true,
      });
      return loginResponse;
    }
  };

  const handleSubmit = async (e) => {
    if (form["phone"] === "") {
      let login = await sendLoginInfo(form.username, form.password);
      if (login && login.data.success) {
        if (login.data.data.role === "customer") {
          router.push("/");
        }
        if (login.data.data.role === "admin") {
          router.push("/admin");
        }
        alert('user logged!!')
      }
      e.preventDefault();
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.logincontainer}>
          <div className={styles.loginwelcome}>
            <h1>Welcome Back!</h1>
          </div>
          <div className={styles.loginform}>
            <h2>Login</h2>
            <p>Welcome back! Please login to your account.</p>
            <form>
              <label htmlFor="username">User Name</label>
              <input
                type="email"
                id="username"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <div style={{  position: 'absolute', left: "-9999px"  }}>
                <label htmlFor="phone">Phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <label htmlFor="password">Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.passwordInput}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.toggleButton}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                className={styles.loginbutton}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
