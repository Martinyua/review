* 需要用到**队列和while循环**
* while(队列不为空){
      1、将队列队首的元素出队（树的根节点或者子树的根节点）
      2、把和出队元素相关的元素加入到队列（根节点的左子树和右子树）
  }

```
const bfs = (root) => {
    const q = [root]
    while ( q.length > 0) {
        const node = q.shift()
        console.log (node.val)
        if(node.left) q.push(node.left)
        if(node.right) q.push(node.right)
    }
}
bfs(root)
```



### 

