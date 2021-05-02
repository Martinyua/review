https://juejin.cn/post/6846687595187929101#heading-15

### 几个概念

* git工作区。简单来说就是我们电脑能看到的目录
* git缓存区。git add 就是将文件提交到暂存区。
* git版本区。git commit 后就提交到git版本区

* 分支：一般需要两个分支：
  * 正式版本的分支，需要稳定的运行
  * 开发主线的分支，下个版本需求开发的分支

### 几个命令

* git add . 提交到暂存区
* git commit  将暂存区的文件添加到版本库
  * git reset 撤销
* git branch 查看本地分支
  * git branch <name>创建分支
  * git checkout <name> 切换分支
* **合并分支**
  * `Merge`：保留之前的提交顺序。
  * `Rebase`：得到的提交历史更加线性，看着更加简洁。大部分团队的选择。
* 远程仓库
  * git pull 同步更新
  * git push 上传到远程分支



### 合作开发



至少两个分支。一个保证线上版本的稳定运行

一个用于开发进度的推进

**最好参考gitflow流程**