## line-height是什么
line-height行高属性，用于设置多行元素的空间量，如多行文本的间距。对于块级元素，它指定元素行盒（line boxes）的最小高度。对于非替代的 inline 元素，它用于计算行盒（line box）的高度。常用的值normal（自适应改变行高，取决于客户端，如果是firefox，默认为1.2；与font-size和font-family紧密联系），number（无单位数字，与字体大小相乘，推荐，不会在继承时发生不确定性，），length，percentage（百分比，与元素自身的字体大小有关）。

## line-height常见应用场景
单行文本实现垂直居中：让父元素的line-height=height
多行文本实现垂直居中：块级元素div里面包含行内元素span，形成一个line-box；浏览器渲染时，在行框盒子前渲染一个宽度为0，高度为line-height的空白节点，来撑开div的高度；
    将span设置为行内块级元素，设置宽高，利用vertical-align：middle和空白节点居中对齐，sapn要设置line-height，否则继承的是父元素的line-height。

## vertical-align的作用范围&&vertical-align: baseline(基线)
对行内元素和行内块级元素起效，block不起作用。

## 行内框盒子模型与幽灵空白节点
幽灵空白节点：浏览器在渲染的时候,会每一个行框盒子(linebox)前面渲染一个宽度为零高度为行高的空白节点,就跟文字的表现一样。
当图片与文字排列时，图片距离底部有间隔：首先:浏览器有默认的font-size,如在chrome中为16px,
其次:line-height不作用于外部的div,作用于内部的元素,line-heiht默认的属性值为normal, 为font-size的1.0~1.2倍,具体由浏览器决定,导致了行间距和半行间距大于0
再次:文字和图片按基线对齐,因此底部会出现宽度为半行距的空隙
最后:由于浏览器的渲染机制,导致空白节点的表现和文字的变现一样.

消除间隔：1. 让img为block元素 2. img的vertical-align：middle或其它，不设置baseline即可。3.去除行间距，line-height，或者font-size为0

## line-height中1.5和150%区别
1.5根据字体大小和数字相乘得到行高，不受继承的影响；而150%会根据父元素的字体大小计算出行高，在让子元素继承。

## line-height设置为1.5利于无障碍方面
主段落内容的 line-height 至少应为 1.5。 这将有助于改善低可视条件下的体验，也对认知阻碍者，如阅读困难者，有帮助。如果文字的大小要随页面的缩放而变化，请使用无单位的值，以确保行高也会等比例缩放。