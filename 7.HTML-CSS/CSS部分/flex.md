### 基础使用

#### 设置flex

```
display:flex
display: -webkitrow-flex; /* Safari */
```

#### 容器的属性

* flex-directon:row(行，默认值),column(列)。row-reverse,column-reverse
* justify-content:定义了在主轴上的对齐方式。
  * flex-start
  * flex-end
  * center
  * space-between:**两端对齐**，项目之前的间隔相等
  * space-around:**项目两侧的间隔相等。**
* align-items
  * flex-start 交叉轴的起点对齐
  * flex-end 交叉轴的终点对齐
  * center 交叉轴的中点对齐
  * stretch
  * baseline
* flex-shrink
  * 定义了项目的缩小比例。默认为1，如果空间不足，该项目将缩小
* flex-grow
  * 定义项目放大的比例





## flex布局如何改变主轴方向？

答：flex-direction：row | row-reverse | cloumn | cloum-reverse

## 容器的属性
答：flex-direction；flex-wrap（默认不换行）；justify-content（定义项目在主轴的对齐方式）；align-items（项目在交叉轴上如何对齐）；align-content（多根轴线的对齐方式，一根线没有效果）

## 项目的属性
答：order：<interger>（项目的数值越小，排列越靠前）；flex-shrink（定义项目缩小比例，默认为1，即空间不够时，将该项目缩小）；flex-grow（定义项目放大比例，默认为0）；flex-basis（定义项目在分配多余空间之前，占据的主轴空间）