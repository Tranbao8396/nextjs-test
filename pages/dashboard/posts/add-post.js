import axios from 'axios';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import { useState } from 'react';

export default function DashboardPage() {
  const [responseValid, setResponseValid] = useState({ isValid: false, message: '' });

  const handlesubmit = async(e) => {
    e.preventDefault();
    const body = e.target;
    const title = body.title.value;
    const author = body.author.value;
    const url = body.url.value;
    let slug = body.slug.value;
    const content = body.content.value;

    let valid = true;

    if (!title) {
      valid = false;
    }

    if (title) {
      slug = title.replace(/\s+/g, '-').toLowerCase()
      body.slug.value = slug;
    }

    if (!author) {
      valid = false;
    }

    if (!url) {
      valid = false;
    }

    if (!slug) {
      valid = false;
    }

    if (!content) {
      valid = false;
    }

    if (valid) {
      try {
        const req = await axios({
          method: 'post',
          url: '/api/posts/create',
          data: {
            title: title,
            author: author,
            url: url,
            slug: slug,
            content: content,
          },
        })

        if (req.status === 200 ) {
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
              <label htmlFor='title' className='form-label'>Title</label>
              <input className='form-control' name='title' type='text' id='title'/>
            </div>

            <div className='mb-3'>
              <label htmlFor='author' className='form-label'>Author</label>
              <input className='form-control' name='author' type='text' id='author'/>
            </div>

            <div className='mb-3'>
              <label htmlFor='url' className='form-label'>URL</label>
              <input className='form-control' name='url' type='text' id='url'/>
            </div>

            <div className='mb-3'>
              <label htmlFor='slug' className='form-label'>Slug</label>
              <input className='form-control' name='slug' type='text' id='slug'/>
            </div>

            <div className='mb-3'>
              <label htmlFor='content' className='form-label'>Content</label>
              <textarea className='form-control' name='content' id='content'/>
            </div>

            <button type='submit' value='Submit' className='btn btn-primary'>Save</button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  )
}