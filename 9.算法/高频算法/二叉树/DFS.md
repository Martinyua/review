```
const dfs = (root) => {
    if( !root ) return
    console.log(root.val)
    dfs(root.left)
    dfs(root.right)
}
```

```
const dfs = (root) => {
	console.log(root.val)
    if(root.left) dfs(root.left)
    if(root.right) dfs(root.right)
}
```

