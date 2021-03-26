### 什么是BFC

具有 BFC 特性的元素可以看作是**隔离了的独立容器**，容器里面的元素不会**在布局上影响到外面的元素**，并且 BFC 具有普通容器所没有的一些**特性**。

### 触发BFC

* body根元素
* 浮动元素：float除none外
* 绝对定位：position(absout,fixed)
* display为inline-block,table-cells,flex
* overflow除visible以外的值(hidden,auto,scroll)



### 应用

* 利用BFC避免外边距重叠的问题，可以把他们放在不同的BFC中

  ```
  <div class="container">
      <p></p>
  </div>
  <div class="container">
      <p></p>
  </div>
  .container {
      overflow: hidden;
  }
  ```

* 清除浮动：由于元素浮动，脱离了文档流。如果触发容器的BFC，那么容器将会包裹浮动元素

https://zhuanlan.zhihu.com/p/25321647