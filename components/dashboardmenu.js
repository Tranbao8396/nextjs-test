import Link from 'next/link';
import Styles from '../styles/module/dashboard.module.scss';
import { useState } from 'react';
import Image from 'next/image';

export default function DashboardMenu() {

  const [isActive, setActive] = useState("true");

  const handletoggle = () => {
    setActive(!isActive);
  }

  return (
    <div className={`${Styles.dashboard_menu} ${isActive ? `${Styles.collapsed}` : ""}`}>
      <button className={`${Styles.menu_toggler} ${isActive ? `${Styles.collapsed}` : ""}`} onClick={handletoggle}>
        <span className={Styles.menu_toggler_icon}></span>
        <span className={Styles.menu_toggler_icon}></span>
      </button>

      <ul className='navbar-nav mt-4'>
        <li className={`${Styles.nav_hover} nav-item`}>
          <Link className="nav-link" href="/dashboard/posts">
            <Image className={isActive ? `${Styles.img_hide}` : ""} src="/images/post.svg" width={20} height={20} alt='Posts' />
            <span className={`${Styles.nav_text}  ${isActive ? "" : `${Styles.nav_text_hide}`}`}>Posts</span>
          </Link>

          <ul className={Styles.nav_hover_menu}>
            <li>
              <Link href="/dashboard/posts">All Posts</Link>
            </li>

            <li>
              <Link href="/dashboard/posts/add-post">Add New</Link>
            </li>
          </ul>
        </li>

        <li className={`${Styles.nav_hover} nav-item`}>
          <Link className="nav-link" href="/dashboard/users">
            <Image className={isActive ? `${Styles.img_hide}` : ""} src="/images/users.svg" width={20} height={20} alt='Users' />
            <span className={`${Styles.nav_text}  ${isActive ? "" : `${Styles.nav_text_hide}`}`}>User</span>
          </Link>

          <ul className={Styles.nav_hover_menu}>
            <li>
              <Link href="/dashboard/users">All Users</Link>
            </li>

            <li>
              <Link href="/dashboard/users/add-user">Add New</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}