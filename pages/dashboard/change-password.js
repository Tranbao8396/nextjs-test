import axios from 'axios';
import { useState } from 'react';
import DashboardLayout from '../../components/dashboardlayout';
import utilStyles from '../../styles/module/utils.module.scss';

export default function ChangePasswordPage() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    const form = event.currentTarget;
    const payload = {
      currentPassword: form.currentPassword.value,
      newPassword: form.newPassword.value,
      confirmPassword: form.confirmPassword.value,
    };

    try {
      const response = await axios.post('/api/users/change-password', payload);
      setMessage({ type: 'success', text: response.data?.message || 'password updated' });
      form.reset();
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Unable to update password. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Change Password</h2>
          {message.text && (
            <p className={`alert alert-${message.type}`} role="status" aria-live="polite">
              {message.text}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current password</label>
              <input id="currentPassword" name="currentPassword" type="password" className="form-control" autoComplete="current-password" required />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New password</label>
              <input id="newPassword" name="newPassword" type="password" className="form-control" autoComplete="new-password" minLength={8} required />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm new password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="form-control" autoComplete="new-password" minLength={8} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
}
