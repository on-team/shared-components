# shared-components

## このリポジトリの目的、役割

汎用のUIコンポーネントをプロジェクト間で共有するためのリポジトリです。  
gitのsubmodule機能を使って共有します。  
※npmパッケージ化も検討しましたがアカウント管理の問題などがありハードル高めなのでsubmoduleにしました。  

## カタログページについて

コンポーネントの見た目や使い方を確認するためのウェブページが用意されています。  
専用の環境を新たに構築する手間を省略するために、そのウェブページはon-Line-Subscribeリポジトリに内蔵されています。  
カタログページのURLはon-Line-Subscribeの[README](https://github.com/on-team/on-Line-Subscribe#readme)に載っています。  

*コンポーネント本体を更新したらそれに合わせてカタログページの内容も更新してください。*  
例えば新しいPropsを追加した場合、そのPropsを使うサンプルを掲載してください。  

## 他のプロジェクトで新たにshared-componentsを使う方法

追加したいプロジェクトのルートフォルダにて、次のような感じで`git submodule add`コマンドを実行してください。  

```bash
git submodule add https://github.com/on-team/shared-components.git web/src/components/shared/
```

なお`git clone`コマンドに`--recursive`オプションを付けないとsubmoduleのファイルは取得されませんが、  
`git submodule update --init`コマンドで後から取得できます。  
（submodule追加時はそのことをREADME.mdに追記しておくべきでしょう）  

### 要求するnpmパッケージ

現在、shared-componentsは下記のnpmパッケージに依存しています。  
shared-componentsを使うプロジェクト内にこれらがインストールされていなければ使えません（自動ではインストールされません）。  

- dayjs
- lodash
- focus-trap
- body-scroll-lock
- @roxi/routify

なお各パッケージのバージョンが古すぎたり新しすぎる場合はエラーが出る可能性があります。  
古すぎてダメな場合はそのパッケージをアップデートする形で解決するのが理想です。  
逆に新しすぎてダメな場合は新しいバージョンに対応できるようshared-componentsのコードをマイグレーションするべきです。  
※shared-componentsがどの範囲のバージョンなら動くのかを厳密に管理するのは難しいので、このような注意書きに留めています。  

## shared-componentsを更新・アップデートする手順、およびバージョニング方針

共通コンポーネントのソースコードを編集してshared-componentsリポジトリにコミット&プッシュするだけでは、  
shared-componentsをsubmoduleとして使っているリポジトリは更新されません（過去のコミット時点のshared-componentsを参照し続けます）。  

最新版を参照するようアップデートするには、shared-componentsをsubmoduleとして使っているリポジトリのルートディレクトリで次のコマンドを実行してください。  

```bash
git submodule update --remote
```

アップデートするタイミングの判断は、npmパッケージのアップデート時と同じ考え方で大丈夫です。  

後方互換性のない更新かどうか（アップデート時にマイグレーションが必要かどうか）をユーザーが判断しやすくするために、いわゆるセマンティックバージョニングを使います。  
バージョンは`11.0.0`などのタグをコミットに付けることで表現します。  
ただし非メジャーバージョンアップのたびにタグを付けるのは面倒なので、メジャーバージョンアップのときにだけタグを付ければ十分です。  
またマイグレーション内容を説明するためにGitHubのReleases機能を使ってタグに説明文を付与してください。  
