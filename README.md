# shared-components

## このリポジトリの目的、役割

汎用のUIコンポーネントをプロジェクト間で共有するためのリポジトリです。  
gitのsubmodule機能を使って共有します。  
※npmパッケージ化も検討しましたがアカウント管理の問題などがありハードル高めなのでsubmoduleにしました。  

## カタログページについて

コンポーネントの見た目や使い方を確認するためのウェブページが用意されています。  
https://dev.d1xcmdmxxsl4x4.amplifyapp.com/catalog  
このページ群はon-Line-Subscribeリポジトリに内蔵されています（専用の環境を立ち上げる手間を省略するため）。  

*コンポーネント本体を更新したらカタログページも更新してください。*  
例えば新しいPropsを追加した場合、そのPropsを使うサンプルを掲載してください。  

## 他のプロジェクトで新たにshared-componentsを使う方法

追加したいプロジェクトのルートフォルダにて、次のような感じで`git submodule add`コマンドを実行してください。  

```bash
git submodule add git@github.com:on-team/shared-components.git web/src/components/shared/
```

なお`git clone`コマンドに`--recursive`オプションを付けないとsubmoduleのファイルは取得されませんが、  
`git submodule update --init`コマンドで後から取得できます。  
（submodule追加時はそのことをREADME.mdに追記しておくべきでしょう）  

### 要求するnpmパッケージ

shared-componentsは下記のnpmパッケージに依存しています。  
shared-componentsを使うプロジェクト内にこれらがインストールされていなければ使えません。  

- dayjs
- lodash
- focus-trap
- body-scroll-lock
- @roxi/routify

なお各パッケージのバージョンが古すぎる場合はエラーが出る可能性があります。  
あるいは新しいメジャーバージョンにshared-componentsが対応できていない場合は最新版でもエラーが出る可能性があります。  
（どの範囲のバージョンなら動くのかを厳密に管理するのは難しいので、このような注意書きに留めています）  

## shared-componentsを更新・アップデートする手順

ソースコードを編集してshared-componentsリポジトリにコミット&プッシュするだけでは、  
shared-componentsをsubmoduleとして使っているリポジトリは更新されません（過去のコミット時点を参照し続けます）。  

最新版にアップデートするには次のコマンドを実行してください。  

```bash
git submodule update --remote
```

アップデートするタイミングの判断は、npmパッケージのアップデート時と同じ考え方で大丈夫です。  

アップデート時にマイグレーションが必要かどうかの判断のために、いわゆるセマンティックバージョニングを使います。  
GitHubのReleases機能を使って`2.1.0`などのタグ付けと、アップデート内容（特にマイグレーション方法）の説明を行ってください。  
