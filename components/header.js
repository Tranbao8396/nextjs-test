import styles from "../styles/module/header.module.scss";
import Link from "next/link";
import { clsx } from 'clsx';

export default function Header( { page } ) {
  return (
    <div className={styles.menu}>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <h1 className={styles.navbar_logo}>Navbar</h1>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${clsx({"active": page === 'home',})}`} href="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${clsx({"active": page === 'posts-page',})}`} href="/posts">Post Page</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
};