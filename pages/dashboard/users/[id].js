import { getUserData } from '../../../data/users';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import { useState } from 'react';
import axios from 'axios';

export async function getServerSideProps({ params }) {
  const userDetail = await getUserData(params.id);

  if (!userDetail) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const _target = e.target;
    const name = _target.name.value.trim();
    const id = _target.id.value;

    const cur_password = _target.cur_password.value;
    const news_password = _target.news_password.value;
    const re_password = _target.re_password.value;

    if (!name) {
      setResponseMessage({ isSuccessful: false, message: 'Name is required.' });
      return;
    }

    try {
      const req = await axios({
        method: 'post',
        url: '/api/users/update',
        data: {
          name,
          ['cur_password']: cur_password,
          ['news_password']: news_password,
          ['re_password']: re_password,
          id,
        },
      });

      if (req.status === 200) {
        setResponseMessage({ isSuccessful: true, message: req.data?.message || 'updated' });
      }
    } catch (e) {
      setResponseMessage({
        isSuccessful: false,
        message: e.response?.data?.message || 'Oops something went wrong. Please try again.',
      });
    }
  };

  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Edit User</h2>

          <p className='lead'>{responseMessage.message}</p>

          <form method='post' onSubmit={handleSubmit}>
            <input name="id" type="hidden" defaultValue={userDetail.id} />

            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input className='form-control' name='name' type='text' id='name' defaultValue={userDetail.name} />
            </div>

            <h2 className={utilStyles.headingMd + ' mb-4'}>Change Password</h2>

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

            <button type='submit' value='Submit' className='btn btn-primary'>Save</button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  );
}
