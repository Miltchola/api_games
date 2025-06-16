import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserAccount.css';
import placeholderImg from '../../../public/placeholder-user-photo.jpg';

const API_URL = import.meta.env.VITE_API_URL;

interface UserData {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  bio: string;
  profilePicture: string;
}

//const placeholderImg = 'https://via.placeholder.com/150?text=Profile';

const UserAccount: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: '',
    profilePicture: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (!token || !username) {
          navigate('/login');
          return;
        }

        // Para buscar dados do usuário (no useEffect)
        const response = await fetch(`${API_URL}/users/${encodeURIComponent(username)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to load user data');
        }

        const data = await response.json();
        setUserData(prev => ({
          ...prev,
          username: data.username,
          email: data.email,
          bio: data.bio || '',
          profilePicture: data.profilePicture || ''
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setUserData(prev => ({
      ...prev,
      profilePicture: ''
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess(null);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSuccess(null);
    setError(null);
    setUserData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    console.log("submit triggered");

    if (!isEditing) {
      console.warn("Ignorando envio porque não está em modo de edição");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Atualiza bio e profilePicture
      const response = await fetch(`${API_URL}/users/${encodeURIComponent(userData.username)}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bio: userData.bio,
          profilePicture: userData.profilePicture
        })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setUserData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-account-container">
      <h1>My Account</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="user-account-form">
        <div className="profile-picture-section">
          <img
            src={userData.profilePicture || placeholderImg}
            alt="Profile"
            width={150}
            height={150}
            style={{ borderRadius: '50%' }}
          />
          {isEditing && (
            <div className="photo-actions">
              <label className="choose-photo-btn">
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoChange}
                />
              </label>
              <button type="button" className="remove-photo-btn" onClick={handleRemovePhoto}>
                Remove Photo
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            disabled
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            disabled
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          {isEditing ? (
            <textarea
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleChange}
              rows={3}
              className="bio-textarea"
              placeholder="Tell us about yourself"
            />
          ) : (
            <div className="bio-view">{userData.bio || <i>No bio provided.</i>}</div>
          )}
        </div>

        {isEditing && (
          <>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={userData.currentPassword}
                onChange={handleChange}
                className="password-input"
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={userData.newPassword}
                onChange={handleChange}
                className="password-input"
                placeholder="Enter a new password"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                className="password-input"
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
            </div>
          </>
        )}

        <div className="form-actions">
          {isEditing ? (
            <>
              <button type="button" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
            </>
          ) : (
            <button type="button" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserAccount;