import React from 'react';
import { ClipLoader } from 'react-spinners';

const Spinner = ({ loading, size=100 }) => (
  <div className="flex justify-center items-center">
    <ClipLoader color="#39FFFF" loading={loading} size={size} />
  </div>
);

export default Spinner;
