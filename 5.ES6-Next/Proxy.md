### 元编程

> 元编程是指某类计算机程序的编写，这类计算机程序`编写或者操纵其他程序(或者自身)`作为他们的数据,或者`在运行时完成部分本应在编译时完成的工作`。很多情况下与手工编写全部代码相比工作效率更高。

我理解的元编程：**对编程语言进行编程。在运行时完成应该在编译时完成的工作。**提高效率



### Proxy

#### 基本含义

* Proxy用于修**改某些操作的默认行为**，即同于在语言层面做出修改。

* Proxy可以理解为`在目标对象之前架设一层拦截`，外界对该对象的访问，都必须先通过这层拦截。

#### 参数

- new Proxy(target,handler)接收两个参数，表示目标对象和内部监听对象。第一个是要被代理的对象。第二个就是拦截器对象。

  

#### 如何使用

通过`new Proxy`创建一个Proxy实例。创建实例时传入两个参数，分别是target和handler

#### 使用实例

如果handler对象设置了拦截，就执行handler的拦截。否则执行target原有的方法。

##### get拦截

```js
 // 声明一个拦截器对象，属性就是要监听的对象属性
 var handler={
  get:function(target,name){
   if(target.hasOwnProperty(name)){
    return `对象包含有${name}属性`
   }else{ 
    return `对象没有${name}属性`
   }
  }
 }
 // 给obj对象绑定拦截器，然后创建拦截器实例
 var obj={name:'yiye',f:()=>{}}
 var p=new Proxy(obj,handler)
 // 1. 直接使用Proxy实例的属性
 console.log(p.name);//对象包含有name属性
 console.log(p.age);//对象没有age属性
    // 1.2 给Proxy实例赋值(但是被拦截了，所以修改不生效，除非Proxy去修改)
    p.name="改变"
    console.log(p.name);//对象包含有name属性
 // 2.此时没有拦截函数，所以会提示不是函数
 console.log(p.f());//p.f is not a function
 // 3. 如果调用对象不存在的函数则会提示变量不是函数
 console.log(p.foo());//p.foo is not a function

```



##### set拦截

- handler内部监听的方法为`set的时候`有三个参数，(target,name,value),`target表示目标对象，name表示属性名，value表示值`。其实还可以有一个可选参数就是proxy本身

```
 // 声明一个拦截器
 var handler={
 set:function(target,name,value){
  target[name]="set+"+value;
 }
 }
 // 给obj对象绑定拦截器，然后创建拦截器实例
 var obj={name:'yiye',f:()=>{}}
 var p=new Proxy(obj,handler)
 // 1. 直接使用Proxy实例的属性
 console.log(p.name);//yiye
    // 1.2 给Proxy实例赋值
    p.name="改变"
    console.log(p.name);//set+改变
```

#### Proxy.revocable()返回一个可取消的Proxy实例



#### this指向

- proxy会进行代理，但是这种代理`不会使得this指向改变`

  ```js
   var obj={
    m:function(){
     console.log(this===proxy)
    }
   }
   var handler={}
   var proxy=new Proxy(obj,handler)
   // obj对象调用m属性方法，所以内部this指的是obj
   obj.m();//false
   // proxy代理器实例对象调用m属性方法，所以内部this指向的是proxy
   proxy.m();//true
  
  ```



### Object.defineProperty

`Object.defineProperty()` 方法会直接在一个**对象上定义一个新属性**，或者**修改一个对象的现有属性**，并返回此对象。

语法：`Object.defineProperty(obj, prop, descriptor)`

`obj`:要定义属性的对象

`prop`:要定义或者要修改的**属性的名称**

`descriptor`:要定义或者要修改的**属性标识符**



该方法允许精确地添加或修改对象的属性。**通过赋值操作添加的普通属性是可枚举的**，在枚举对象属性时会被枚举到（[`for...in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 或 [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)[ ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)方法），可以改变这些属性的值，也可以[`删除`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/delete)这些属性。这个方法允许修改默认的额外选项（或配置）。默认情况下，使用 `Object.defineProperty()` 添加的属性值是不可修改（immutable）的。



#### 使用实例

```js
const object1 = {};

Object.defineProperty(object1, 'property1', {
  value: 42,
  writable: false
});

object1.property1 = 77;
// throws an error in strict mode

console.log(object1.property1);
// expected output: 42

```

**通过它定义的属性默认是不可枚举的。**