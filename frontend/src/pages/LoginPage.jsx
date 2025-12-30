// src/LoginPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-beige p-4">
      <SEO title="Login" description="Login to your CandlesWithKinzee account to manage orders and settings." />
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-xl border border-shadow/50">
        <h1 className="text-4xl font-serif font-bold text-brown text-center">
          Welcome Back
        </h1>
        <p className="text-center text-charcoal">
          Sign in to manage your profile and view your order history.
        </p>

        <form className="space-y-6">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
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
              className="w-full p-3 border border-shadow rounded-lg focus:ring-primary focus:border-primary focus:outline-none transition duration-150"
              required
            />
          </div>

          <button
            type="submit"
            // Use flame color for the primary CTA button
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