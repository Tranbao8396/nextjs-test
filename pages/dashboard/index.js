import Link from 'next/link';
import DashboardLayout from '../../components/dashboardlayout';
import utilStyles from '../../styles/module/utils.module.scss';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <section className="section-dashboard">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Dashboard</h2>
          <p className='lead'>
            Welcome to Dashboard
          </p>
        </div>
      </section>
    </DashboardLayout>
  )
}