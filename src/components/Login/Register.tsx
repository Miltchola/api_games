import React, { useState } from 'react';
import './Register.css';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validação básica
      if (!formData.username || !formData.email || !formData.password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (formData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Substitua pela chamada real à sua API
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao registrar');
      }

      setSuccess(true);
      console.log('Registro bem-sucedido');
      
      // Redirecionar para login após registro
      // setTimeout(() => { window.location.href = '/login'; }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h1 className="register-title">Create Account</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Registration successful! Redirecting to login...
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            type="text"
            id="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={20}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          <small className="password-hint">(Minimum 6 characters)</small>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading || success}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <div className="register-footer">
          <p>Already have an account? <a href="/login" className="login-link">Login here</a></p>
        </div>
      </form>
    </div>
  );
};

export default Register;