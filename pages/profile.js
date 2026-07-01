import Layout from '../components/layout';
import utilStyles from '../styles/module/utils.module.scss';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch('/api/users/profile');
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
      } else {
        setMessage(data.message || 'Could not load profile.');
      }
    }

    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const currentPassword = form.currentPassword?.value || '';
    const newPassword = form.newPassword?.value || '';
    const confirmPassword = form.confirmPassword?.value || '';

    setMessage('');

    if (!name) {
      setMessage('Name is required.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setMessage('Confirm password does not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, currentPassword, newPassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Profile update failed.');
        return;
      }

      setProfile(data.user);
      setMessage(data.readOnlyPassword ? 'Profile updated. Password is read-only for this account.' : 'Profile updated.');
      form.currentPassword.value = '';
      form.newPassword.value = '';
      form.confirmPassword.value = '';
    } catch (error) {
      setMessage('Profile update failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCredentialsAccount = (profile?.provider || session?.user?.provider) === 'credentials';

  return (
    <Layout page='profile-page'>
      <section className='block'>
        <div className='container'>
          <h2 className={utilStyles.headingLg}>Profile</h2>

          {!!message && <p className='mb-3 badge text-bg-info'>{message}</p>}

          {profile ? (
            <form method='post' onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>Name</label>
                <input id='name' name='name' className='form-control' type='text' defaultValue={profile.name || ''} />
              </div>

              <div className='mb-3'>
                <label className='form-label'>Email</label>
                <input className='form-control' type='email' value={profile.email || ''} disabled readOnly />
              </div>

              <div className='mb-3'>
                <label className='form-label'>Provider</label>
                <input className='form-control' type='text' value={profile.provider || 'credentials'} disabled readOnly />
              </div>

              <h3 className={`${utilStyles.headingMd} mb-4`}>Change Password</h3>

              {!isCredentialsAccount && (
                <p className='alert alert-secondary'>Password changes are not available for Google accounts.</p>
              )}

              <div className='mb-3'>
                <label htmlFor='currentPassword' className='form-label'>Current Password</label>
                <input id='currentPassword' name='currentPassword' className='form-control' type='password' disabled={!isCredentialsAccount} />
              </div>

              <div className='mb-3'>
                <label htmlFor='newPassword' className='form-label'>New Password</label>
                <input id='newPassword' name='newPassword' className='form-control' type='password' disabled={!isCredentialsAccount} />
              </div>

              <div className='mb-3'>
                <label htmlFor='confirmPassword' className='form-label'>Confirm New Password</label>
                <input id='confirmPassword' name='confirmPassword' className='form-control' type='password' disabled={!isCredentialsAccount} />
              </div>

              <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save profile'}
              </button>
              <button type='button' className='btn btn-secondary ms-2' onClick={() => signOut({ callbackUrl: '/' })}>
                Logout
              </button>
            </form>
          ) : (
            <p className='lead'>Loading profile...</p>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: `/login?callbackUrl=${encodeURIComponent('/profile')}`,
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
