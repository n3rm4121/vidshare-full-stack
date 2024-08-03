import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { uploadVideo } from '../features/UserSlice';
import { IoClose } from 'react-icons/io5';

const UploadForm = ({ handleCloseDialog }) => {
  const maxTitleLength = 100;
  const maxDescriptionLength = 500;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    videoFile: '',
    thumbnailFile: ''
  });

  const dispatch = useDispatch();

  useEffect(() => {
    document.getElementById('title').focus();
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (e.target.id === 'videoDropZone') {
      setVideoFile(file);
    } else if (e.target.id === 'thumbnailDropZone') {
      setThumbnailFile(file);
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: title ? (title.length <= maxTitleLength ? '' : `Title must be ${maxTitleLength} characters or less`) : 'Title is required',
      description: description ? (description.length <= maxDescriptionLength ? '' : `Description must be ${maxDescriptionLength} characters or less`) : 'Description is required',
      videoFile: videoFile ? '' : 'Video file is required',
      thumbnailFile: thumbnailFile ? '' : 'Thumbnail file is required'
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);
    formData.append('thumbnail', thumbnailFile);

    try {
      handleCloseDialog();
      await dispatch(uploadVideo(formData)).unwrap();

      // Clear the form
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={handleCloseDialog}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Video</h2>
        <form onSubmit={handleUploadVideo}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
              aria-required="true"
              maxLength={maxTitleLength}
            />
            <div className="text-right text-sm text-gray-500">
              {maxTitleLength - title.length} / {maxTitleLength}
            </div>
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
              aria-required="true"
              rows="4"
              maxLength={maxDescriptionLength}
            />
            <div className="text-right text-sm text-gray-500">
              {maxDescriptionLength - description.length} / {maxDescriptionLength}
            </div>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="videoFile" className="block text-gray-700 font-medium mb-2">Video File</label>
            <div
              id="videoDropZone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex items-center justify-center p-3 border ${errors.videoFile ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer`}
            >
              <input
                type="file"
                id="videoFile"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
              <label htmlFor="videoFile" className="text-gray-500">{videoFile ? videoFile.name : 'Drag & drop or click to select a video file'}</label>
            </div>
            {errors.videoFile && <p className="text-red-500 text-sm mt-1">{errors.videoFile}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="thumbnailFile" className="block text-gray-700 font-medium mb-2">Thumbnail File</label>
            <div
              id="thumbnailDropZone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex items-center justify-center p-3 border ${errors.thumbnailFile ? 'border-red-500' : 'border-gray-300'} rounded-lg cursor-pointer`}
            >
              <input
                type="file"
                id="thumbnailFile"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
              <label htmlFor="thumbnailFile" className="text-gray-500">{thumbnailFile ? thumbnailFile.name : 'Drag & drop or click to select a thumbnail file'}</label>
            </div>
            {errors.thumbnailFile && <p className="text-red-500 text-sm mt-1">{errors.thumbnailFile}</p>}
          </div>
          <div className="flex justify-between space-x-4">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
