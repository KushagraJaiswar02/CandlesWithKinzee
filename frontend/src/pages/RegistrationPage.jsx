// src/RegisterPage.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);
    if (result.success) {
      addToast('Registration successful', 'success');
      navigate('/');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-beige p-4">
      <SEO title="Register" description="Create a new account at CandlesWithKinzee." />
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-xl border border-shadow/50">
        <h1 className="text-4xl font-serif font-bold text-brown text-center">
          Create Account
        </h1>
        <p className="text-center text-charcoal">
          Join the CandlesWithKinzee family.
        </p>

        <form onSubmit={submitHandler} className="space-y-6">

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary focus:outline-none transition duration-150"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary focus:outline-none transition duration-150"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Secure Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary focus:outline-none transition duration-150"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-charcoal font-bold text-lg rounded-lg hover:bg-flame hover:text-white transition duration-200 shadow-lg"
          >
            Register
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-charcoal">
            Already have an account?
            <Link to="/login" className="text-brown font-semibold hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;