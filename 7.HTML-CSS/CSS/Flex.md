- 基本特性

- - 默认轴

- - - 主轴（Main Axis）：水平方向，左端为起始端
    - 交叉轴（Cross Axis）：与主轴垂直，顶端为起始端

- - 默认排列

- - - 项目沿主轴排列
    - Main size：项目占主轴的空间大小
    - Cross size：项目占交叉轴的空间大小

![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580904475920-78bba33f-0b5e-4ff8-9950-22e29a230365.png)



```
flex-direction: row | row-reverse | column | column-reverse;
```



```
flex-flow: <flex-direction> | <flex-wrap>;
```



`justify-content`

```
justify-content: flex-start | flex-end | center | space-between | space-around;
```



![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580905217948-31fa9187-6a04-4aaf-a8a6-059396db2879.png)

- - `align-items`

- - - 作用

- - - - 定义项目如何在交叉轴上对齐

- - - 写法



```
align-items: flex-start | flex-end | center | baseline | stretch;
```



- - - 取值

- - - - `flex-start`

- - - - - 交叉轴的起点对齐

- - - - `flex-end`

- - - - - 交叉轴的终点对齐

- - - - `center`

- - - - - 交叉轴的中点对齐

- - - - `baseline`

- - - - - 项目的第一行文字的基线对齐

- - - - **`stretch`****（默认值）**

- - - - - 如果项目未设置高度或设为 `auto`，将占满整个容器的高度

- - - 图示

![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580905392564-699f8b94-d2f7-4411-abf7-3786dfd88125.png)

- - **`align-content`**

- - - 作用

- - - - 定义了多根轴线的对齐方式。**如果项目只有一根轴线，该属性不起作用**。
      - **多轴线的产生：出现了换行**
      - 可以理解为：垂直方向的 `justify-content`

- - - 写法



```
align-content: flex-start | flex-end | center | space-between | space-around | stretch;
```



- - - 取值

- - - - `flex-start`

- - - - - 与交叉轴的起点对齐。

- - - - `flex-end`

- - - - - 与交叉轴的终点对齐。

- - - - `center`

- - - - - 与交叉轴的中点对齐。

- - - - `space-between`

- - - - - **与交叉轴两端对齐**，轴线之间的间隔平均分布。

- - - - `space-around`

- - - - - 每根轴线两侧的间隔都相等。所以，**轴线之间的间隔比轴线与边框的间隔大一倍**。

- - - - **`stretch`****（默认值）**

- - - - - 轴线占满整个交叉轴。

- - - 图示

![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580905814154-03073b17-4d9f-4b74-bfdd-330e6a0c50ff.png)

- 项目属性

- - `order`

- - - 作用

- - - - 定义项目的排列顺序
      - 数值越小，排列越靠前，**默认为 0**

- - - 图示

![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580906305340-0acc06f5-5a01-4ae4-ae8b-af939971889b.png)

- - **`flex-grow`**

- - - 作用

- - - - 定义项目放大**比例**

- - - 取值

- - - - 0（默认值）：即使存在剩余空间，也不放大

- - - 表现

- - - - 如果所有项目的 `flex-grow` 属性都为 1，则**它们将等分剩余空间**（如果有的话）
      - 如果其他情况，按比例放大

- - - 图示

![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580906535263-0290d70e-37d0-4f40-8872-f3b852603989.png)

- - **`flex-shrink`**

- - - 作用

- - - - 定义项目缩小**比例**

- - - 取值

- - - - 1（默认值）：空间不足时元素会按比例缩小

- - - 表现

- - - - 如果所有项目的 `flex-shrink` 属性都为 1，当空间不足时，都将等比例缩小
      - 如果一个项目的 `flex-shrink` 属性为 0，其他项目都为 1，则空间不足时，前者不缩小

- - - 图示

**![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580906717516-8efdfd10-963f-4406-ae0d-f540665c7633.png)**

- - `flex-basis`

- - - 作用

- - - - 定义在分配多余空间之前，项目占据主轴空间

- - - 取值

- - - - `auto`（默认值）：项目本来的大小
      - **``****：项目将占据固定的给定空间，不会改变**

- - `*flex`

- - - 作用

- - - - `flex-grow`、`flex-shrink`、`flex-basis` 的组合属性

- - `align-self`

- - - 作用

- - - - 定义自己不同于其他项目对于交叉轴的排列方式，可以覆盖容器元素的 `align-items`

- - - 写法



```
align-self: auto | flex-start | flex-end | center | baseline | stretch;
```



- - - 图示

![image.png](https://cdn.nlark.com/yuque/0/2020/png/190088/1580907048001-b3528331-07ca-4b14-8dc8-ae14ee91907c.png)

- 对子元素的影响

- - `float`、`clear` 和 `vertical-align` 属性应用在 Flexbox 子元素上将会无效
  - **易错  所有子元素一律强制成为块级元素**