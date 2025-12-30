// src/LoginPage.jsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import AuthContext from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      addToast('Logged in successfully', 'success');
      navigate('/');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-beige p-4">
      <SEO title="Login" description="Login to your CandlesWithKinzee account." />
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-xl border border-shadow/50">
        <h1 className="text-4xl font-serif font-bold text-brown text-center">
          Welcome Back
        </h1>
        <p className="text-center text-charcoal">
          Sign in to manage your profile.
        </p>

        <form onSubmit={submitHandler} className="space-y-6">

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
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary focus:outline-none transition duration-150"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-flame text-white font-bold text-lg rounded-lg hover:bg-brown transition duration-200 shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-charcoal">
            Don't have an account?
            <Link to="/register" className="text-flame font-semibold hover:underline ml-1">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;