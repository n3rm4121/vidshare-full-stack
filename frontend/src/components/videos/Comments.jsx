import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';
import CommentLayout from './CommentLayout';
import Spinner from '../Spinner';
import { FaRegUser } from 'react-icons/fa';
// TODO: Pagination for comments (optional)
// TODO: Add a loading spinner while fetching comments

// for now only max 10 comments are fetched (see backend)
// either apply pagination or load more comments on button click
// or infinite scroll to load more comments

function Comments() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoId = useParams().id;
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/comments/${videoId}`);
        setComments(response.data.data.comments);
        
        setLoading(false);
      } catch (error) {
        setLoading(false);  // to close the dropdown when clicked outside the component or dropdown itself is clicked again to close it 

        console.error('Fetch Error:', error.message || 'Something went wrong');
        setError(error.message || 'Something went wrong');
       
      }
    };
    fetchComments();
  }, [videoId]);

  
  const handleAddComment = async (e) => {
    e.preventDefault();
    const content = e.target.content.value;
    try {
      
      const response = await axiosInstance.post(`/comments/${videoId}`, { content });
      const newComment = {
        ...response.data.data,
        owner: user,
      };
      setComments([newComment, ...comments]);
      e.target.reset();
      
    } catch (error) {
      
      console.error('Add Comment Error:', error.message || 'Something went wrong');
      setError(error.message || 'Something went wrong');
    }
  };

  

  if(loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">

        <Spinner loading={loading} />
      </div>
    );
  }

  if(error) {
    return <div className='text-red-500'>{error}</div>; 
  }
  
  

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{comments.length} Comments</h2>
      <form className='flex items-center space-x-4 mb-6' onSubmit={handleAddComment}>
        {user?.avatar ? (
          <img src={user.avatar} alt={user.username} className='w-10 h-10 rounded-full' />
        ) : (
          <div className='w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center'>
            <FaRegUser size={30} />
          </div>
        )}
        <input 
          className='flex-grow p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200' 
          type='text' 
          name='content' 
          autoComplete='off'
          placeholder='Add a comment' 
        />
        <button 
          className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200' 
          type='submit'
        >
          Comment
        </button>
      </form>
      <ul className="space-y-4">
        {comments.length > 0 && comments.map(comment => (
          <CommentLayout
            key={comment._id}
            comment={comment}
            setComments={setComments}
           
          />
        ))}
      </ul>
    </div>
  );
}

export default Comments;
