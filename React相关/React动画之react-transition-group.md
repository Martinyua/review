## react-transition-group 基础知识

> 官方文档看这里：[react-transition-group文档](https://reactcommunity.org/react-transition-group/)

- 在 react 项目中可使用官网提供的动画过渡库 react-transition-group 来实现切换页面（路由切换）时的过渡效果。
- react-transition-group 中，暴露了三个组件，分别是：
  - `Transition`
  - `CSSTransition`：最重要
  - `TransitionGroup`：用于列表项的过渡动画。 不提供任何形式的动画，具体的动画取决与我们包裹的 `Transition` | `CSSTransition` 的动画，所以我们可以在列表里面做出不同类型的动画。
- `CSSTransition` 组件中较为重要的 api 有：
  - `in：boolean`，控制组件**显示与隐藏**，`true`  显示，`false` 隐藏。
  - `timeout：number`，**延迟**，涉及到动画状态的持续时间。也可传入一个对象，如`{ exit:300, enter:500 }` 来分别设置进入和离开的延时。
  - `classNames：string`，动画进行时给元素添加的**类名**。一般利用这个属性来设计动画。
  - unmountOnExit：boolean，为 `true` 时组件将**移除处于隐藏状态的元素**，为 `false` 时组件保持动画结束时的状态而不移除元素。一般要设成 `true`。
  - appear：boolean，为 `false` 时当 `CSSTransition` 控件加载完毕后不执行动画，为 `true` 时控件**加载完毕则立即执行动画**。如果要组件初次渲染就有动画，则需要设成 `true`。
  - key：string，这个属性是配合 `TransitionGroup` 组件来使用的，可以通过key来判断是否需要触发动画。这个属性十分重要！
- classNames属性的作用是：当组件被应用动画时，不同的动画状态（enter，exits，done）将作为className属性的后缀来拼接为新的className，如为 `CSSTransition`组件设置了以下属性：

```jsx
<CSSTransition
   classNames={'fade'}
   appear={true}
   key={location.pathname}
   timeout={300}
   unmountOnExit={true}
>
          /* 省略... */
</CSSTransition>
```

- 将会生成 `fade-enter`、`fade-enter-active`、`fade-enter-done`、`fade-exit`、`fade-exite-active`、`fade-exit-done`、`fade-appear` 以及 `fade-appear-active`多个className。每一个独立的className都对应着单独的状态。

## 简单示例

**对于一个元素开发动画**

```jsx
//App.js
import { CSSTransition } from 'react-transition-group'
import React, { Component } from 'react';
import './style.css'
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isShow: true
    }
    this.toToggole = this.toToggole.bind(this)
  }
  render() { 
    return ( 
      <div>
        <CSSTransition
            <!-- in表示是否出现 timeout表示动画延时 -->
            in={this.state.isShow}
            timeout={2000}
            <!-- classNames是钩子名，为后面的class名前缀 -->
            classNames="test"
            <!-- unmountOnExit表示元素隐藏则相应的DOM被移除 -->
            unmountOnExit
            <!-- appear设为true表示进场动画,CSS中有对应类名 -->
            appear={true}
            <!--以下为动画钩子函数, 与CSS中相对应-->
            onEnter={(el) => {}}
            onEntering={(el) => {}}
            onEntered={(el) => {}}
            onExit={(el) => {}}
            onExiting={(el) => {}}
            onExited={(el) => {}}
        >
          <div>hello</div>
        </CSSTransition>
        <div><button onClick={this.toToggole}>点我</button></div>
      </div>  
    );
  }
  toToggole() {
    this.setState({
      isShow: !this.state.isShow
    })
  }
}
 
export default App;

```

```css
//进场前的瞬间
.test-enter, .test-appear{
    opacity: 0;
}
//进场过程中
.test-enter-active, .test-appear-active{
    opacity: 1;
    transition: opacity 2000ms;
}
//进场之后
.test-enter-done{
    opacity: 1;
}
//离开前的瞬间
.test-exit{
    opacity: 1;
}
//离开过程中
.test-exit-active{
    opacity: 0;
    transition: opacity 2000ms;
}
//离开后
.test-exit-done{
    opacity: 0;
}
```

**对于一组元素开发动画**

```jsx
//App.js
//CSS文件和style.css相同
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import React, { Component } from 'react';
import './style.css'
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      list: []
    }
    this.handleAddItem = this.handleAddItem.bind(this)
  }
  render() { 
    return ( 
      <div>
        <TransitionGroup>
        {
          this.state.list.map((item, index) => {
            return (
              <CSSTransition
              timeout={2000}
              classNames="test"
              unmountOnExit
              onEntered={(el) => {el.style.color='blue'}}
              appear={true}
              >
                <div key={index}>{item}</div>
              </CSSTransition>
            )
          })
        }
        </TransitionGroup>
        <div><button onClick={this.handleAddItem}>点我</button></div>
      </div>  
    );
  }
  handleAddItem() {
    this.setState((prevState) => {
      return {
        list: [...prevState.list, 'item']
      }
    })
  }
}
 
export default App;
```



## 参考

- [使用react-transition-group开发React动画](https://juejin.im/post/6844903869894524942#heading-0)

- [react-transition-group实现路由切换过渡效果](https://juejin.im/post/6844903922574819342#heading-0)