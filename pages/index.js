import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/module/utils.module.scss';
import Formvalidation from '../validation/form';

export default function Home() {
  return (
    <Layout page='home'>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <section className={utilStyles.headingMd}>
        <p>Home Page</p>
        <br />
        <p>
          (This is a sample website - you’ll be building a site like this on<br />
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </Layout>
  )
};