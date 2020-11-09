> 今天看了react的生命周期函数。感觉旧的生命周期函数还是比较好理解，新的生命周期函数里面的getDerivedStateFromProps(nextProps,prevState)和getSnapshotBeforeUpdate()稍微难以理解一些。然后还看了为什么要在componentDidMount()请求数据，为什么不在WillMount和constructor里面进行网络请求。react为什么要废弃三个Will。下面好好总结一下

1. 先贴上新旧生命周期的图。

![4AEECB5076F7D2A95A844D86BA139209](D:\QQ接受文件\MobileFile\4AEECB5076F7D2A95A844D86BA139209.png)

![AF75C57F2F291CE5F7F73488A92E05B4](D:\QQ接受文件\MobileFile\AF75C57F2F291CE5F7F73488A92E05B4.png)

![D9362451E89E465C85887EDB05C663D0](D:\QQ接受文件\MobileFile\D9362451E89E465C85887EDB05C663D0.png)

参考链接：

[为何要在componentDidMount里面发送请求](https://juejin.im/post/6844903782044663816)

[react生命周期以及改变](https://www.cnblogs.com/rkpbk/p/11019738.html)

[React的生命周期](https://www.jianshu.com/p/b331d0e4b398)

