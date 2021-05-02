回想我们日常的工作流，假设a和b两人合作开发，三个分支：develop, develop_a, develop_b。两个人分别在develop_a和develop_b分支上进行日常开发，阶段性地合入到develop，那么从a的角度来看，可能的工作流是这样的：

（1）个人在develop_a分支上开发自己的功能

（2）在这期间其他人可能不断向develop合入新特性

（3）个人功能开发完毕后通过merge 的方式合入别人开发的功能

**rebase**，合并的结果好看，一条线，但合并过程中出现冲突的话，比较麻烦（rebase过程中，一个commit出现冲突，下一个commit也极有可能出现冲突，一次rebase可能要解决多次冲突）；

**merge**，合并结果不好看，一堆线交错，但合并有冲突的话，只要解一次就行了；

所以我都是先rebase，如果有冲突，git rebase --abort，再换用merge~~



合并冲突

> 你在一个feature分支进行新特性的开发，与此同时，master 分支的也有新的提交。

![img](https://upload-images.jianshu.io/upload_images/305877-5dece524b7130343.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

为了让master上的更新提交合并到你的feature分支上。有两种选择`merge`和`rebase`

### merge

```
git checkout feature
git merge master
```

那么就会在feature分支上产生一个新的commit 

![img](https://upload-images.jianshu.io/upload_images/305877-c4ddfcf679821e2f.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

特点：会自动产生一个新的commit

如果遇到冲突，就需要修改后重新commit

### rebase

```
git checkout feature
git rebase master
```



该方法会找到相同祖先，合并之前的commit历史![img](https://upload-images.jianshu.io/upload_images/305877-467ba180733adca1.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

* 若遇到冲突
  * 修改冲突部分
  * git add
  * `git rebase --continue`
  * （如果第三步无效可以执行 `git rebase --skip`）

**修整历史，将分支历史并入主线**。其实这功能是需要在某些场景下才会有明显作用，比如当我们向他人维护的开源项目提交修改时，肯定要先在自己的分支中进行开发，然后再提交，但如果我们变基后再提交，维护人员就不用进行整合工作了，直接快速合并即可。

rebase 将所有master的commit移动到你的feature 的顶端。问题是：其他人还在original master上开发，由于你使用了rebase移动了master，git 会认为你的主分支的历史与其他人的有分歧，会产生冲突。

>  如果你想要一个干净的，没有merge commit的线性历史树，那么你应该选择git rebase
>  如果你想保留完整的历史记录，并且想要避免重写commit history的风险，你应该选择使用git merge





### 总结

rebase:会取消分支的每一个提交，然后更新到最新分支，找到两个分支第一个相同的提交，然后提取之后所有记录，添加到目标分支的后面

merge: 将两个分支，合并提交为一个分支，并且提交两个commit。新建一个commit对象，吧两个分支以前的记录都指向新commit对象，会保留之前所有的commit

