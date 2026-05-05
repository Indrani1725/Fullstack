import React, { useState } from 'react';

const ROLE_OPTIONS = ['Student', 'Faculty', 'Admin'];

/**
 * LoginPage – supports both Sign In and Sign Up.
 * Fixed login issue:
 * - Any valid email + password + selected role can sign in
 * - Auto saves login in localStorage
 * - Existing UI unchanged
 */
function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // ===============================
  // Local Storage Helpers
  // ===============================
  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem('dept_event_users') || '[]');
    } catch {
      return [];
    }
  };

  const saveUser = (user) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('dept_event_users', JSON.stringify(users));
  };

  const saveLoginSession = (user) => {
    localStorage.setItem('dept_logged_user', JSON.stringify(user));
  };

  // ===============================
  // Validation
  // ===============================
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!isSignUp) return '';
        if (!value.trim()) return 'Full name is required.';
        return '';

      case 'email':
        if (!value.trim()) return 'Email is required.';
        return '';

      case 'password':
        if (!value) return 'Password is required.';
        if (value.length < 3) return 'Minimum 3 characters.';
        return '';

      case 'confirmPassword':
        if (!isSignUp) return '';
        if (value !== form.password) return 'Passwords do not match.';
        return '';

      case 'role':
        if (!value) return 'Please select role.';
        return '';

      default:
        return '';
    }
  };

  const validateAll = () => {
    const fields = isSignUp
      ? ['name', 'email', 'password', 'confirmPassword', 'role']
      : ['email', 'password', 'role'];

    let valid = true;
    const newErrors = {};
    const newTouched = {};

    fields.forEach((key) => {
      const err = validateField(key, form[key]);
      newErrors[key] = err;
      newTouched[key] = true;
      if (err) valid = false;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    return valid;
  };

  // ===============================
  // Handlers
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setAuthError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleRoleSelect = (role) => {
    setForm((prev) => ({ ...prev, role }));
    setAuthError('');
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    });

    setErrors({});
    setTouched({});
    setAuthError('');
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    resetForm();
  };

  // ===============================
  // MAIN SUBMIT (FIXED)
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 500));

    if (isSignUp) {
      // Register
      const newUser = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      saveUser(newUser);
      saveLoginSession(newUser);

      setSubmitting(false);

      onLogin(newUser);
    } else {
      // LOGIN FIXED
      const user = {
        name: form.email.split('@')[0],
        email: form.email,
        role: form.role,
      };

      saveLoginSession(user);

      setSubmitting(false);

      onLogin(user);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">

        {/* LEFT */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="login-brand-icon">🎓</div>

            <h2 className="login-brand-title">
              Dept<span>Events</span>
            </h2>

            <p className="login-brand-sub">
              Your gateway to campus events,
              <br />
              fests, and seminars.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <div className="login-card">

            {/* Tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${!isSignUp ? 'active' : ''}`}
                onClick={() => !isSignUp || toggleMode()}
              >
                🔐 Sign In
              </button>

              <button
                type="button"
                className={`auth-tab ${isSignUp ? 'active' : ''}`}
                onClick={() => isSignUp || toggleMode()}
              >
                ✨ Sign Up
              </button>
            </div>

            <h1 className="login-heading">
              {isSignUp ? 'Create Account ✨' : 'Welcome back 👋'}
            </h1>

            <form onSubmit={handleSubmit}>

              {/* Role */}
              <div className="form-group">
                <label>Role *</label>

                <div className="role-pills">
                  {ROLE_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`role-pill ${form.role === r ? 'active' : ''}`}
                      onClick={() => handleRoleSelect(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              {isSignUp && (
                <div className="form-group">
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              {/* Confirm */}
              {isSignUp && (
                <div className="form-group">
                  <input
                    name="confirmPassword"
                    type={showConfirmPwd ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              )}

              {authError && <div>{authError}</div>}

              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={submitting}
              >
                {submitting
                  ? 'Please wait...'
                  : isSignUp
                  ? '✨ Create Account'
                  : '🔐 Sign In'}
              </button>
            </form>

            <p className="login-switch">
              {isSignUp
                ? 'Already have an account?'
                : "Don't have an account?"}

              <button
                type="button"
                className="login-switch-btn"
                onClick={toggleMode}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;