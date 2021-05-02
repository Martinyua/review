> react-redux库提供Provider组件通过context方式向应用注入store，然后可以使用connect高阶方法，获取并监听store，然后根据store state和组件自身props计算得到新props，注入该组件，并且可以通过监听store，比较计算出的新props判断是否需要更新组件。

![img](https://pic4.zhimg.com/80/v2-57970b85535b4abe1ddf3a0550ac569f_720w.jpg)

- **Provider**组件将store注入整个React应用的某个入口组件，通常是应用的顶层组件。Provider组件使用context向下传递store。
- Redux不提供直接操作store state的方式，我们只能通过其getState访问数据，或通过dispatch一个action来改变store state。这也正是react-redux提供的**connect高阶方法**所提供的能力。

**connect()**

![img](https://pic1.zhimg.com/80/v2-2cc510c6ad9df63604870750449225c4_720w.jpg)