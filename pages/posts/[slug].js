import Layout from '../../components/layout';
import Head from 'next/head';
import { getAllPostSlug, getPostData } from '../../data/posts';
import utilStyles from '../../styles/module/utils.module.scss';

export async function getServerSidePaths() {
  const paths = await getAllPostSlug();
  return {
    paths,
    fallback: false,
  };
}

export async function getServerSideProps({ params }) {
  const postDetail = await getPostData(params.slug);
  return {
    props: {
      postDetail,
    },
  };
}

export default function Post({ postDetail }) {
  return (
    <Layout>
      <Head>
        <title>{postDetail.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postDetail.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postDetail.content }} />
      </article>
    </Layout>
  );
}