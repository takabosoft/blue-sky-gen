# 青空ジェネレーター

高画質な青空をプログラムで生成します。  
こちらで動作します。  
https://takabosoft.github.io/blue-sky-gen/

### 動作環境

* 各種ブラウザ

### ソースビルド方法

VSCode + node.jp + npmで動作します。

#### 各ライブラリをインストール（一度のみ）

```
npm install
```

#### 開発時

開発時はバンドラーによる監視とローカルWebサーバーを立ち上げます。

```
npx webpack -w
```

```
npx live-server docs
```

SCSSは拡張機能で[Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass)を利用します。

#### リリース時

```
npx webpack --mode=production
```
