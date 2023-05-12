import Layout from "../../components/layout";
import Link from "next/link";
import utilStyles from '../../styles/module/utils.module.scss';
import { getSortedPostsData } from '../../data/posts';

export default function PostPage({allPostsData}) {
  return (
    <Layout page='posts-page' >
      <section className="block">
        <div className="container">
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map((post) => (
              <li className={utilStyles.listItem} key={post.id}>
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export async function getServerSideProps() {
  const allPostsData = await getSortedPostsData();
  return {
    props: {
      allPostsData,
    }
  }
}