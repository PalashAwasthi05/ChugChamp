
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { friendsAPI } from '@/services/api';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import { Trophy, Medal, Search, ArrowUpDown } from 'lucide-react';

interface Friend {
  id: string;
  username: string;
  currentBAC: number;
  toleranceScore: number;
}

const Leaderboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'toleranceScore' | 'currentBAC'>('toleranceScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaderboard = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const response = await friendsAPI.getRankings(user.id);
      
      if (response.data) {
        setFriends(response.data);
      } else {
        toast.error('Failed to fetch leaderboard. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to fetch leaderboard. Please try again.');
      console.error('Leaderboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaderboard();
    }
  }, [isAuthenticated, user]);

  const toggleSort = (field: 'toleranceScore' | 'currentBAC') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedFriends = [...friends]
    .filter(friend => friend.username.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return multiplier * (a[sortField] - b[sortField]);
    });

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return 'text-yellow-400'; // Gold
      case 1:
        return 'text-gray-400'; // Silver
      case 2:
        return 'text-amber-700'; // Bronze
      default:
        return 'text-gray-300'; // Others
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow py-10 bg-gray-50">
        <div className="chug-container">
          <div className="chug-card">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <Trophy size={36} className="text-chug-purple mr-4" />
                <div>
                  <h1 className="text-3xl font-bold text-chug-purple">Friend Rankings</h1>
                  <p className="text-gray-600">See how your tolerance compares with friends</p>
                </div>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Search friends..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {loading ? (
              <div className="py-12">
                <LoadingSpinner size="large" color="#6E59A5" />
                <p className="text-center text-gray-500 mt-4">Loading leaderboard...</p>
              </div>
            ) : sortedFriends.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rankings Available</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm 
                    ? 'No friends match your search term. Try a different search.'
                    : 'Complete your first BAC test to appear on the leaderboard.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('currentBAC')}
                      >
                        <div className="flex items-center">
                          Current BAC
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort('toleranceScore')}
                      >
                        <div className="flex items-center">
                          Tolerance Score
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedFriends.map((friend, index) => {
                      const isCurrentUser = user && friend.id === user.id;
                      return (
                        <tr 
                          key={friend.id} 
                          className={`
                            ${isCurrentUser ? 'bg-purple-50' : ''}
                            hover:bg-gray-50 transition-colors
                          `}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {index < 3 ? (
                                <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                              ) : (
                                <span className="text-gray-600 font-medium ml-1">
                                  {index + 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">
                                {friend.username}
                                {isCurrentUser && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {friend.currentBAC.toFixed(3)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {friend.toleranceScore.toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">About Tolerance Score</h3>
                  <div className="text-sm text-blue-700 mt-1">
                    <p>
                      Tolerance Score indicates your body's ability to process alcohol. A higher score means you can drink more before feeling the effects.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
