import { getAllPostSlug, getPostData } from '../../../data/posts';
import Link from 'next/link';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import { useState } from 'react';
import axios from "axios";

export async function getServerSidePaths() {
  const paths = await getAllPostSlug();
  return {
    paths,
    fallback: false,
  };
}

export async function getServerSideProps({ params }) {
  const postDetail = await getPostData(params.slug);
  return {
    props: {
      postDetail,
    },
  };
}

export default function DashboardPostPage({ postDetail }) {
  const [responseMessage, setResponseMessage] = useState({ isSuccessful: false, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const _target = e.target;
    const title = _target.title.value;
    const content = _target.content.value;
    const id = _target.id.value;

    try {
      const req = await axios({
        method: 'post',
        url: '/api/posts/update',
        data: {
          title: title,
          content: content,
          id: id,
        },
      });

      if (req.status === 200) {
        setResponseMessage({ isSuccessful: true, message: 'Updated' });
      }

    } catch (e) {
      setResponseMessage({
        isSuccessful: false,
        message: 'Oops something went wrong. Please try again.',
      });
    }
  }

  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Edit Post</h2>

          <p className='lead'>{responseMessage.message}</p>

          <form method='post' onSubmit={handleSubmit}>
            <input name="id" type="hidden" defaultValue={postDetail.id} />

            <div className='mb-3'>
              <label htmlFor='title' className='form-label'>Title</label>
              <input className='form-control' name='title' type='title' id='title' defaultValue={postDetail.title} />
            </div>

            <div className='mb-3'>
              <label htmlFor='content' className='form-label'>Content</label>
              <textarea className='form-control' name='content' type='content' id='content' defaultValue={postDetail.content} />
            </div>

            <button type='submit' value='Submit' className='btn btn-primary'>Save</button>
          </form>
        </div>
      </section>
    </DashboardLayout>
  )
}