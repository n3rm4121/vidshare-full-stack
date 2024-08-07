import React from 'react';

function Avatar({ user , type}) {
 
  
  if (user?.avatar) {
    return (
      <img
        src={user?.avatar}
        alt={`${user?.fullname}'s Avatar`}
        className={`${type ==='large' && 'w-[150px] h-[150px]' }  rounded-full ${type==='small' && 'h-5 w-5'} ${type==='medium' && 'h-10 w-10'}`}
      />
    );
  } else {
    return (
      <div className={`flex items-center justify-center bg-gray-300 text-gray-700 font-bold rounded-full p-2 ${type==='medium' && 'h-8 w-8 text-lg'} ${type ==='large' && 'w-[150px] h-[150px] text-7xl' } ${type==='small' && 'h-5 w-5 text-xs'} `

      }>
        {user?.fullname?.charAt(0).toUpperCase()}
      </div>
    );
  }
}

export default Avatar;
