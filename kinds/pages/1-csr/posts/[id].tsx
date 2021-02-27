import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Next.js supports pages with dynamic routes.

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default function CSRPostsId() {
  const router = useRouter();
  const postId = router.query.id;
  const [post, setPost] = useState<Post>();
  console.log(post);
  
  // 第二引数のpostIdが変化した時にコールバック関数が呼ばれる
  useEffect(() => {
    async function fetchPost() {
      if (postId) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        const post = (await res.json()) as Post;
        setPost(post);
      }
    }
    console.log("postId:", postId);
    
    fetchPost();
  }, [postId]);

  // post(fetchで取ってきた値がundefinedで有る限り)
  if (!post) {
    return <p>読込中...</p>;
  }

  return (
    <div>
      <Head>
        <title>CSRの解説用ページ（詳細）</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>CSR</h1>
        <div>
          <p>Post ID:
             {post.id}</p>
          <p>User ID: {post.userId}</p>
          <p>Title: {post.title}</p>
          <p>Body: {post.body}</p>
        </div>
      </main>
    </div>
  );
}