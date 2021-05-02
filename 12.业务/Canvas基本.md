### 基本使用

1. 创建canvas标签

   ```
   <!-- canvas 标签不兼容则默认转成 div。 -->
   <!-- 避免使用 css 定宽高，这将与 canvas 的初始化宽高冲突，出现拉伸等形变。 -->
   <canvas id="canvasElem" width=600 height=600>
     你的浏览器不支持 canvas，请先升级浏览器。
   </canvas>
   ```

2. 通过`getContext`获取画笔ctx

   ```
   let canvas = document.querySelector('#canvasElem')
   if (canvas.getContext) {
   	// Context 对象就是 JavaScript 操作 Canvas 的接口，入参可选：2d/webgl
   	// 绘制 2d 上下文，记住这个 ctx 变量
   	let ctx = canvas.getContext('2d')
   } else {
   	alert('你的浏览器不支持 canvas，请先升级浏览器。')
   }
   
   ```

3. 坐标系

   canvas的坐标原点(0,0)是从画布左上角开始的

### 常用api

* `ctx.moveTo(x, y)`：移动画笔到 (x, y) 点后开始绘制。
* `ctx.lineTo(x, y)`：从 `moveTo` 的点到 `lineTo` 的点的线段。
* `ctx.stroke`:自动描边
* `ctx.fill`：将绘制的封闭区域进行填充



#### 矩形

* 填充以(x,y)为起点宽高分别为width、height的矩形 默认为黑色

    ```
    fillRect( x , y , width , height)  
    ```

* 绘制一个空心以(x,y)为起点宽高分别为width、height的矩形

  ```
  stokeRect( x , y , width , height)
  ```

* 清除以(x,y)为起点宽高分别为width、height的矩形 为透明 

  ```
  clearRect( x, y , width , height ) 
  ```

#### 路径

```
beginPath() 新建一条路径一旦创建成功 绘制命令将转移到新建的路径上
moveTo( x, y ) 移动画笔到(x , y) 点开始后面的绘制工作
closePath() 关闭该路径 将绘制指令重新转移到上下文
stroke() 将绘制的路径进行描边
fill() 将绘制的封闭区域进行填充
```



### 样式添加

```
fillStyle = color

strokeStyle = color 

//color 可以为颜色值、渐变对象(并非样式！！！！)

lineWidth  = value  线宽

```

#### 透明度

```
ctx.globalAlpha = value (0~1)
```

#### 绘制图片

```
drawImage( image , x , y , width , height ) image为图片对象、从(x,y)处放置宽高分别为width height的图片

drawImage( image , sx , sy , swidth , sheight ,dx ,dy ,dwidth ,dheight) 切片前四个是定义图像源的切片
```

#### 状态保存 恢复

```
save()

restore()

```

#### 动作

```
translate( x , y ) 将canvas原点的移动到 (x,y)     （save&restore保存初始状态！！！）

rotate( angle ) 顺时针方向旋转坐标轴 angle弧度

scale(x,y) 将图形横向缩放x倍、纵向缩放y倍   （ x、y大于1是放大  小于1为缩放！！！）

```

#### 裁剪

```
clip //只显示裁剪区域内部区域  (使用save & restore 存储canvas状态！！！)
复制代码
```

#### 动画

```
clearRect() 清空画布

save&restore 保存恢复canvas状态
```

[参考](https://juejin.cn/post/6844903722196140040#heading-33)

