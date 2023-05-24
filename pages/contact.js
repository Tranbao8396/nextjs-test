import { useState } from 'react';
import Layout from '../components/layout';
import utilStyles from '../styles/module/utils.module.scss';
import axios from "axios";

export default function ContactPage() {
  const [responseMessage, setResponseMessage] = useState({ isSuccessful: false, message: '' });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const _target = e.target;
    const email = _target.email.value;
    const subject = _target.subject.value;
    const message = _target.message.value;

    let valid = true

    if (!email) {
      valid = false;
    }

    if (!subject) {
      valid = false;
    }

    if (!message) {
      valid = false;
    }

    if (valid) {
      try {
        const req = await axios({
          method: 'post',
          url: '/api/send-email',
          data: {
            email: email,
            subject: subject,
            message: message,
          },
        });

        if (req.status === 200) {
          setResponseMessage({ isSuccessful: true, message: 'Thank you for your message.' });
        }

      } catch (e) {
        setResponseMessage({
          isSuccessful: false,
          message: 'Oops something went wrong. Please try again.',
        });
      }
    }
  }

  return (
    <Layout page='contact-page'>
      <section className="block">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Contact</h2>

          <form method='post' onSubmit={handleSubmit} action='/api/send-email'>
            <p className='badge text-bg-secondary'>{responseMessage.message}</p>

            <div className='mb-3'>
              <label htmlFor='email' className='form-label'>Email</label>
              <input className='form-control' name='email' type='email' id='email' />
            </div>

            <div className='mb-3'>
              <label htmlFor='subject' className='form-label'>Subject</label>
              <input className='form-control' name='subject' type='text' id='subject' />
            </div>

            <div className='mb-3'>
              <label htmlFor='message' className='form-label'>Message</label>
              <textarea className="form-control" name='message' id='message' />
            </div>

            <button type='submit' value='Submit' className='btn btn-primary'>Send</button>
          </form>
        </div>
      </section>
    </Layout>
  )
}