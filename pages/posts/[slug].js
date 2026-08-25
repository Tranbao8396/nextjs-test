import Layout from '../../components/layout';
import Head from 'next/head';
import { getPostData } from '../../data/posts';
import { sanitizePostContent } from '../../lib/server/postContent';
import utilStyles from '../../styles/module/utils.module.scss';

export async function getServerSideProps({ params }) {
  try {
    const postDetail = await getPostData(params.slug);
    return {
      props: {
        postDetail: {
          ...postDetail,
          content: sanitizePostContent(postDetail.content),
        },
      },
    };
  } catch (error) {
    if (error?.status === 404) return { notFound: true };
    throw error;
  }
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
