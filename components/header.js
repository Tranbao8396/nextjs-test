import Styles from "../styles/module/header.module.scss";
import Link from "next/link";

export default function Header() {
  return (
    <div className="main-header">
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            <h1 className="mb-0 h1">Navbar</h1>
          </Link>
        </div>
      </nav>
    </div>
  )
};