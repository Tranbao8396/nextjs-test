import axios from 'axios';
import { useState } from 'react';
import DashboardLayout from '../../components/dashboardlayout';
import utilStyles from '../../styles/module/utils.module.scss';

const initialMessage = { type: '', text: '' };

export default function ChangePasswordPage() {
  const [message, setMessage] = useState(initialMessage);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'New password and confirmation do not match.' });
      return;
    }

    setSubmitting(true);
    setMessage(initialMessage);
    try {
      const response = await axios.post('/api/users/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      form.reset();
      setMessage({ type: 'success', text: response.data?.message || 'Password changed successfully.' });
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Unable to change password. Please try again.',
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
          {message.text ? <div className={`alert alert-${message.type}`} role="alert">{message.text}</div> : null}
          <form method="post" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input className="form-control" name="currentPassword" type="password" id="currentPassword" autoComplete="current-password" required />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input className="form-control" name="newPassword" type="password" id="newPassword" autoComplete="new-password" minLength={8} required />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input className="form-control" name="confirmPassword" type="password" id="confirmPassword" autoComplete="new-password" minLength={8} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Change Password'}
            </button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
}
