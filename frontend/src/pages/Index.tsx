
import React from 'react';
import { Link } from 'react-router-dom';
import { Beer, Trophy, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-grow flex items-center bg-gradient-to-b from-white to-purple-50">
        <div className="chug-container">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-chug-dark-purple leading-tight">
                Measure Your <span className="text-chug-purple">Tolerance</span>, <br />
                Challenge Your <span className="text-chug-orange">Friends</span>
              </h1>
              
              <p className="text-lg text-gray-600">
                ChugChamp helps you understand your alcohol metabolism by testing your Blood Alcohol Content (BAC) 
                and comparing it with others. Drink responsibly and have fun!
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/bac-test" className="chug-btn-primary flex items-center">
                      <Beer className="mr-2 h-5 w-5" />
                      Take BAC Test
                    </Link>
                    <Link to="/leaderboard" className="chug-btn-secondary flex items-center">
                      <Trophy className="mr-2 h-5 w-5" />
                      View Leaderboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="chug-btn-primary flex items-center">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Sign Up
                    </Link>
                    <Link to="/login" className="chug-btn-secondary flex items-center">
                      <LogIn className="mr-2 h-5 w-5" />
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                <div className="relative">
                  <div className="chug-card transform rotate-3 scale-105">
                    <h3 className="text-xl font-bold text-chug-purple mb-2">BAC Testing</h3>
                    <p className="text-gray-600 mb-4">Measure your BAC after drinking a standard shot and see how it compares to the estimated value.</p>
                  </div>
                  <div className="chug-card mt-6 transform -rotate-2 scale-105">
                    <h3 className="text-xl font-bold text-chug-purple mb-2">Friends Leaderboard</h3>
                    <p className="text-gray-600 mb-4">Compare your tolerance with friends and see who ranks highest!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="chug-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Beer className="h-6 w-6 mr-2" />
              <span className="font-semibold">ChugChamp</span>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} ChugChamp. All rights reserved. Drink responsibly.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
