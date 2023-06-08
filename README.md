# Three.js Template

## 使い方

1. package.json の name の値を変更
2. index.html のタイトルを変更
3. public フォルダ内に必要なモデルやテクスチャファイルを入れる
4. assets.js に使用するモデルやテクスチャのパスなどを記入
5. Resources.js で必要のない機能のコードをコメントアウト
6. Crew.js の中身のコードを変更
7. Crew.js のファイル名をクラス名にに合わせて変更
8. 物理演算演が必要のないときは Physics.js ファイルを削除して World.js にある 関連コードを削除
9. npm i で node_modules をインストール

## 注意点

- デバッグ gui に表示されている項目の値を変更するときは、Debug.js で使用しているデフォルト値を変更する可能性があります。例）clearColor
