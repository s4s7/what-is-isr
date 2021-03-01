import Head from 'next/head';
// 関数のimportは波括弧
import { useEffect, useState } from 'react';


// pages directory it's automatically available as a route.
// the Link component to enable client-side navigation between pages.
// フレームワークなのでreact routerを導入しなくてもurlが規定される
// 普通ページ遷移はaタグでやるがnext.jsではLinkコンポーネントを作る
import Link from 'next/link';

// pages/ssr/index.tsxと共通するコードが複数あるが
// 解説が1ファイルで完結できるようにあえて
// 別ファイルに用意しない形で記述している

// Type Alias vs Interface
// Alias : 拡張性がない(複数の変数宣言を一つの変数に代入)
//    → マージしたい場合はunionして使う
// Interface : 拡張性がある(クラスの様に宣言する)
//    → 同名のinterfaceを宣言すると自動的に型がマージされる
//    → 構造を定義するためオブジェクトと関数の型のみ

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// interface Post  {
//   userId: number,
//   id: number,
//   title: string,
//   body: string,
// };

// export でモジュール化
// 1ファイル:1モジュール推奨なので、名前なし(default)export
// 関数コンポーネント
export default function CSR() {
  // hoosとは、クラスの機能(stateやライフサイクル)をfunctional componentでも使えるという意味合い
  // React Hooksで関数コンポーネントでもstateを扱える(thisが不要になる)
  // useStateはReact Hooksのmethod
  // const [stete変数名, state変更関数名] = useState<state変数名の型アノテーション>(stateの初期値 ex.false);
  // 配列 : 型の種類[]
  const [posts, setState] = useState<Post[]>([]);

  // useEffect( コールバック関数:()=>{} )
  // React Hooksで関数コンポーネントでもライフサイクル(生成mounting→更新→破棄unmounting)を扱える
  // mountingの主要メソッド → constructor(), render(), componentDidMount()
  // render() : VDOM描画(JSXをリターン)
  // VDOM描画後に一回だけ実行(componentDidMount)をしたい時は第二引数に空の配列を渡す
  // 第二引数が指定されている場合、前回のレンダーと今回のレンダーを比較して変更があればCallBack関数を実行
  // 今回は、特定のレンダー時のみ実行したい
  useEffect(() => {
    async function fetchPosts() {
      // awate:他動詞 promise→ES2015 async/awate→ES2017以降
      const res = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = (await res.json()) as Post[];
      // The setState function is used to update the state.
      setState(posts);
    }
    fetchPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>CSRの解説用ページ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Post一覧(CSR)</h1>
        <ul>
          {posts.map(({ id, title }) => {
            const postDetailPath = `/1-csr/posts/${id}`;

            return (
              <li key={id}>
                <Link href={postDetailPath}>{title}</Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
