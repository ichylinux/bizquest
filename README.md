# 環境構築手順
## CentOS 7 を用意
### sudo 権限を付与
```
（ユーザで）$ su
（ルートで）# sed -i -e 's/\(\/sbin:\/bin:\/usr\/sbin:\/usr\/bin\)$/&:\/usr\/local\/bin/' /etc/sudoers
（ルートで）# echo "$USER ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$USER
```
### Ruby環境をインストール
```
$ sudo yum install git
$ git clone [https://github.com/ichylinux/daddy.git または git@github.com:ichylinux/daddy.git]
$ pushd daddy
$ bin/dad local
$ popd
```
## BizQuestの準備
### BizQuestのソースを取得
```
$ git clone [https://github.com/ichylinux/bizquest.git または git@github.com:ichylinux/bizquest.git]
$ cd bizquest
```
### ライブラリのインストール
```
$ bundle install
$ yarn install
```
# 遊び方
### 起動
```
$ rails -s -b 0.0.0.0
```
ブラウザから http://localhost:3000 にアクセスします。
