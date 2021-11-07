import React,{useState} from 'react';
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import SignIn from "./components/SignIn"
import SignUp from "./components/SignUp"
import Dashboard from "./components/Dashboard"
import Home from "./components/Home"
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {generatePassword} from './crypto'
function App() {
  const [token,setToken] = useState<String>('')
  const [pass,setPass] = useState<String>('')
  const x = generatePassword({
    length:10,
    includeSymbols:true,
    includeDigits:false,
    includeUppercase:true
  })
  console.log(x);
  return (
    <BrowserRouter>
      <Navbar page="Sign up"/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn setToken={setToken} setPass={setPass} />} />
        <Route path="/dashboard" element={<Dashboard token={token} pass={pass} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
