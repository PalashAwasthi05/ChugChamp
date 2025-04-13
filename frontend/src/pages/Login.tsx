
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { Lock } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await authAPI.login(credentials);
      
      if (response.data && response.data.token) {
        login(response.data.token, {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
        });
        
        navigate('/');
        toast.success('Login successful!');
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      toast.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-10 bg-gray-50">
        <div className="chug-container max-w-md">
          <div className="chug-card">
            <div className="text-center mb-8">
              <Lock size={48} className="mx-auto text-chug-purple" />
              <h1 className="chug-header">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your ChugChamp account</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="chug-input"
                    placeholder="your@email.com"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="chug-input"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="chug-btn-primary w-full"
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-chug-purple font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
