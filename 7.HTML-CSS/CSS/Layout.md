# CSS布局

## 单列

- header,content和footer等宽的单列布局
- header与footer等宽,content略窄的单列布局

对于第一种，先通过对header,content,footer统一设置width：1000px;或者max-width：1000px(这两者的区别是当屏幕小于1000px时，前者会出现滚动条，后者则不会，显示出实际宽度);然后设置margin:auto实现居中即可得到。



header、footer的内容宽度不设置，块级元素充满整个屏幕，但header、content和footer的内容区设置同一个width，并通过margin:auto实现居中。

## 两列自适应布局

### 1.float+overflow:hidden

如果是普通的两列布局，**浮动+普通元素的margin**便可以实现，但如果是自适应的两列布局，利用**float+overflow:hidden**便可以实现，这种办法主要通过overflow触发BFC,而BFC不会重叠浮动元素。由于设置overflow:hidden并不会触发IE6-浏览器的haslayout属性，所以需要设置zoom:1来兼容IE6-浏览器。具体代码如下：

```
<div class="parent" style="background-color: lightgrey;">
    <div class="left" style="background-color: lightblue;">
        <p>left</p>
    </div>
    <div class="right"  style="background-color: lightgreen;">
        <p>right</p>
        <p>right</p>
    </div>        
</div>
复制代码
.parent {
  overflow: hidden;
  zoom: 1;
}
.left {
  float: left;
  margin-right: 20px;
}
.right {
  overflow: hidden;
  zoom: 1;
}
复制代码
```

**注意点:如果侧边栏在右边时，注意渲染顺序。即在HTML中，先写侧边栏后写主内容**

### Flex布局

Flex布局，也叫弹性盒子布局，区区简单几行代码就可以实现各种页面的的布局。

```
//html部分同上
.parent {
  display:flex;
}  
.right {
  margin-left:20px; 
  flex:1;
}
复制代码
```

### 3.grid布局

Grid布局，是一个基于网格的二维布局系统，目的是用来优化用户界面设计。

```
//html部分同上
.parent {
  display:grid;
  grid-template-columns:auto 1fr;
  grid-gap:20px
} 
```



### 三栏布局

**特征：中间列自适应宽度，旁边两侧固定宽度**

### 1.圣杯布局

#### ① 特点

**比较特殊的三栏布局，同样也是两边固定宽度，中间自适应，唯一区别是dom结构必须是先写中间列部分，这样实现中间列可以优先加载**。

```
  .container {
    padding-left: 220px;//为左右栏腾出空间
    padding-right: 220px;
  }
  .left {
    float: left;
    width: 200px;
    height: 400px;
    background: red;
    margin-left: -100%;
    position: relative;
    left: -220px;
  }
  .center {
    float: left;
    width: 100%;
    height: 500px;
    background: yellow;
  }
  .right {
    float: left;
    width: 200px;
    height: 400px;
    background: blue;
    margin-left: -200px;
    position: relative;
    right: -220px;
  }

  <article class="container">
    <div class="center">
      <h2>圣杯布局</h2>
    </div>
    <div class="left"></div>
    <div class="right"></div>
  </article>
```

### 2.双飞翼布局

#### ① 特点

**同样也是三栏布局，在圣杯布局基础上进一步优化，解决了圣杯布局错乱问题，实现了内容与布局的分离。而且任何一栏都可以是最高栏，不会出问题**。

```
  .container {
        min-width: 600px;//确保中间内容可以显示出来，两倍left宽+right宽
    }
    .left {
        float: left;
        width: 200px;
        height: 400px;
        background: red;
        margin-left: -100%;
    }
    .center {
        float: left;
        width: 100%;
        height: 500px;
        background: yellow;
    }
    .center .inner {
        margin: 0 200px; //新增部分
    }
    .right {
        float: left;
        width: 200px;
        height: 400px;
        background: blue;
        margin-left: -200px;
    }
复制代码
    <article class="container">
        <div class="center">
            <div class="inner">双飞翼布局</div>
        </div>
        <div class="left"></div>
        <div class="right"></div>
    </article>
```

三个部分都设定为左浮动，然后设置center的宽度为100%，此时，left和right部分会跳到下一行；

通过设置margin-left为负值让left和right部分回到与center部分同一行；

center部分增加一个内层div，并设margin: 0 200px；

### 3.两种布局实现方式对比:

- 两种布局方式都是把主列放在文档流最前面，使主列优先加载。
- 两种布局方式在实现上也有相同之处，都是让三列浮动，然后通过负外边距形成三列布局。
- 两种布局方式的不同之处在于如何处理中间主列的位置： **圣杯布局是利用父容器的左、右内边距+两个从列相对定位**； **双飞翼布局是把主列嵌套在一个新的父级块中利用主列的左、右外边距进行布局调整**

### 1.特点

- 有一块内容``，当``的高康足够长的时候，紧跟在``后面的元素``会跟在``元素的后面。
- 当``元素比较短的时候(比如小于屏幕的高度),我们期望这个``元素能够“粘连”在屏幕的底部



![img](https://user-gold-cdn.xitu.io/2018/12/21/167ceb06bb1ee763?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



具体代码如下：

```
<div id="wrap">
      <div class="main">
        main <br />
        main <br />
        main <br />
      </div>
    </div>
    <div id="footer">footer</div>
复制代码
   * {
        margin: 0;
        padding: 0;
      }
      html,
      body {
        height: 100%;//高度一层层继承下来
      }
      #wrap {
        min-height: 100%;
        background: pink;
        text-align: center;
        overflow: hidden;
      }
      #wrap .main {
        padding-bottom: 50px;
      }
      #footer {
        height: 50px;
        line-height: 50px;
        background: deeppink;
        text-align: center;
        margin-top: -50px;
      }
```

#### (1)footer必须是一个独立的结构，与wrap没有任何嵌套关系

#### (2)wrap区域的高度通过设置min-height，变为视口高度

#### (3)footer要使用margin为负来确定自己的位置

#### (4)在main区域需要设置 padding-bottom。这也是为了防止负 margin 导致 footer 覆盖任何实际内容。

