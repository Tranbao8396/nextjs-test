import Link from 'next/link';
import Styles from '../styles/module/dashboard.module.scss';
import DashboardMenu from '../components/dashboardmenu';
import DashboardHeader from '../components/dashboardheader';
import Footer from '../components/footer';

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="d-flex">
        <DashboardMenu />

        <div className={Styles.main_content}>
          <DashboardHeader />

          <main className="block">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}