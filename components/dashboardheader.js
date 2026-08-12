import styles from "../styles/module/header.module.scss";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function DashboardHeader() {
  const { data: session } = useSession();
  
  return (
    <div className={styles.menu}>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <h1 className={styles.navbar_logo}>Navbar</h1>
          </Link>

          {session ? (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-primary" href="/dashboard/change-password">Change Password</Link>
              <button className="btn btn-secondary" onClick={() => signOut()}>Logout</button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => signIn()}>Login</button>
          )}
        </div>
      </nav>
    </div>
  )
};