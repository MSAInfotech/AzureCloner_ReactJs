import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, Bars3Icon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showSolutionMenu, setShowSolutionMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProductMenuMobile, setShowProductMenuMobile] = useState(false);
  const [showSolutionMenuMobile, setShowSolutionMenuMobile] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProductMenu(false);
        setShowSolutionMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-row justify-between items-center">
        <div onClick={() => navigate("/")} className="text-2xl font-bold text-blue-700">Azure Cloner</div>
        <nav className="hidden md:flex items-center gap-x-8 text-sm font-medium text-gray-800 relative" ref={dropdownRef}>
          <div className="relative">
            <button onClick={() => { setShowProductMenu(!showProductMenu); setShowSolutionMenu(false); }} className="flex items-center gap-1 hover:text-blue-600">
              Products <ChevronDownIcon className="w-4 h-4" />
            </button>
            {showProductMenu && (
              <div className="absolute top-8 left-0 bg-white border rounded shadow-md p-2 w-48 z-50">
                <Link to="/products/azure-clone" className="block px-3 py-2 hover:bg-gray-100 rounded">Azure Clone</Link>
                <Link to="/products/backup-manager" className="block px-3 py-2 hover:bg-gray-100 rounded">Backup Manager</Link>
                <Link to="/products/service-sync" className="block px-3 py-2 hover:bg-gray-100 rounded">Service Sync</Link>
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => { setShowSolutionMenu(!showSolutionMenu); setShowProductMenu(false); }} className="flex items-center gap-1 hover:text-blue-600">
              Solutions <ChevronDownIcon className="w-4 h-4" />
            </button>
            {showSolutionMenu && (
              <div className="absolute top-8 left-0 bg-white border rounded shadow-md p-2 w-48 z-50">
                <Link to="/solutions/migration" className="block px-3 py-2 hover:bg-gray-100 rounded">Migration</Link>
                <Link to="/solutions/governance" className="block px-3 py-2 hover:bg-gray-100 rounded">Governance</Link>
              </div>
            )}
          </div>
          <Link to="/resources" className="hover:text-blue-600">Resources</Link>
          <Link to="/pricing" className="hover:text-blue-600">Pricing</Link>
          <Link to="/partners" className="hover:text-blue-600">Partners</Link>
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
          <Link to="/signup" className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">Start Free Trial</Link>
        </nav>
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-700 focus:outline-none">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white px-6 py-4 shadow-lg space-y-4 text-sm font-medium text-gray-800">
          <div>
            <button onClick={() => setShowProductMenuMobile(!showProductMenuMobile)} className="flex justify-between items-center w-full hover:text-blue-600">
              Products <ChevronDownIcon className="w-4 h-4" />
            </button>
            {showProductMenuMobile && (
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/products/azure-clone" className="block hover:text-blue-600">Azure Clone</Link>
                <Link to="/products/backup-manager" className="block hover:text-blue-600">Backup Manager</Link>
                <Link to="/products/service-sync" className="block hover:text-blue-600">Service Sync</Link>
              </div>
            )}
          </div>
          <div>
            <button onClick={() => setShowSolutionMenuMobile(!showSolutionMenuMobile)} className="flex justify-between items-center w-full hover:text-blue-600">
              Solutions <ChevronDownIcon className="w-4 h-4" />
            </button>
            {showSolutionMenuMobile && (
              <div className="pl-4 mt-2 space-y-2">
                <Link to="/solutions/migration" className="block hover:text-blue-600">Migration</Link>
                <Link to="/solutions/governance" className="block hover:text-blue-600">Governance</Link>
              </div>
            )}
          </div>
          <Link to="/resources" className="block hover:text-blue-600">Resources</Link>
          <Link to="/pricing" className="block hover:text-blue-600">Pricing</Link>
          <Link to="/partners" className="block hover:text-blue-600">Partners</Link>
          <div className="flex flex-col gap-3 pt-4">
            <Link to="/login" className="text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
            <Link to="/signup" className="text-center bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800">Start Free Trial</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;