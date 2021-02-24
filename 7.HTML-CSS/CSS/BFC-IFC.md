# BFC

BFC(Block formatting context)直译为"块级格式化上下文"。它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

> 解释：
>
> > BFC是 W3C CSS 2.1 规范中的一个概念，它决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。当涉及到可视化布局的时候，Block Formatting Context提供了一个环境，HTML元素在这个环境中按照一定规则进行布局。一个环境中的元素不会影响到其它环境中的布局。比如浮动元素会形成BFC，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。这里有点类似一个BFC就是一个独立的行政单位的意思。也可以说BFC就是一个作用范围。可以把它理解成是一个独立的容器，并且这个容器的里box的布局，与这个容器外的毫不相干。
> >

## 哪些元素会生成BFC

- 根元素
- float属性不为none
- position为absolute或fixed
- display为inline-block, table-cell, table-caption, flex, inline-flex
- overflow不为visible



- 决定了元素如何对其**内容**进行定位，以及与其他元素的关系和相互作用
- 是一个环境，HTML 元素在这个环境中按照一定的规则进行布局
- 一个环境中的元素不会影响到其他环境中的布局
- 普通流中盒子属于一种 FC，或是 BFC 或是 IFC，但只能同时属于一种
- 任何在两者中被渲染但盒子分别是 `block` 和 `inline`
- **未被包裹的文本也会属于匿名的盒子（**`**block**` **或** `**inline**` **视情况而定）**
- 规则和特性
  - **BFC 区域不会与** `**float box**` **重叠（自适应两栏布局）**
  - BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
  - **计算BFC的高度时，浮动子元素也参与计算（解决 float 之后父元素塌陷）**

- 触发形成 BFC 的元素

- - 根元素
  - `float` 不为 `none`
  - `position` 为 `absolute` 或 `fixed`
  - `display` 为 `inline-block`、`table-cell`、`table-caption`、`flex`、`inline-flex`
  - `**overflow**` **不为** `**visible**`**（常用：**`**overflow: hidden**`**）**





## 层叠上下文

- 七阶层叠水平

- - 正 `z-index`
  - `z-index: auto` 或 `z-index: 0`（`position`）
  - `inline/inline-block`
  - `float`
  - `block`
  - `负 z-index`
  - `background`/`border`

1. 排在最底下的 background/border 属于当前层叠上下文，即参与层叠排序的所有元素的父元素。

2. background/border 为装饰，block 和 float 都属于布局，inline/inline-blocks 为内容，内容最上，布局次之，装饰最后的排序是合理的。

3. 难于理解的是

4. 块级格式化上下文和层叠上下文都是概念，一个可以理解成箱子，一个可以理解成 z 轴

5. 元素在一定的条件下创建块级格式化上下文/层叠上下文

6. 拥有块级格式化上下文/层叠上下文的元素的内部元素遵循一定的规则来布局或层叠

7. 拥有块级格式化上下文/层叠上下文的元素的内部可以嵌套块级格式化上下文/层叠上下文





#### 垂直外边距折叠问题

- 让父级元素变成 BFC
- 子元素的 display 为 inline-block
- 子元素浮动
- 子元素绝对定位