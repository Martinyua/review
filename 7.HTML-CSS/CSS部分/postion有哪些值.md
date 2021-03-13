1.relative：生成**相对定位**的元素，通过top,bottom,left,right的设置相对于其正常（原先本身）位置进行定位。可通过z-index进行层次分级。

2.absolute：生成**绝对定位**的元素，相对于 static 定位以外的第一个父元素进行定位。元素的位置通过 “left”, “top”, “right” 以及 “bottom” 属性进行规定。可通过z-index进行层次分级。

3.fixed：生成**绝对定位**的元素，相对于**浏览器窗口**进行定位。元素的位置通过 “left”, “top”, “right” 以及 “bottom” 属性进行规定。可通过z-index进行层次分级。

4.static：**默认值**。没有定位，元素出现在正常的流中（忽略 top, bottom, left, right 或者 z-index 声明）。