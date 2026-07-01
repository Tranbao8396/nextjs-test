import Layout from '../components/layout';
import utilStyles from '../styles/module/utils.module.scss';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace('/profile');
    }
  }, [router, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    setMessage('');

    if (!name || !password) {
      setMessage('Please enter a name and password.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Confirm password does not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Registration failed.');
        return;
      }

      const result = await signIn('credentials', {
        name,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push('/login');
        return;
      }

      router.push('/profile');
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (session) {
    return null;
  }

  return (
    <Layout page='register-page'>
      <section className="block">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Register</h2>

          {!!message && <p className='mb-3 badge text-bg-danger'>{message}</p>}

          <form method='post' onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input id='name' name='name' className='form-control' type='text' autoComplete='username' />
            </div>

            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>Password</label>
              <input id='password' name='password' type='password' className='form-control' autoComplete='new-password' />
            </div>

            <div className='mb-3'>
              <label htmlFor='confirmPassword' className='form-label'>Confirm Password</label>
              <input id='confirmPassword' name='confirmPassword' type='password' className='form-control' autoComplete='new-password' />
            </div>

            <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <p className='mt-3'>
            Already have an account? <Link href='/login'>Login</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
