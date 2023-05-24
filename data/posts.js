export async function getSortedPostsData() {
  const res = await fetch('http://localhost:3001/courses');
  return res.json();
}

export async function getAllPostSlug() {
  const res = await fetch('http://localhost:3001/courses');
  const posts = await res.json();
  return posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });
}

export async function getPostData(slug) {
  const res = await fetch(`http://localhost:3001/courses/${slug}`);
  return res.json();
}
