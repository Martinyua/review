	https://zhuanlan.zhihu.com/p/23478654

![图文详解如何利用Git+Github进行团队协作开发](https://pic2.zhimg.com/v2-86810fd98b9f40c9d098b4b65aceef0f_1440w.jpg?source=172ae18b)

主要有五个分支

- master 分支：主分支，保证稳定的生产环境的代码，对项目进行tag或者发布版本等一些操作。
- develop分支。开发的分支，成员一般不直接修改该分支，而是分检出自己的feature分支，在feature分支上merge回develop分支。同时release分支由此分支检出
- release分支。发布分支，从develop上检出的分支。一般是用于发布前的测试，bug修复
- feature分支。从develop分支上检出。功能分支，每个成员维护一个自己的feature分支，进行并行开发工作。开发后将此分支merge回develop分支
- hotfix分支。由master分支检出，进行线上版本的修复，修复完后merge回master



### 工作流程

* 首先有两个基本的分支，一个master的分支，还有一个是在master上新建的develop分支。

* 成员在develop上进行检出新的feature分支。

* 成员现在各自的feature分支上进行开发。如果要合并到主分支。先切回develop分支，`git pull origin develop`，将远程develop分支同步到本地develop分支。切回本地feature分支，合并远程分支到本地分支`git rebase develop`，并且解决冲突。然后切回develop分支，合并feature分支至远程分支。然后推送到远程分支。**大体流程**：先将远程dev同步到本地dev，然后合并dev分支到feature分支，然后feature分支合并到dev分支。最后推送到dev远程分支

* 特殊情况：另一个人从远程dev合并到当前feature时可能产生冲突，解决后：`git add .` +  `git rebase --continue`

  ```
  git rebase develop    # 合并develop分支到feature分支，并解决冲突（有冲突）
  # 这里需要进行冲突解决
  git add .    # 解决完冲突之后执行add操作
  git rebase --continue    # 继续刚才的rebase操作
  git checkout develop    # 切换回develop分支
  git merge --no-ff feature-zz    # 合并feature分支到develop分支（无冲突）
  git push origin develop   # 推送develop分支到远端
  ```

### 经典： git merge 和 git rebase 的区别

* git merge 会产生一个**新**的提交commit。
* git rebase方法会找到相同祖先，**合并**之前的commit历史
* 使用git merge 合并分支，解决冲突，执行git add .和commit操作，**此时还会产生一个额外的commit**
* 使用git rebase合并分支，解决完冲突，执行add和git rebase --continue，**不会产生额外的commit**。这样master分支上不会有无意义的commit。
* 大多数情况下用merge。一般从dev合并到当前feature是 rebase。从feature是dev是merge
* 一般需要详细的合并信息时用git merge，特别是多人开发需要将分支合并入master时。什么情况用git rebase？ 如果自己修改某个功能时，频繁的进行了git commit提交，但是这些都这些过多的信息都没有必要，可以尝试git rebase

