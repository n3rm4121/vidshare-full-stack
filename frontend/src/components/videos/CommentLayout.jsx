import React, { useState, useEffect, useRef } from 'react';
import { BiLike, BiDislike } from "react-icons/bi";
import { FiMoreVertical } from "react-icons/fi";
import moment from 'moment';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import Avatar from '../Avatar'

function CommentLayout({ comment, setComments }) {
  const user = useSelector(state => state.user.user);

  const [isToggled, setIsToggled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
 const toggleRef = useRef();

  const isOwner = user._id === comment?.owner?._id;

  // to close the dropdown when clicked outside the component or dropdown itself is clicked again to close it 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        setIsToggled(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUpdateComment = async () => {
    try {
      await axiosInstance.put(`/comments/${comment._id}`, { content });
      const updatedComment = {
        ...comment,
        content,
      };
      setComments(prevComments => prevComments.map(c => (c._id === comment._id ? updatedComment : c)));
      setIsEditing(false);
      setIsToggled(false);
    } catch (error) {
      console.error('Update Comment Error:', error.message || 'Something went wrong');
    }
  };

  const handleDeleteComment = async () => {
    try {
      
      await axiosInstance.delete(`/comments/${comment._id}`);
      setComments(prevComments => prevComments.filter(c => c._id !== comment._id));
      setIsToggled(false);
    } catch (error) {
      console.error('Delete Comment Error:', error.message || 'Something went wrong');
    }
  };

  return (
    <li className="flex items-start justify-between bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex items-start space-x-4">
      <Avatar user={comment.owner} type='medium' />
        <div>
          <p className="font-semibold text-sm text-gray-800">@{comment.owner?.username}
            <span className="ml-1 text-gray-500 text-xs">{moment(comment.createdAt).fromNow()}</span>
          </p>
          {isEditing ? (
            <div>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button
                onClick={handleUpdateComment}
                className="bg-blue-500 text-white p-1 rounded-lg my-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white p-1 rounded-lg ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-gray-600">{comment.content}</p>
          )}
          <div className="flex items-center space-x-2">
            <BiLike className="text-2xl text-gray-500 inline" />
            <BiDislike className="text-2xl text-gray-500 inline" />
          </div>
        </div>
      </div>
      {isOwner && (
        <div className="relative" ref={toggleRef} >
          <button onClick={() => setIsToggled(!isToggled)} className="focus:outline-none hover:bg-gray-200 rounded-full p-2">
            <FiMoreVertical className="text-xl text-gray-500" />
          </button>
          {isToggled && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
              <button
                onClick={() => setIsEditing(true)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Update
              </button>
              <button
                onClick={handleDeleteComment}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default CommentLayout;
