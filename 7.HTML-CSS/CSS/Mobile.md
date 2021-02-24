# 移动端技巧

#### 常用的meta属性设置

meta对于移动端的一些特殊属性，可根据需要自行设置

```
<meta name="screen-orientation" content="portrait"> //Android 禁止屏幕旋转
<meta name="full-screen" content="yes">             //全屏显示
<meta name="browsermode" content="application">     //UC应用模式，使用了application这种应用模式后，页面讲默认全屏，禁止长按菜单，禁止收拾，标准排版，以及强制图片显示。
<meta name="x5-orientation" content="portrait">     //QQ强制竖屏
<meta name="x5-fullscreen" content="true">          //QQ强制全屏
<meta name="x5-page-mode" content="app">            //QQ应用模式
```

在 iOS Safari （其他浏览器和 Android 均不会）上会对那些看起来像是电话号码的数字处理为电话链接，比如：

- 7 位数字，形如：1234567
- 带括号及加号的数字，形如：(+86)123456789
- 双连接线的数字，形如：00-00-00111
- 11 位数字，形如：13800138000

关闭识别

```
<meta name="format-detection" content="telephone=no" />
复制代码
```

开启识别

```
<a href="tel:123456">123456</a>
```

#### 邮箱识别（Android）

安卓上会对符合邮箱格式的字符串进行识别，我们可以通过如下的 meta 来管别邮箱的自动识别：

```
<meta content="email=no" name="format-detection" />
复制代码
```

同样地，我们也可以通过标签属性来开启长按邮箱地址弹出邮件发送的功能：

```
<a mailto:dooyoe@gmail.com">dooyoe@gmail.com</a>
```

移动端 H5 项目越来越多，设计师对于 UI 的要求也越来越高，比如 1px 的边框。在高清屏下，移动端的 1px 会很粗。

那么为什么会产生这个问题呢？主要是跟一个东西有关，DPR(devicePixelRatio) 设备像素比，它是默认缩放为 100%的情况下，设备像素和 CSS 像素的比值。目前主流的屏幕 DPR=2（iPhone 8）,或者 3（iPhone 8 Plus）。拿 2 倍屏来说，设备的物理像素要实现 1 像素，而 DPR=2，所以 css 像素只能是 0.5。




#### 屏蔽用户选择

禁止用户选择页面中的文字或者图片

```
div {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```



#### 如何禁止保存或拷贝图像

代码如下

```
img {
  -webkit-touch-callout: none;
}
```



#### 输入框默认字体颜色

设置 input 里面 placeholder 字体的颜色

```
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #c7c7c7;
}
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #c7c7c7;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #c7c7c7;
}
```

#### 用户设置字号放大或者缩小导致页面布局错误

设置字体禁止缩放

```
body {
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
}
复制代码
```

#### android系统中元素被点击时产生边框

部分android系统点击一个链接，会出现一个边框或者半透明灰色遮罩, 不同生产商定义出来额效果不一样。去除代码如下

```
a,button,input,textarea{
  -webkit-tap-highlight-color: rgba(0,0,0,0)
  -webkit-user-modify:read-write-plaintext-only; 
}
```



# 移动端适配

vm与vh

1vm等于1%屏幕宽度，类似有插件[postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)



正常情况下，我们代码里的1px在屏幕上就应该显示一个像素点，但是在Retina屏下则不仅仅是一个像素点。再次拿iphone6为例，其dpr(device pixel ratio)设备像素比为2，css中一个1x1的点，其实在iphone6上是2x2的点,并且1px的边框在devicePixelRatio = 2的Retina屏下会显示成2px，在iPhone6 Plus下甚至会显示成3px。




ip6 **`750px \* 1334px`**



屏幕分辨率，手机具有的像素点，并不是越高越清晰

图像分辨率，图片含有的像素数，统一尺寸越高越清晰



PPI 每英寸像素数，描述屏幕清晰度/图片质量

![](https://juejin.im/equation?tex=%5Cfrac%7B%5Csqrt%7B%E6%B0%B4%E5%B9%B3%E5%83%8F%E7%B4%A0%E7%82%B9%E6%95%B0%5E2%2B%E5%9E%82%E7%9B%B4%E5%83%8F%E7%B4%A0%E7%82%B9%E6%95%B0%5E2%7D%7D%7B%E5%B0%BA%E5%AF%B8%7D)



DPI: 每英寸点数，点指屏幕像素点/图片像素点/打印机墨点，描述图片/屏幕时是等价于PPI，常用于描述打印机每英寸可以打印点数



retina 屏幕  把2x2个像素当作一个像素使用，元素大小不会改变

我们必须用一种单位来同时告诉不同分辨率的手机，它们在界面上显示元素的大小是多少，这个单位就是设备独立像素(`Device Independent Pixels`)简称`DIP`或`DP`。上面我们说，列表的宽度为`300`个像素，实际上我们可以说：列表的宽度为`300`个设备独立像素。

视口

### 4.1 布局视口



![img](https://user-gold-cdn.xitu.io/2019/5/17/16ac3a666e96ff01?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



布局视口(`layout viewport`)：当我们以百分比来指定一个元素的大小时，它的计算值是由这个元素的包含块计算而来的。当这个元素是最顶级的元素时，它就是基于布局视口来计算的。

所以，布局视口是网页布局的基准窗口，在`PC`浏览器上，布局视口就等于当前浏览器的窗口大小（不包括`borders` 、`margins`、滚动条）。

在移动端，布局视口被赋予一个默认值，大部分为`980px`，这保证`PC`的网页可以在手机浏览器上呈现，但是非常小，用户可以手动对网页进行放大。

我们可以通过调用`document.documentElement.clientWidth / clientHeight`来获取布局视口大小。

### 4.2 视觉视口



![img](https://user-gold-cdn.xitu.io/2019/5/17/16ac3a66924ef751?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



视觉视口(`visual viewport`)：用户通过屏幕真实看到的区域。

视觉视口默认等于当前浏览器的窗口大小（包括滚动条宽度）。

当用户对浏览器进行缩放时，不会改变布局视口的大小，所以页面布局是不变的，但是缩放会改变视觉视口的大小。

例如：用户将浏览器窗口放大了`200%`，这时浏览器窗口中的`CSS像素`会随着视觉视口的放大而放大，这时一个`CSS`像素会跨越更多的物理像素。

所以，布局视口会限制你的`CSS`布局而视觉视口决定用户具体能看到什么。

我们可以通过调用`window.innerWidth / innerHeight`来获取视觉视口大

### 4.3 理想视口



![img](https://user-gold-cdn.xitu.io/2019/5/17/16ac3a664842c93c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



布局视口在移动端展示的效果并不是一个理想的效果，所以理想视口(`ideal viewport`)就诞生了：网站页面在移动端展示的理想大小。

如上图，我们在描述设备独立像素时曾使用过这张图，在浏览器调试移动端时页面上给定的像素大小就是理想视口大小，它的单位正是设备独立像素。



我们可以借助``元素的`viewport`来帮助我们设置视口、缩放等，从而让移动端得到更好的展示效果。

```
<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;">
复制代码
```

上面是`viewport`的一个配置，我们来看看它们的具体含义：

| `Value`         | 可能值                      | 描述                                                      |
| --------------- | --------------------------- | --------------------------------------------------------- |
| `width`         | 正整数或`device-width`      | 以`pixels`（像素）为单位， 定义布局视口的宽度。           |
| `height`        | 正整数或`device-height`     | 以`pixels`（像素）为单位， 定义布局视口的高度。           |
| `initial-scale` | `0.0 - 10.0`                | 定义页面初始缩放比率。                                    |
| `minimum-scale` | `0.0 - 10.0`                | 定义缩放的最小值；必须小于或等于`maximum-scale`的值。     |
| `maximum-scale` | `0.0 - 10.0`                | 定义缩放的最大值；必须大于或等于`minimum-scale`的值。     |
| `user-scalable` | 一个布尔值（`yes`或者`no`） | 如果设置为 `no`，用户将不能放大或缩小网页。默认值为 yes。 |

![img](https://user-gold-cdn.xitu.io/2019/5/17/16ac3a66988df601?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



- `window.innerHeight`：获取浏览器视觉视口高度（包括垂直滚动条）。
- `window.outerHeight`：获取浏览器窗口外部的高度。表示整个浏览器窗口的高度，包括侧边栏、窗口镶边和调正窗口大小的边框。
- `window.screen.Height`：获取获屏幕取理想视口高度，这个数值是固定的，`设备的分辨率/设备像素比`
- `window.screen.availHeight`：浏览器窗口可用的高度。
- `document.documentElement.clientHeight`：获取浏览器布局视口高度，包括内边距，但不包括垂直滚动条、边框和外边距。
- `document.documentElement.offsetHeight`：包括内边距、滚动条、边框和外边距。
- `document.documentElement.scrollHeight`：在不使用滚动条的情况下适合视口中的所有内容所需的最小宽度。测量方式与`clientHeight`相同：它包含元素的内边距，但不包括边框，外边距或垂直滚动条。





### 1px

### 2.1 物理像素（physical pixel）

手机屏幕上显示的最小单元，该最小单元具有颜色及亮度的属性可供设置，iphone6、7、8 为：750 * 1334，iphone6+、7+、8+ 为 1242 * 2208

### 2.2 设备独立像素（density-indenpendent pixel）

此为逻辑像素，计算机设备中的一个点，css 中设置的像素指的就是该像素。老早在没有 retina 屏之前，设备独立像素与物理像素是相等的。



物理像素（CSS像素）和设备像素

设备像素比(dpr) = 物理像素/设备独立像素（CSS像素）

姑且认为设备像素是正确的，浏览器缩放会将CSS像素变化，一单位设备像素上会承载多个CSS像素，放大时，一单位CSS像素会覆盖多个设备像素。只需关注CSS像素，设定缩放级别为100%时，二者相等



而在设备像素比大于`1`的屏幕上，我们写的`1px`实际上是被多个物理像素渲染，这就会出现`1px`在有些屏幕上看起来很粗的现象。



### 5.1 border-image

基于`media`查询判断不同的设备像素比给定不同的`border-image`：

```
       .border_1px{
          border-bottom: 1px solid #000;
        }
        @media only screen and (-webkit-min-device-pixel-ratio:2){
            .border_1px{
                border-bottom: none;
                border-width: 0 0 1px 0;
                border-image: url(../img/1pxline.png) 0 0 2 0 stretch;
            }
        }
复制代码
```

### 5.2 background-image

和`border-image`类似，准备一张符合条件的边框背景图，模拟在背景上。

```
       .border_1px{
          border-bottom: 1px solid #000;
        }
        @media only screen and (-webkit-min-device-pixel-ratio:2){
            .border_1px{
                background: url(../img/1pxline.png) repeat-x left bottom;
                background-size: 100% 1px;
            }
        }
复制代码
```

上面两种都需要单独准备图片，而且圆角不是很好处理，但是可以应对大部分场景。

### 5.3 伪类 + transform

基于`media`查询判断不同的设备像素比对线条进行缩放：

```css
       .border_1px:before{
          content: '';
          position: absolute;
          top: 0;
          height: 1px;
          width: 100%;
          background-color: #000;
          transform-origin: 50% 0%;
        }
        @media only screen and (-webkit-min-device-pixel-ratio:2){
            .border_1px:before{
                transform: scaleY(0.5);
            }
        }
        @media only screen and (-webkit-min-device-pixel-ratio:3){
            .border_1px:before{
                transform: scaleY(0.33);
            }
        }
```

这种方式可以满足各种场景，如果需要满足圆角，只需要给伪类也加上`border-radius`即可。

### 5.4 svg

上面我们`border-image`和`background-image`都可以模拟`1px`边框，但是使用的都是位图，还需要外部引入。

借助`PostCSS`的`postcss-write-svg`我们能直接使用`border-image`和`background-image`创建`svg`的`1px`边框：

```css
@svg border_1px { 
  height: 2px; 
  @rect { 
    fill: var(--color, black); 
    width: 100%; 
    height: 50%; 
    } 
  } 
.example { border: 1px solid transparent; border-image: svg(border_1px param(--color #00b1ff)) 2 2 stretch; }

```

编译后：

```css
.example { border: 1px solid transparent; border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch; }

```

上面的方案是大漠在他的文章中推荐使用的，基本可以满足所有场景，而且不需要外部引入，这是我个人比较喜欢的一种方案。



```
@svg 1px-border {
  height: 2px;
  @rect {
    fill: var(--color, black);
    width: 100%; height: 50%;
    }
  }
.example {
  border: 1px solid transparent;
  border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
}
复制代码
```

编译出来就是

```
.example {
  border: 1px solid transparent;
  border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E") 2 2 stretch;
}
```



### **scale**

如果在一个元素上使用`scale`时会导致整个元素同时缩放，所以应该在该元素的伪元素下设置`scale`属性。

```
.scale::after {
    display: block;
    content: '';
    border-bottom: 1px solid #000;
    transform: scaleY(.5);
}
```

### **linear-gradient**

通过线性渐变，也可以实现移动端1px的线。原理大致是使用渐变色，上部分为白色，下部分为黑色。这样就可以将线从视觉上看只有1px。

由于是通过背景颜色渐变实现的，所以这里要使用伪元素并且设置伪元素的高度。 当然，也可以不使用伪元素，但是就会增加一个没有任何意义的空标签了。

```
div.linear::after {
    display: block;
    content: '';
    height: 1px;
    background: linear-gradient(0, #fff, #000);
}
```

### **box-shadow**

通过`box-shaodow`来实现1px也可以，实现原理是将纵坐标的shadow设置为0.5px即可。`box-shadow`属性在Chrome和Firefox下支持小数设置，但是在Safari下不支持。所以使用该方法设置移动端1px时应该慎重使用。

```
div.shadow {
    box-shadow: 0 0.5px 0 0 #000;
}
```

以上的所有方案都是基于`dpr=2`的情况下实现的，此外还需要考虑`dpr=3`的情况。因此，可以根据`media query`来判断屏幕特性，根据不同的屏幕特性进行适当的设置。如下是根据不同的dpr设置`scale`属性。

```
@media all and (-webkit-min-device-pixel-ratio: 2) {
    .scale::after {
        display: block;
        content: '';
        border-bottom: 1px solid #000;
        transform: scaleY(.5);
    }
}

@media all and (-webkit-min-device-pixel-ratio: 3) {
    .scale::after {
        display: block;
        content: '';
        border-bottom: 1px solid #000;
        transform: scaleY(.333);
    }
}
```

### 5.5 设置viewport

通过设置缩放，让`CSS`像素等于真正的物理像素。

例如：当设备像素比为`3`时，我们将页面缩放`1/3`倍，这时`1px`等于一个真正的屏幕像素。

```css
    const scale = 1 / window.devicePixelRatio;
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        window.document.head.appendChild(viewport);
    }
    viewport.setAttribute('content', 'width=device-width,user-scalable=no,initial-scale=' + scale + ',maximum-scale=' + scale + ',minimum-scale=' + scale);
```

实际上，上面这种方案是早先`flexible`采用的方案。

当然，这样做是要付出代价的，这意味着你页面上所有的布局都要按照物理像素来写。这显然是不现实的，这时，我们可以借助`flexible`或`vw、vh`来帮助我们进行适配。





### vh、vw方案

`vh、vw`方案即将视觉视口宽度 `window.innerWidth`和视觉视口高度 `window.innerHeight` 等分为 100 份。

上面的`flexible`方案就是模仿这种方案，因为早些时候`vw`还没有得到很好的兼容。

- `vw(Viewport's width)`：`1vw`等于视觉视口的`1%`
- `vh(Viewport's height)` :`1vh` 为视觉视口高度的`1%`
- `vmin` :  `vw` 和 `vh` 中的较小值
- `vmax` : 选取 `vw` 和 `vh` 中的较大值



![img](https://user-gold-cdn.xitu.io/2019/5/17/16ac3a66a99430fc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



如果视觉视口为`375px`，那么`1vw = 3.75px`，这时`UI`给定一个元素的宽为`75px`（设备独立像素），我们只需要将它设置为`75 / 3.75 = 20vw`。

这里的比例关系我们也不用自己换算，我们可以使用`PostCSS`的 `postcss-px-to-viewport` 插件帮我们完成这个过程。写代码时，我们只需要根据`UI`给的设计图写`px`单位即可。

当然，没有一种方案是十全十美的，`vw`同样有一定的缺陷：

- `px`转换成`vw`不一定能完全整除，因此有一定的像素差。
- 比如当容器使用`vw`，`margin`采用`px`时，很容易造成整体宽度超过`100vw`，从而影响布局效果。当然我们也是可以避免的，例如使用`padding`代替`margin`，结合`calc()`函数使用等等...



软键盘压缩vh布局问题

```js
var h = document.body.scrollHeight;
    window.onresize = function(){
        if (document.body.scrollHeight < h) {
            document.getElementsByTagName("nav")[0].style.display = "none";
        }else{
            document.getElementsByTagName("nav")[0].style.display = "block";
        }
    };
```



检测屏幕翻转

`window.orientation`:获取屏幕旋转方向

```
window.addEventListener("resize", ()=>{
    if (window.orientation === 180 || window.orientation === 0) { 
      // 正常方向或屏幕旋转180度
        console.log('竖屏');
    };
    if (window.orientation === 90 || window.orientation === -90 ){ 
       // 屏幕顺时钟旋转90度或屏幕逆时针旋转90度
        console.log('横屏');
    }  
}); 
复制代码
```

### 8.2 CSS检测横屏

```
@media screen and (orientation: portrait) {
  /*竖屏...*/
} 
@media screen and (orientation: landscape) {
  /*横屏...*/
}
复制代码
```

## 九、图片模糊问题

我们平时使用的图片大多数都属于位图（`png、jpg...`），位图由一个个像素点构成的，每个像素都具有特定的位置和颜色值：

理论上，位图的每个像素对应在屏幕上使用一个物理像素来渲染，才能达到最佳的显示效果。

而在`dpr > 1`的屏幕上，位图的一个像素可能由多个物理像素来渲染，然而这些物理像素点并不能被准确的分配上对应位图像素的颜色，只能取近似值，所以相同的图片在`dpr > 1`的屏幕上就会模糊:



![img](https://user-gold-cdn.xitu.io/2019/5/17/16ac3a67167287de?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### 

使用`img`标签的`srcset`属性，浏览器会自动根据像素密度匹配最佳显示图片：

```
<img src="conardLi_1x.png"
     srcset=" conardLi_2x.png 2x, conardLi_3x.png 3x">
```

使用`window.devicePixelRatio`获取设备像素比，遍历所有图片，替换图片地址：

```
const dpr = window.devicePixelRatio;
const images =  document.querySelectorAll('img');
images.forEach((img)=>{
  img.src.replace(".", `@${dpr}x.`);
})
```





### 2.3 设备像素比（device pixel ratio）

设备像素比(dpr) = 物理像素/设备独立像素。如 iphone 6、7、8 的 dpr 为 2，那么一个设备独立像素便为 4 个物理像素，因此在 css 上设置的 1px 在其屏幕上占据的是 2个物理像素，0.5px 对应的才是其所能展示的最小单位。这就是 1px 在 retina 屏上变粗的原因，目前有很多办法来解决这一问题。



![屏幕快照 2018-10-22 下午4.25.50.png | left | 173x165](https://user-gold-cdn.xitu.io/2018/12/10/1679612a0e09ccb3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



