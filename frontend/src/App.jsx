import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import MainLayout from './components/MainLayout';
import { getCurrentUser } from './features/UserSlice';
import SinglepageVideo from './pages/SinglepageVideo';
import PageNotFound from './pages/PageNotFound';
import UserSettings from './pages/UserSettings';
import UserProfile from './pages/UserProfile';
import SearchPage from './pages/SearchResults';
import Subscriptions from './pages/Subscriptions';
import WatchHistory from './pages/WatchHistory';
import LikedVideos from './pages/LikedVideos';
import EmailVerify from './components/EmailVerify'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const location = useLocation();
  if (accessToken) return children;
  return <Navigate to="/login" state={{ from: location }} />;
};

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="user/verify/:userId/:token" element={<EmailVerify />} />

        {/* Public layout — everyone can browse */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="videos/:id" element={<SinglepageVideo />} />
          <Route path="c/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="search" element={<SearchPage />} />

          {/* Auth-required pages */}
          <Route path="me/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
          <Route path="me/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
          <Route path="me/watch-history" element={<ProtectedRoute><WatchHistory /></ProtectedRoute>} />
          <Route path="me/liked-videos" element={<ProtectedRoute><LikedVideos /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
