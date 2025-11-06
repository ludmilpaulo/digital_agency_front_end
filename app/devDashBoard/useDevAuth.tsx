/**
 * Custom hook to ensure authentication is available for devDashBoard
 * Handles token retrieval from multiple sources
 */

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useDevAuth() {
  const user = useSelector(selectUser);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Try to get token from multiple sources
    let authToken: string | null = null;

    // Source 1: Redux user object
    if (user?.token) {
      authToken = user.token;
      console.log('✅ Token found in Redux user object');
    }
    
    // Source 2: localStorage 'token' key
    if (!authToken) {
      const lsToken = localStorage.getItem('token');
      if (lsToken) {
        authToken = lsToken;
        console.log('✅ Token found in localStorage (token key)');
      }
    }
    
    // Source 3: localStorage 'maindo_user' object
    if (!authToken) {
      try {
        const maindoUser = localStorage.getItem('maindo_user');
        if (maindoUser) {
          const parsedUser = JSON.parse(maindoUser);
          if (parsedUser.token) {
            authToken = parsedUser.token;
            console.log('✅ Token found in localStorage (maindo_user object)');
          }
        }
      } catch (e) {
        console.error('Error parsing maindo_user from localStorage:', e);
      }
    }

    if (!authToken) {
      console.error('❌ No token found in any source!');
      console.log('Please log out and log back in to get a fresh token.');
      toast.error('Authentication required. Please log in again.', { duration: 5000 });
      setTimeout(() => {
        router.push('/LoginScreenUser');
      }, 2000);
      return;
    }

    console.log('Token retrieved successfully:', authToken.substring(0, 20) + '...');
    setToken(authToken);
    setIsReady(true);
  }, [user, router]);

  return { user, token, isReady };
}

