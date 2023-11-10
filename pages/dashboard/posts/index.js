import Link from 'next/link';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import { getSortedPostsData } from '../../../data/posts';
import axios from 'axios';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    }
  }
}

export default function DashboardPostPage({ allPostsData }) {
  const router = useRouter();

  const handledelete = async (e) => {
    e.preventDefault();
    const req = await axios({
      method: 'delete',
      url: `/api/posts/delete/${e.target.id}`,
    })

    if (req.status === 200) {
      router.reload();
    }
  }

  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <h2 className={utilStyles.headingLg}>All posts</h2>

          <div className='table-responsive'>
            <table className='table table-striped table-bordered'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Handle</th>
                </tr>
              </thead>

              <tbody>
                {allPostsData.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.title}</td>
                    <td>
                      <Link href={`/dashboard/posts/${post.slug}`} className='btn btn-primary'>Edit</Link>
                      <Link href='#' id={post.id} className='ms-1 btn btn-secondary' onClick={handledelete}>Delete</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardLayout>
  )
}