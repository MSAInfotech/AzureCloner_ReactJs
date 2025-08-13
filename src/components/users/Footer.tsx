import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-600 py-6 mt-12 text-center shadow-inner">
      <p>&copy; {new Date().getFullYear()} Azure Clonner. All rights reserved.</p>
    </footer>
  );
};

export default Footer;