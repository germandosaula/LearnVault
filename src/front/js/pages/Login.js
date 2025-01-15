
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // To handle error or validation messages
  const [errorMessage, setErrorMessage] = useState('');

  // Update state as the user types in the inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Basic validations and form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!formData.email || !formData.password) {
      setErrorMessage('All fields are required.');
      return;
    }

    // TODO: Implement API call for user login
    // Example:
    // try {
    //   const response = await fetch('YOUR_LOGIN_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email: formData.email,
    //       password: formData.password,
    //     }),
    //   });
    //
    //   const data = await response.json();
    //
    //   if (!response.ok) {
    //     setErrorMessage(data.message || 'Error logging in.');
    //     return;
    //   }
    //
    //   // Save token and redirect
    //   localStorage.setItem('token', data.token);
    //   navigate('/dashboard');
    // } catch (error) {
    //   console.error('Error connecting to the server:', error);
    //   setErrorMessage('Could not connect to the server.');
    // }

    // Placeholder for future implementation
    console.log('Login form submitted:', formData);
    // You can remove the above line when implementing the API call
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Login</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address:
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            placeholder="e.g., user@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
      <p className="mt-3">
        Don't have an account?{' '}
        <span
          className="text-primary"
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => navigate('/register')}
        >
          Register here
        </span>
      </p>
    </div>
  );
};
