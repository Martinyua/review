提示如下：

```git
error: Your local changes to the following files would be overwritten by merge
```



### 保留本地代码

```
git stash
git pull origin master
git stash pop
```



### 远程代码覆盖本地代码

```
git reset --hard
git pull origin master
```

