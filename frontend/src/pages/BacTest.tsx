
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { bacAPI } from '@/services/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { Wine, Clock, ArrowRight, AlertCircle } from 'lucide-react';

const BacTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    measuredBAC: '',
    timeSinceShotMinutes: '25',
  });
  
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<{
    measuredBAC: number;
    calculatedBAC: number;
  } | null>(null);

  // Countdown timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds

  useEffect(() => {
    let timerId: number | undefined;
    
    if (timerActive && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timerActive && timeRemaining === 0) {
      setTimerActive(false);
      toast.info("Time's up! You can now measure your BAC.");
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerActive, timeRemaining]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimeRemaining(25 * 60); // Reset timer to 25 minutes
    setTimerActive(true);
    toast.info("Timer started! Wait 25 minutes before measuring your BAC.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('User information is missing');
      return;
    }
    
    // Validate BAC is a number
    const measuredBAC = parseFloat(formData.measuredBAC);
    if (isNaN(measuredBAC)) {
      toast.error('Please enter a valid BAC measurement');
      return;
    }
    
    // Validate time since shot
    const timeSinceShotMinutes = parseInt(formData.timeSinceShotMinutes);
    if (isNaN(timeSinceShotMinutes) || timeSinceShotMinutes <= 0) {
      toast.error('Please enter a valid time since consumption');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await bacAPI.submitTest({
        userId: user.id,
        measuredBAC,
        timeSinceShotMinutes,
      });
      
      if (response.data) {
        setTestResults({
          measuredBAC: response.data.measuredBAC,
          calculatedBAC: response.data.calculatedBAC,
        });
        
        setShowResults(true);
        toast.success('BAC test submitted successfully!');
      } else {
        toast.error('Failed to submit BAC test. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit BAC test. Please try again.';
      toast.error(errorMessage);
      console.error('BAC test error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-10 bg-gray-50">
        <div className="chug-container max-w-2xl">
          {!showResults ? (
            <div className="chug-card">
              <div className="text-center mb-8">
                <Wine size={48} className="mx-auto text-chug-purple" />
                <h1 className="chug-header">BAC Test</h1>
                <p className="text-gray-600">Follow the instructions to test your alcohol tolerance</p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Instructions</h3>
                    <div className="text-sm text-yellow-700 mt-2">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>Drink a 2oz (59.14ml) shot of vodka</li>
                        <li>Wait 25 minutes (use the timer below)</li>
                        <li>Measure your BAC using a breathalyzer</li>
                        <li>Enter your measured BAC and submit the form</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-chug-purple mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Waiting Timer</h3>
                  <div className="text-3xl font-bold font-mono mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <button
                    type="button"
                    onClick={startTimer}
                    disabled={timerActive}
                    className={`${
                      timerActive
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-chug-purple hover:bg-chug-light-purple'
                    } text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out`}
                  >
                    {timerActive ? 'Timer Running...' : 'Start 25 Minute Timer'}
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="measuredBAC" className="block text-sm font-medium text-gray-700 mb-1">
                      Measured BAC
                    </label>
                    <input
                      type="text"
                      id="measuredBAC"
                      name="measuredBAC"
                      className="chug-input"
                      placeholder="Enter your breathalyzer reading (e.g. 0.08)"
                      value={formData.measuredBAC}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the value exactly as shown on your breathalyzer
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="timeSinceShotMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                      Time Since Shot (minutes)
                    </label>
                    <input
                      type="number"
                      id="timeSinceShotMinutes"
                      name="timeSinceShotMinutes"
                      className="chug-input"
                      placeholder="Default: 25 minutes"
                      value={formData.timeSinceShotMinutes}
                      onChange={handleChange}
                      min="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Default is 25 minutes, but you can adjust if needed
                    </p>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="chug-btn-accent w-full flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      Submit BAC Test
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="chug-card">
              <div className="text-center mb-8">
                <Wine size={48} className="mx-auto text-chug-purple" />
                <h1 className="chug-header">Test Results</h1>
                <p className="text-gray-600">Here's how your measured BAC compares to our calculation</p>
              </div>
              
              {testResults && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Measured BAC</h3>
                    <div className="text-4xl font-bold text-chug-orange">
                      {testResults.measuredBAC.toFixed(3)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      This is the value you entered from your breathalyzer
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Calculated BAC</h3>
                    <div className="text-4xl font-bold text-chug-purple">
                      {testResults.calculatedBAC.toFixed(3)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      This is what our algorithm predicted based on your physical attributes
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">What do these results mean?</h3>
                    <div className="text-sm text-blue-700 mt-2">
                      <p className="mb-2">
                        The difference between your measured BAC and our calculated BAC helps us determine your alcohol tolerance.
                      </p>
                      <p>
                        Your results have been recorded and will be used to update your position on the leaderboard!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowResults(false)}
                  className="chug-btn-secondary"
                >
                  Take Another Test
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacTest;
