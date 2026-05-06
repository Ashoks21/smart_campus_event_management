import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('campus_user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const [userEvents, setUserEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('campus_user_session', JSON.stringify(user));
      fetchUserRegistrations();
      fetchUserHostedEvents();
    } else {
      localStorage.removeItem('campus_user_session');
      setRegistrations([]);
      setUserEvents([]);
    }
  }, [user]);

  const fetchUserHostedEvents = async () => {
    if (!user || !token) return;
    try {
      const res = await axios.get(`${API_URL}/events/user/hosted`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserEvents(res.data);
    } catch (err) {
      console.error('Error fetching hosted events:', err);
    }
  };

  const hostEvent = async (eventData) => {
    try {
      const res = await axios.post(`${API_URL}/events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchUserHostedEvents();
        return { success: true, eventId: res.data.eventId };
      }
    } catch (err) {
      console.error('Hosting error:', err);
      return { success: false, message: err.message };
    }
  };

  const fetchUserRegistrations = async () => {
    if (!user || !token) return;
    try {
      const res = await axios.get(`${API_URL}/registrations/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistrations(res.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    }
  };

  const signup = async (userData) => {
    console.log('Frontend attempting signup at:', `${API_URL}/auth/signup`);
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, userData);
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        return { success: true };
      }
    } catch (err) {
      console.error('Signup error:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Signup failed. Please try again.';
      return { success: false, message: errorMessage };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.success) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const registerForEvent = async (eventData) => {
    try {
      const res = await axios.post(`${API_URL}/registrations`, {
        ...eventData,
        userId: user?.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchUserRegistrations();
        return res.data;
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      throw err;
    }
  };

  const getEventRegistrationsCount = async (eventId) => {
    try {
      const res = await axios.get(`${API_URL}/registrations/count/${eventId}`);
      return res.data.count;
    } catch (err) {
      console.error('Error getting count:', err);
      return 0;
    }
  };

  const submitReview = async (reviewData) => {
    try {
      const res = await axios.post(`${API_URL}/reviews`, {
        ...reviewData,
        userId: user?.id,
        userName: user?.name
      });
      return res.data;
    } catch (err) {
      console.error('Review error:', err);
    }
  };

  const getEventReviews = async (eventId) => {
    try {
      const res = await axios.get(`${API_URL}/reviews/${eventId}`);
      return res.data;
    } catch (err) {
      console.error('Error getting reviews:', err);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, signup, login, logout, registrations, userEvents, registerForEvent, hostEvent, fetchUserHostedEvents, getEventRegistrationsCount,
      submitReview, getEventReviews
    }}>
      {children}
    </AuthContext.Provider>
  );
};
