"use client";
import styles from "@/styles/admin.module.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AdminNavbar from "@/components/adminNavbar/adminNavbar";
import { useRouter } from "next/navigation";


export default function Admin() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    username: "",
    password: "",
    validate: "",
    phone:""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleValidationVisibility = () => {
    setShowValidation(!showValidation);
  };
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };
const router = useRouter();
useEffect(() => {
 async function tokenValidation() {
   let token = getCookie("authToken");
       if (!token) {
         router.push("/login");
       }
 }
 tokenValidation();
}, []);
  const sendLoginInfo = async (
    password,
    validate,
    name,
    email,
    role
  ) => {
    if (password === validate) {
      let token = getCookie("authToken");
      let url = `http://localhost:4000/admin/add/user`;
      let body = {
        name: name,
        email: email,
        password: password,
        role:role,
      };
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const creationResponse = await axios.post(url, body, config);
      if (creationResponse.data.success) {
        alert('user created')
      }
    } else {
      alert("Password doesn't match");
      setForm({
        name: "",
        email: "",
        role: "",
        username: "",
        password: "",
        validate: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
       // if phone has data means the data was filled by a bot because phone is outside of the screen
    if (form.phone === "") {
     await sendLoginInfo(
        form.username,
        form.password,
        form.validate,
        form.name,
        form.email,
        form.role
      );
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className={styles.body}>
        <div className={styles.logincontainer}>
          <div className={styles.loginwelcome}>
            <h1>Create a New user!</h1>
          </div>
          <div className={styles.loginform}>
            <h2>Create a new user</h2>
            <p>Please fill the fields.</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
              <div style={{  position: 'absolute', left: "-9999px"  }}>
                <label htmlFor="phone">phone:</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email"
                value={form.email}
                onChange={handleChange}
                className={styles.input}
              />
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                placeholder="role"
                value={form.role}
                onChange={handleChange}
                required
                className={styles.input}
              />
             

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

              <label htmlFor="validation">Confirm password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showValidation ? "text" : "password"}
                  id="validation"
                  name="validate" 
                  placeholder="Confirm password"
                  value={form.validate}
                  onChange={handleChange}
                  required
                  className={`${styles.input} ${styles.passwordInput}`}
                />
                <button
                  type="button"
                  onClick={toggleValidationVisibility}
                  className={styles.toggleButton}
                >
                  <FontAwesomeIcon icon={showValidation ? faEyeSlash : faEye} />
                </button>
              </div>

              <button type="submit" className={styles.loginbutton}>
                Create user
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
