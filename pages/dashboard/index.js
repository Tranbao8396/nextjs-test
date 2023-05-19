import Layout from '../../components/layout';
import utilStyles from '../../styles/module/utils.module.scss';

export default function DashboardPage() {
  return (
    <Layout page='dashboard-page'>
      <section className={utilStyles.headingMd}>
        <p>Dashboard</p>
      </section>
    </Layout>
  )
}