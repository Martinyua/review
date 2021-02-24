# DOM高度等

***\*obj.offsetTop 指 obj 距离上方或上层控件的位置，整型，单位像素。\****

***\*obj.offsetLeft 指 obj 距离左方或上层控件的位置，整型，单位像素。\****

***\*obj.offsetWidth 指 obj 控件自身的宽度，整型，单位像素。\****

***\*obj.offsetHeight 指 obj 控件自身的高度，整型，单位像素。\****

**一、offsetTop 返回的是数字，而 style.top 返回的是字符串，除了数字外还带有单位：px。**

**二、offsetTop 只读，而 style.top 可读写。**

**三、如果没有给 HTML 元素指定过 top 样式，则 style.top 返回的是空字符串。**

**offsetParent  :**

当前对象的上级层对象.

**scrollLeft :**

对象的最左边到对象在当前窗口显示的范围内的左边的距离．

即是在出现了横向滚动条的情况下，滚动条拉动的距离．

**scrollTop**

对象的最顶部到对象在当前窗口显示的范围内的顶边的距离．

即是在出现了纵向滚动条的情况下，滚动条拉动的距离．