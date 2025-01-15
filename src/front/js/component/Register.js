
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // To handle error or validation messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // TODO: Implement API call for user registration
    // Example:
    // try {
    //   const response = await fetch('YOUR_REGISTER_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       name: formData.name,
    //       email: formData.email,
    //       password: formData.password,
    //     }),
    //   });
    //
    //   const data = await response.json();
    //
    //   if (!response.ok) {
    //     setErrorMessage(data.message || 'Error registering user.');
    //     return;
    //   }
    //
    //   setErrorMessage('');
    //   setSuccessMessage('Registration successful! You can now log in.');
    //
    //   // Clear the form
    //   setFormData({
    //     name: '',
    //     email: '',
    //     password: '',
    //     confirmPassword: '',
    //   });
    //
    //   // Redirect to login after a short delay
    //   setTimeout(() => {
    //     navigate('/login');
    //   }, 2000);
    // } catch (error) {
    //   console.error('Error connecting to the server:', error);
    //   setErrorMessage('Could not connect to the server.');
    // }

    // Placeholder for future implementation
    console.log('Register form submitted:', formData);
    // You can remove the above line when implementing the API call
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Register</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            placeholder="e.g., John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password:
          </label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
      <p className="mt-3">
        Already have an account?{' '}
        <span
          className="text-primary"
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => navigate('/login')}
        >
          Login here
        </span>
      </p>
    </div>
  );
};
