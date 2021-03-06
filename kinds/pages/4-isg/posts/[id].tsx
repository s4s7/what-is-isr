import Head from 'next/head';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPaths,
  GetStaticPathsContext,
} from 'next';

// pages/ISG/posts/[id].tsxと共通するコードが複数あるが
// 解説が1ファイルで完結できるようにあえて
// 別ファイルに用意しない形で記述している

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

interface ISGProps {
  post: Post;
}

export default function ISGPostsId({ post }: ISGProps) {
  return (
    <div>
      <Head>
        <title>ISGの解説用ページ（Post詳細）</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Optional chaning */}
      <main>
        <h1>Post詳細（ISG）</h1>
        <div>
          <p>Post ID: {post?.id}</p>
          <p>User ID: {post?.userId}</p>
          <p>Title: {post?.title}</p>
          <p>Body: {post?.body}</p>
        </div>
      </main>
    </div>
  );
}

type ISGParams = {
  id: string;
};

// tells next which dynamic pages to render
export const getStaticPaths: GetStaticPaths<ISGParams> = async (
  _context: GetStaticPathsContext
) => {
  return {
    /**
     * "next build"でHTMLファイルを生成しないようにするため
     * 「id: 1」のPost情報のHTMLだけSSGを行うようにしている。
     * （それ以外の「id:2 ~ id:100」はISGでHTMLを生成）
     *
     * 「id:1~id:100」の詳細は以下を参照
     * https://jsonplaceholder.typicode.com/posts
     */

    paths: [{ params: { id: '1' } }],

    /***
     * falsebackの値は true もしくは 'blocking' にすると、
     * ISGの機能が有効となる
     *
     * ----------------
     * fallback: true
     * https://nextjs.org/docs/basic-features/data-fetching#fallback-true
     * ----------------
     *
     * SSGで生成していないファイルに初回アクセスした場合に、
     * ページコンポーネントの実装を元に最低限のSSRを行い
     * 必要に応じてCSRを行う。
     * （getStaticPropsで記述したコードはCSRのような形でデータを取得する）
     *
     * 裏側ではアクセスしたURLに対応するHTMLも生成する
     * (アクセス毎に1ファイルのみのSSGを行う = ISG)。
     *
     * 同じURLへの2回目以降のアクセスに関しては、
     * ISGによりHTMLファイルを生成しているため、
     * クライアントにはISGで生成済みのHTMLを返す
     *
     *
     * ----------------
     * fallback: 'blocking'
     * https://nextjs.org/docs/basic-features/data-fetching#fallback-blocking
     * ----------------
     *
     * 「fallback: true」では、
     * getStaticPropsの処理の完了を待たずに、
     * 最低限のHTMLをクライアントに返し、
     * その後CSRでページに必要な情報の取得、レンダリングを行っていたが、
     *
     * 「fallback: 'blocking'」では、
     * getStaticPropsで記述したコードはgetServerSidePropsのような動作を行う。
     *
     * つまり、サーバー側で一通りのHTMLの生成が完了するまでは
     * クライアントへのレスポンスは待機状態となる。
     *
     * 初回アクセスでISGを行いHTMLの生成、
     * 2回目以降のアクセスでは生成済みのHTMLを返すという動作は
     * 「fallback: true」と同じ
     *
     * デベロッパーツールでJavaScriptのdebugger設定で
     * disableにすると、ISGが実行がされるときの動作の違いが確認しやすい。
     * →https://developers.google.com/web/tools/chrome-devtools/javascript/disable
     *
     * - fallback: true(CSR)
     *     - → クライアント側でJSが実行できないため、CSRが行われず中途半端な状態のページが表示される(APIの実行もされない)
     * - fallback: 'blocking'(SSR)
     *     - → クライアント側でJSが実行できないが、SSRの動きとなり完全な形でページが表示される
     */
    // true だとjs無効化した時にCSRなのでデータが表示されない
    // blockだとjs無効化したとしてもSSRなのでデータが表示される
    fallback: 'blocking', // true or 'blocking' for ISG
  };
};

export const getStaticProps: GetStaticProps<ISGProps> = async (
  context: GetStaticPropsContext
) => {
  const params = context.params as ISGParams;
  const postId = params.id;
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  const post = (await res.json()) as Post;

  return {
    props: {
      post,
    },
  };
};