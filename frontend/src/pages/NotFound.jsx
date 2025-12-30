import React from "react";
import SEO from '../components/SEO.jsx';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen text-3xl text-charcoal">
      <SEO title="404 - Page Not Found" description="The page you are looking for does not exist." robots="noindex, nofollow" />
      404 | Page Not Found
    </div>
  );
};

export default NotFound;
