import { getUserData } from '../../../data/users';
import Link from 'next/link';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import { useState } from 'react';
import axios from "axios";

export async function getServerSideProps({ params }) {
  const userDetail = await getUserData(params.id);

  if (!userDetail || userDetail.id === undefined) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      userDetail,
    },
  };
}

export default function DashboardPostPage({ userDetail }) {
  const [responseMessage, setResponseMessage] = useState({ isSuccessful: false, message: '' });
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const _target = e.target;
    const name = _target.name.value.trim();
    const password = _target.password.value;
    const id = _target.id.value;
    const roles = _target.roles.value;

    //change_password
    const cur_password = _target.cur_password.value;
    const news_password = _target.news_password.value;
    const re_password = _target.re_password.value;

    if (!name || !roles) {
      setResponseMessage({
        isSuccessful: false,
        message: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      setSubmitting(true);
      const req = await axios({
        method: 'post',
        url: '/api/users/update',
        data: {
          name: name,
          password: password,
          cur_password: cur_password,
          news_password: news_password,
          re_password: re_password,
          id: id,
          roles: roles,
        },
      });

      if (req.status === 200) {
        setResponseMessage({ isSuccessful: true, message: req.data?.message || 'Updated' });
        _target.cur_password.value = '';
        _target.news_password.value = '';
        _target.re_password.value = '';
      }

    } catch (e) {
      setResponseMessage({
        isSuccessful: false,
        message: e.response?.data?.message || 'Oops something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <h2 className={utilStyles.headingLg}>Edit User</h2>
            <Link href='/dashboard/users' className='btn btn-secondary'>Back to Users</Link>
          </div>

          {responseMessage.message && (
            <p className={`lead ${responseMessage.isSuccessful ? 'text-success' : 'text-danger'}`}>
              {responseMessage.message}
            </p>
          )}

          <form method='post' onSubmit={handleSubmit}>
            <input name="id" type="hidden" defaultValue={userDetail.id} />

            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input className='form-control' name='name' type='text' id='name' defaultValue={userDetail.name} required />
            </div>

            <div className='mb-3'>
              <label htmlFor='roles' className='form-label'>Role</label>
              <select className='form-select' name='roles' id='roles' defaultValue={userDetail.roles || 'user'} required>
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
              </select>
            </div>

            <h2 className={`${utilStyles.headingMd} mb-4`}>Change Password</h2>

            <div className='mb-3'>
              <label htmlFor='cur_password' className='form-label'>Current Password</label>
              <input className='form-control' name='cur_password' type='password' id='cur_password'/>
            </div>

            <div className='mb-3'>
              <label htmlFor='news_password' className='form-label'>News Password</label>
              <input className='form-control' name='news_password' type='password' id='news_password'/>
            </div>

            <div className='mb-3'>
              <label htmlFor='re_password' className='form-label'>Retype Password</label>
              <input className='form-control' name='re_password' type='password' id='re_password'/>
            </div>

            <input className='form-control' name='password' type='password' id='password' hidden defaultValue={userDetail.password}/>

            <button type='submit' value='Submit' className='btn btn-primary' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  )
}
