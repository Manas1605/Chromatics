import React, { useState } from 'react';
import './logIn.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    alert('Login successful!');
    setError('');
  };

  const handleResetPassword = () => {
    if (!resetEmail) {
      setResetMessage('Please enter your email address.');
      return;
    }

    // TODO: Connect to backend or Firebase here
    setResetMessage(`A reset link has been sent to ${resetEmail}`);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Your Account</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="forgot-password">
          <span onClick={() => setShowResetModal(true)}>Forgot Password?</span>
        </div>

        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/">Sign Up</a></p>
      </form>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="reset-modal" onClick={e => e.stopPropagation()}>
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button onClick={handleResetPassword}>Send Reset Link</button>
            {resetMessage && <p className="reset-msg">{resetMessage}</p>}
            <button className="close-modal" onClick={() => setShowResetModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
