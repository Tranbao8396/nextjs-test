import axios from 'axios';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import { useState } from 'react';

export default function DashboardPage() {
  const [responseValid, setResponseValid] = useState({ isValid: false, message: '' });

  const handlesubmit = async (e) => {
    e.preventDefault();
    const body = e.target;
    const name = body.name.value;
    const password = body.password.value;

    let valid = true;

    if (!name) {
      valid = false;
    }

    if (!password) {
      valid = false;
    }

    if (valid) {
      try {
        const req = await axios({
          method: 'post',
          url: '/api/users/create',
          data: {
            name: name,
            password: password,
          },
        })

        if (req.status === 200) {
          setResponseValid({
            isSuccessful: true,
            message: 'Created',
          });
        }
      } catch (e) {
        setResponseValid({
          isSuccessful: false,
          message: 'Oops something went wrong. Please try again.',
        });
      }
    }
  }
  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Add New</h2>

          <p className='lead'>{responseValid.message}</p>

          <form method='post' onSubmit={handlesubmit}>
            <div className='mb-3'>
              <label htmlFor='name' className='form-label'>Name</label>
              <input className='form-control' name='name' type='text' id='name' />
            </div>

            <div className='mb-3'>
              <label htmlFor='password' className='form-label'>Password</label>
              <input className='form-control' name='password' type='password' id='password' />
            </div>

            <button type='submit' value='Submit' className='btn btn-primary'>Save</button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  )
}