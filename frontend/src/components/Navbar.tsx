
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Beer, Trophy, LogIn, UserPlus, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Beer className="h-8 w-8 text-chug-purple" />
              <span className="text-xl font-bold text-chug-purple">ChugChamp</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/bac-test" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-chug-purple transition duration-150 ease-in-out flex items-center"
                >
                  <Beer className="h-5 w-5 mr-1" />
                  BAC Test
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-chug-purple transition duration-150 ease-in-out flex items-center"
                >
                  <Trophy className="h-5 w-5 mr-1" />
                  Leaderboard
                </Link>
                <button 
                  onClick={logout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-500 transition duration-150 ease-in-out flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-chug-purple transition duration-150 ease-in-out flex items-center"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-3 py-2 rounded-md text-sm font-medium bg-chug-purple text-white hover:bg-chug-light-purple transition duration-150 ease-in-out flex items-center"
                >
                  <UserPlus className="h-5 w-5 mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-chug-purple hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-chug-purple"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/bac-test" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-chug-purple transition duration-150 ease-in-out flex items-center"
                  onClick={closeMenu}
                >
                  <Beer className="h-5 w-5 mr-2" />
                  BAC Test
                </Link>
                <Link 
                  to="/leaderboard" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-chug-purple transition duration-150 ease-in-out flex items-center"
                  onClick={closeMenu}
                >
                  <Trophy className="h-5 w-5 mr-2" />
                  Leaderboard
                </Link>
                <button 
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-red-500 transition duration-150 ease-in-out flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-chug-purple transition duration-150 ease-in-out flex items-center"
                  onClick={closeMenu}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-chug-purple hover:bg-gray-100 transition duration-150 ease-in-out flex items-center"
                  onClick={closeMenu}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
