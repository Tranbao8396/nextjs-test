import Link from 'next/link';
import DashboardLayout from '../../../components/dashboardlayout';
import utilStyles from '../../../styles/module/utils.module.scss';
import axios from 'axios';
import { getAllUsersData } from '../../../data/users';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  const allUsersData = await getAllUsersData();
  return {
    props: {
      allUsersData,
    }
  }
}

export default function UserPages({ allUsersData }) {
  const router = useRouter();
  const handledelete = async (e) => {
    e.preventDefault();
    console.log(e.target.id);

    const req = await axios({
      method: 'delete',
      url: `/api/users/delete/${e.target.id}`,
    })

    if (req.status === 200) {
      router.reload();
    }
  }

  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <h2 className={utilStyles.headingLg}>All Users</h2>

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
                {allUsersData.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <Link href={`/dashboard/users/${user.id}`} className='btn btn-primary'>Edit/View</Link>
                      <Link href='#' id={user.id} className='ms-1 btn btn-secondary' onClick={handledelete}>Delete</Link>
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