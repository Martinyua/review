### 1px问题



### 问题原因

一、前言
关于，前端1px像素的问题，网上已经有很多相关的文章了，
但是，关于这个问题的原因网上没有几个说到点子上的，甚至还大谈dpr。。。比如什么dpr是2时css1px在移动端是2px物理像素所以变粗了，那请问css2px在移动端变成了4px那为什么没有变粗的问题，为什么只有1px才有视觉效果变粗的问题？？？
因为这个问题和dpr没有任何关系，dpr可以用来解释不同手机呈现页面的精细度的差异，但并不能解释1px问题。

二、真正的原因：
**我们做移动端页面时一般都会设置meta标签viewport的content=“width=device-width”，**
**这里就是把html视窗宽度大小设置等于设备宽度的大小，大多数手机的屏幕设备宽度都差不多，**
**以iphoneX为例，屏幕宽度375px。**

而UI给设计图的时候基本上都是给的二倍图甚至三倍图，假设设计图是750px的二倍图，在750px上设计了1px的边框，要拿到375px宽度的手机来显示，就相当于整体设计图缩小了一倍，所以750px设计图里的1px边框在375px手机设备上要以0.5px来呈现才符合预期效果，然而css里最低只支持1px大小，不足1px就以1px显示，所以你看到的就显得边框较粗，实际上只是设计图整体缩小了，而1px的边框没有跟着缩小导致的。（ps：ios较新版已经支持0.5px了，这里暂且忽略）

三、总结
简而言之就是：
**多倍的设计图设计了1px的边框，在手机上缩小呈现时，由于css最低只支持显示1px大小，导致边框太粗的效果。**

### 解决方案：

1. 直接写成0.5px。

2. 通过border-image

3. box-shadow

4. 使用伪类

   ```
   .setBorderAll{
        position: relative;
          &:after{
              content:" ";
              position:absolute;
              top: 0;
              left: 0;
              width: 200%;
              height: 200%;
              transform: scale(0.5);
              transform-origin: left top;
              box-sizing: border-box;
              border: 1px solid #E5E5E5;
              border-radius: 4px;
         }
       }
   
   ```

   同样为伪元素设置绝对定位，并且和父元素左上角对其。将伪元素的长和宽先放大2倍，然后再设置一个边框，以左上角为中心，缩放到原来的`0.5倍`

5. 使用rem + `viewport`的scale

* 根据设备像素dpr来设置initial-scale (缩放)