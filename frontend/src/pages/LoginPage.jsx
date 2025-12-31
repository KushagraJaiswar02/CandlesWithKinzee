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
    <div className="min-h-screen flex items-center justify-center bg-beige/30 p-4">
      <SEO title="Login" description="Login to your CandlesWithKinzee account." />

      <div className="w-full max-w-md bg-white p-10 md:p-14 shadow-xl shadow-brown/5 rounded-none md:rounded-2xl border border-white">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-medium text-charcoal mb-3">Welcome Back</h1>
          <p className="text-brown/60 font-light text-sm">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-8">

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-charcoal mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pb-2 border-b border-neutral-300 bg-transparent focus:border-charcoal focus:outline-none transition-colors placeholder-neutral-300 text-charcoal"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-charcoal mb-2">Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pb-2 border-b border-neutral-300 bg-transparent focus:border-charcoal focus:outline-none transition-colors placeholder-neutral-300 text-charcoal"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-charcoal text-white font-bold text-xs uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-brown/60">
            New here?
            <Link to="/register" className="text-charcoal font-bold ml-1 hover:underline decoration-1 underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;