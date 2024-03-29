import Head from 'next/head';
import Image from 'next/image';
import Header from './header';
import Footer from './footer';
import styles from '../styles/module/layout.module.scss';
import utilStyles from '../styles/module/utils.module.scss';
import Link from 'next/link';

const name = 'Bao';
export const siteTitle = 'Next.js Sample Website';

export default function Layout({ children, page }) {
  return (
    <>
      <Header page = {page} />
      <div className={styles.container}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Learn how to build a personal website using Next.js"
          />
          <meta
            property="og:image"
            content={`https://og-image.vercel.app/${encodeURI(
              siteTitle,
            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>

        <header className={styles.header}>
          {page === 'home' ? (
            <>
              <Image
                priority
                src="/images/profile.jpg"
                className={utilStyles.borderCircle}
                height={144}
                width={144}
                alt=""
              />
              <h2 className={utilStyles.heading2Xl}>{name}</h2>
            </>
          ):''}
        </header>

        <main>{children}</main>

        {page !== 'home' && (
          <div className={styles.backToHome}>
            <Link href="/">← Back to home</Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
