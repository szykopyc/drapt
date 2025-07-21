import { Route } from "react-router-dom";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import Login from "../pages/Login.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";

export default [
  <Route path="about" element={<About />} />,
  <Route path="contact" element={<Contact />} />,
  <Route path="login" element={<Login />} />,
  <Route
    path="forgot-password"
    element={<ForgotPassword />}
  />
] 
