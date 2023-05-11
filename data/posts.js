export async function getSortedPostsData() {
  const res = await fetch('http://localhost:3000/api/hello');
  return res.json();
}

export async function getAllPostSlug() {
  const res = await fetch('http://localhost:3000/api/hello');
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
  const res = await fetch('http://localhost:3000/api/hello');
  const posts = await res.json();
  let postDetail = [];
  posts.map((post) => {
    if (post.slug === slug) {
      postDetail = {
        content: post.content,
        title: post.title,
      }
    };
  });

  return postDetail;
}