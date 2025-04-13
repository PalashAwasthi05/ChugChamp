
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { User, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: 170, // Default height in cm
    weight: 70, // Default weight in kg
    age: 25, // Default age
    gender: 'male', // Default gender
    metabolism: 0.017, // Default metabolism
  });
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateStep1 = () => {
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Email is invalid');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (formData.height <= 0) {
      toast.error('Height must be a positive number');
      return false;
    }
    
    if (formData.weight <= 0) {
      toast.error('Weight must be a positive number');
      return false;
    }
    
    if (formData.age < 18) {
      toast.error('You must be at least 18 years old to register');
      return false;
    }
    
    if (!['male', 'female', 'other'].includes(formData.gender)) {
      toast.error('Please select a valid gender');
      return false;
    }
    
    return true;
  };

  const moveToNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const moveToPreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await authAPI.register(formData);
      
      if (response.data && response.data.token) {
        // Assuming the API response contains token and user data
        login(response.data.token, {
          id: response.data.user.id,
          username: formData.username,
          email: formData.email,
        });
        
        navigate('/');
        toast.success('Registration successful!');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      console.error('Registration error:', error);
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
              <User size={48} className="mx-auto text-chug-purple" />
              <h1 className="chug-header">Create Account</h1>
              <p className="text-gray-600">Join ChugChamp to start measuring your BAC tolerance</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className={`flex-1 h-1 ${currentStep >= 1 ? 'bg-chug-purple' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm 
                  ${currentStep >= 1 ? 'bg-chug-purple text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className={`flex-1 h-1 ${currentStep >= 2 ? 'bg-chug-purple' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm 
                  ${currentStep >= 2 ? 'bg-chug-purple text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <div className="flex-1 h-1 bg-gray-200"></div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div>
                  <h2 className="chug-subheader">Account Information</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="chug-input"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
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
                        value={formData.email}
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
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="chug-input"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={moveToNextStep}
                      className="chug-btn-primary flex items-center"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h2 className="chug-subheader">Physical Information</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    This information helps us calculate your BAC more accurately
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        id="height"
                        name="height"
                        className="chug-input"
                        placeholder="Height in centimeters"
                        value={formData.height}
                        onChange={handleChange}
                        min="100"
                        max="250"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="weight"
                        name="weight"
                        className="chug-input"
                        placeholder="Weight in kilograms"
                        value={formData.weight}
                        onChange={handleChange}
                        min="30"
                        max="300"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        className="chug-input"
                        placeholder="Your age"
                        value={formData.age}
                        onChange={handleChange}
                        min="18"
                        max="120"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        className="chug-input"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={moveToPreviousStep}
                      className="chug-btn-secondary"
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      className="chug-btn-primary"
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="small" /> : 'Create Account'}
                    </button>
                  </div>
                </div>
              )}
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-chug-purple font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
