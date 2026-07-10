import axios from 'axios';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [responseValid, setResponseValid] = useState({ isValid: false, message: '' });
  const [isSubmitting, setSubmitting] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const body = e.target;
    const name = body.name.value.trim();
    const password = body.password.value;
    const role = body.roles.value;

    let valid = true;

    if (!name) {
      valid = false;
    }

    if (!password) {
      valid = false;
    }

    if (!role) {
      valid = false;
    }

    if (!valid) {
      setResponseValid({
        isSuccessful: false,
        message: 'Please fill in all required fields.',
      });
      return;
    }

    if (valid) {
      setSubmitting(true);
      try {
        const req = await axios({
          method: 'post',
          url: '/api/users/create',
          data: {
            name: name,
            password: password,
            roles: role,
          },
        })

        if (req.status === 200) {
          setResponseValid({
            isSuccessful: true,
            message: 'Created',
          });
          body.reset();
        }
      } catch (e) {
        setResponseValid({
          isSuccessful: false,
          message: e.response?.data?.message || 'Oops something went wrong. Please try again.',
        });
      } finally {
        setSubmitting(false);
      }
    }
  }
  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h2 className={utilStyles.headingLg}>Create User</h2>
            <Link href='/dashboard/users' className='btn btn-secondary'>Back to Users</Link>
          </div>

          {responseValid.message && (
            <p className={`lead ${responseValid.isSuccessful ? 'text-success' : 'text-danger'}`}>
              {responseValid.message}
            </p>
          )}

          <form method='post' onSubmit={handlesubmit}>
            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input className='form-control' name='name' type='text' id='name' required />
            </div>

            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>Password</label>
              <input className='form-control' name='password' type='password' id='password' required />
            </div>

            <div className='mb-3'>
              <label htmlFor='roles' className='form-label'>Role</label>
              <select className='form-select' name='roles' id='roles' defaultValue='user' required>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
            </div>

            <button type='submit' value='Submit' className='btn btn-primary' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  )
}
