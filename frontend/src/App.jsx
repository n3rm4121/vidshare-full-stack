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

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  
  const accessToken = localStorage.getItem('accessToken');
  const location = useLocation();

  if (accessToken) {
    return children;
  } else {
    // Redirect to login and save the current location
    return <Navigate to="/login" state={{ from: location }} />;
  }
};


const App = () => {
  const dispatch = useDispatch();
useEffect(() => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    dispatch(getCurrentUser());
  }
}, [dispatch]);

  const user = useSelector(state => state.user.user);
 // console.log('User:', user);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />

        <Route path="user/verify/:userId/:token" element={<EmailVerify />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="videos/:id" element={<SinglepageVideo />} />
          <Route path="c/:username" element={<UserProfile />} />
          <Route path="me/settings" element={<UserSettings />} />
          <Route path='search' element={<SearchPage />} />
          <Route path='me/subscriptions' element={<Subscriptions /> } />
          <Route path='me/watch-history' element={<WatchHistory />} />
          <Route path='me/liked-videos' element={<LikedVideos />} />
        </Route>

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
