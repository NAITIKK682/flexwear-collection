import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const RegisterForm = ({ redirect }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (!termsAccepted) {
      toast.error('You must accept terms');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // ✅ FIXED: send object instead of separate params
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      toast.success('Account created successfully!');
      navigate(redirect || '/profile', { replace: true });

    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* NAME */}
<input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* EMAIL */}
<input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* PASSWORD */}
<div className="relative">
  <input
    name="password"
    type={showPassword ? "text" : "password"}
    value={formData.password}
    onChange={handleChange}
    placeholder="Password"
    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
  <button 
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>



      {/* CONFIRM PASSWORD */}
<div className="relative">
  <input
    name="confirmPassword"
    type={showConfirmPassword ? "text" : "password"}
    value={formData.confirmPassword}
    onChange={handleChange}
    placeholder="Confirm Password"
    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
  <button 
    type="button"
    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? "Hide" : "Show"}
  </button>
</div>



      {/* TERMS */}
<div className="flex items-center gap-2">
  <input
    type="checkbox"
    id="terms"
    checked={termsAccepted}
    onChange={(e) => setTermsAccepted(e.target.checked)}
    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500 focus:ring-2"
  />
  <label htmlFor="terms" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
    I accept Terms
  </label>
</div>

      {/* SUBMIT */}
<button 
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out mt-4 block"
>
  {loading ? "Creating..." : "Create Account"}
</button>

      {/* LOGIN LINK FIXED */}
<p className="text-center text-sm mt-6">
  Already have account?{" "}
  <Link to="/auth" className="font-medium text-blue-600 hover:text-blue-500">
    Login here
  </Link>
</p>

    </form>
  );
};

export default RegisterForm;