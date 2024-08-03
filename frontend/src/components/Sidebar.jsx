import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MdHistory, MdLogout, MdSettings, MdSubscriptions, MdThumbUp } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { useSelector, useDispatch } from 'react-redux';
import { logout, fetchSubscriptions } from '../features/UserSlice';
import Avatar from '../components/Avatar';
import SearchBar from './Search';
// fix: subscription on sidebar refetch on every unsubscribe action
const Sidebar = ({ isMenuOpen }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const subscriptions = useSelector(state => state.user.subscriptions);
  const [visibleSubscriptions, setVisibleSubscriptions] = useState(5);

  useEffect(() => {
    if (user) {
      dispatch(fetchSubscriptions());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSeeMore = () => {
    setVisibleSubscriptions(prev => prev + 5); // Load 5 more subscriptions
  };

  const displaySubscriptions = (subs) => {
    return subs.slice(0, visibleSubscriptions).map(sub => (
      <NavLink
        key={sub.channel._id}
        to={`/c/${sub.channel.username}`}
        end
        className={({ isActive }) =>
          `flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
        }
      >
        <Avatar user={sub.channel} type='small' />
        <span>{sub.channel.username}</span>
      </NavLink>
    ));
  };

  return (
    <div className={`fixed pt-20 left-0 z-50 transition-transform duration-300 ${isMenuOpen ? 'transform translate-x-0' : 'transform -translate-x-full'} w-60 h-full bg-white shadow-lg`}>
      <div className="flex flex-col h-full p-4">

      <div className="sm:block md:hidden lg:hidden">
        <SearchBar />
      </div>
   
        <nav className="mt-2 flex flex-col space-y-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
            }
          >
            <GoHomeFill size={25} />
            {isMenuOpen && <span>Home</span>}
          </NavLink>

          <NavLink
            to={`/c/${user?.username}`}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
            }
          >
            <CgProfile size={25} />
            {isMenuOpen && <span>Your Profile</span>}
          </NavLink>

          <NavLink
            to="/me/subscriptions"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
            }
          >
            <MdSubscriptions size={25} />
            {isMenuOpen && <span>Subscriptions</span>}
          </NavLink>

          <NavLink
            to="/me/watch-history"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
            }
          >
            <MdHistory size={25} />
            {isMenuOpen && <span>Watch History</span>}
          </NavLink>

          <NavLink
            to="/me/liked-videos"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
            }
          >
            <MdThumbUp size={25} />
            {isMenuOpen && <span>Liked Videos</span>}
          </NavLink>

          <hr />

          {subscriptions?.subscribedTo?.length > 0 && (
            <>
              <div className="text-lg rounded-xl p-2">
                Subscriptions
                {displaySubscriptions(subscriptions.subscribedTo)}
                {subscriptions.subscribedTo.length > visibleSubscriptions && (
                  <button
                    onClick={handleSeeMore}
                    className="text-blue-500 hover:underline"
                  >
                    See More
                  </button>
                )}
              </div>
              <hr />
            </>
          )}

          <NavLink
            to="/me/settings"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`
            }
          >
            <MdSettings size={25} />
            {isMenuOpen && <span>Settings</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-lg rounded-xl p-2 transition duration-300 hover:bg-gray-200"
          >
            <MdLogout size={25} />
            {isMenuOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
