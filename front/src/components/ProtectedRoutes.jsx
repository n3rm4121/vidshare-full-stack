// not used yet

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const user = useSelector(state => state.user.user);
  console.log(user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
