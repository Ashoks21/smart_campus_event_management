import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import Registration from '../pages/Registration';
import Payment from '../pages/Payment';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Success from '../pages/Success';
import HostEvent from '../pages/HostEvent';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'Admin' ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/events" element={<Events />} />
      <Route path="/event/:id" element={<EventDetails />} />
      <Route 
        path="/register/:id" 
        element={
          <PrivateRoute>
            <Registration />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/payment" 
        element={
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/success" 
        element={
          <PrivateRoute>
            <Success />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/host" 
        element={
          <PrivateRoute>
            <HostEvent />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
