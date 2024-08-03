import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import FileInput from '../components/FileInput';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import ErrorDialog from '../components/ErrorDialog';
import SuccessDialog from '../components/SuccessDialog';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { getCurrentUser, logout } from '../features/UserSlice';
const UserSettings = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [activeTab, setActiveTab] = useState('branding');
  const [coverImage, setCoverImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(user?.fullname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [about, setAbout] = useState(user?.about || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(user?.avatar || null);
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState(user?.coverImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);



  const maxLength = 500;
  const handleCoverImageChange = (file) => {
    const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const maxSize = 6 * 1024 * 1024; // 6MB

    if (!fileTypes.includes(file.type)) {
      setError('Only PNG, JPG, and JPEG files are allowed');
      return;
    }

    if (file.size > maxSize) {
      setError('File size should not exceed 8MB');
      return;
    }

    setCoverImagePreviewUrl(URL.createObjectURL(file));
    setCoverImage(file);
    setError(null);
  };

  const handleAvatarChange = (file) => {
    const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    const maxSize = 4 * 1024 * 1024; // 4MB

    if (!fileTypes.includes(file.type)) {
      setError('Only PNG, JPG, and JPEG files are allowed');
      return;
    }

    if (file.size > maxSize) {
      setError('File size should not exceed 8MB');
      return;
    }

    setAvatarPreviewUrl(URL.createObjectURL(file));
    setAvatar(file);
    setError(null);
  };

  const handleCoverImageSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('coverImage', coverImage);

      const response = await axiosInstance.patch('/users/coverImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setSuccess('Cover image updated successfully!');
    } catch (error) {
      console.error('Error updating cover image:', error.message || 'Something went wrong');
      setError('Failed to update cover image.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('avatar', avatar);

      const response = await axiosInstance.patch('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setSuccess('Avatar updated successfully!');
    } catch (error) {
      console.error('Error updating avatar:', error.message || 'Something went wrong');
      setError('Failed to update avatar.');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosInstance.post('/users/change-password', { oldPassword, newPassword });

      setSuccess('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error.message || 'Something went wrong');
      setError('Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosInstance.delete('/users/delete-account');
      setSuccess('Account deleted successfully!');
      setShowConfirmationDialog(false);
      setTimeout(() => {
        dispatch(logout());
      }, 2000);
      
    } catch (error) {
      console.error('Error deleting account:', error.message || 'Something went wrong');
      setError('Failed to delete account.');
    } finally {
      setLoading(false);
    }
  };

  const handleInfoSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosInstance.patch('/users/update-account', { fullname: name, email, about });
      setSuccess('Account details updated successfully!');
    } catch (error) {
      console.error('Error updating account details:', error.message || 'Something went wrong');
      setError('Failed to update account details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setCoverImagePreviewUrl(user.coverImage || null);
      setAvatarPreviewUrl(user.avatar || null);
      setName(user.fullname || '');
      setEmail(user.email || '');
    }
    
  }, [user]);

  // set new user's avatar in redux store so that it can be displayed in the nav
  useEffect(() => {
    if (success) {
      dispatch(getCurrentUser());
    }
  }, [success, dispatch ]);

  return (
    <div className="p-6">
      <div className="flex justify-around border-b mb-3">
        <button
          className={`py-2 px-4 border-b-2 ${activeTab === 'branding' ? 'border-blue-500' : 'border-transparent'} hover:border-blue-500`}
          onClick={() => setActiveTab('branding')}
        >
          Branding
        </button>
        <button
          className={`py-2 px-4 border-b-2 ${activeTab === 'basicInfo' ? 'border-blue-500' : 'border-transparent'} hover:border-blue-500'}`}
          onClick={() => setActiveTab('basicInfo')}
        >
          Basic Info
        </button>
        <button
          className={`py-2 px-4 border-b-2 ${activeTab === 'security' ? 'border-blue-500' : 'border-transparent'} hover:border-blue-500}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {error && setTimeout(() => setError(null), 2000) && <ErrorDialog message={error} />}
      {success && setTimeout(() => setSuccess(null), 2000) && <SuccessDialog message={success} />}

      {activeTab === 'branding' && (
        <div>
          <div className="mb-6 flex gap-4 items-center">
            <FileInput
              label="Change Cover Image"
              onFileChange={handleCoverImageChange}
              previewUrl={coverImagePreviewUrl}
              type={'cover'}
            />
            <button
              onClick={handleCoverImageSubmit}
              className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Update Cover Image
            </button>
          </div>

          <div className="mb-6 flex gap-4 items-center">
            <FileInput
              label="Change Avatar"
              onFileChange={handleAvatarChange}
              previewUrl={avatarPreviewUrl}
              type={'avatar'}
            />
            <button
              onClick={handleAvatarSubmit}
              className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Update Avatar
            </button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div>
          <form onSubmit={handleSecuritySubmit}>
            <div className="mb-6">
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg w-1/2 px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg w-1/2 px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Change Password
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Delete Account</h2>
              <button
                type="button"
                onClick={() => setShowConfirmationDialog(true)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'basicInfo' && (
        <div className="mb-6">
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg w-1/2 px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg w-1/2 px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">About</label>
           
            <div>
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        maxLength={maxLength}
        className="border border-gray-300 rounded-lg w-1/2 px-3 py-2"
        placeholder="Tell us about yourself"
      />
      <div className="mt-2 text-gray-600">
        {about.length} / {maxLength}
      </div>
    </div>

          </div>
          <button
            onClick={handleInfoSubmit}
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
          >
            Update Info
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Spinner loading={loading} />
        </div>
      )}

      {showConfirmationDialog && (
        <ConfirmationDialog
          message="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={handleAccountDelete}
          onCancel={() => setShowConfirmationDialog(false)}
        />
      )}

      {error && <ErrorDialog message={error} />}
      {success && <SuccessDialog message={success} />}
    </div>
  );
};

export default UserSettings;
