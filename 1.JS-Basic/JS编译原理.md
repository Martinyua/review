## JIT

**即时编译**（英语：Just-in-time compilation，缩写：JIT）
通常，程序有两种运行方式：

- 静态编译: 程序在执行前全部被翻译为机器码 ( `C`/`C++` )
- 动态解释: 一句一句边运行边翻译 ( `PHP` )

即时编译器则混合了这二者，一句一句编译源代码，但是会将翻译过的代码缓存起来以降低性能损耗。相对于静态编译代码，即时编译的代码可以处理延迟绑定并增强安全性。 在早期 `JavaScript` 采用动态解释的方式，也就是人们常说的解释性语言。
但是为了提高 `JavaScript` 的性能, 很多 JavaScript 引擎采用了 JIT 技术。

## 编译

在传统编译语言的流程中，程序中的一段源代码在执行之前会经历三个步骤，统称为“编译”。

- 分词/词法分析（`Tokenizing/Lexing`）
  这个过程会将由字符组成的字符串分解成（对编程语言来说）有意义的代码块，这些代码块被称为词法单元（`token`）。例如，考虑程序 `var a = 2`;。这段程序通常会被分解成 为下面这些词法单元：`var、a、=、2 、;`。空格是否会被当作词法单元，取决于空格在这门语言中是否具有意义。
- 解析/语法分析（`Parsing`）
  这个过程是将词法单元流（数组）转换成一个由元素逐级嵌套所组成的代表了程序语法结构的树。这个树被称为“抽象语法树”（`Abstract Syntax Tree，AST`）。
- 代码生成
  将 `AST` 转换为可执行代码的过程称被称为代码生成。这个过程与语言、目标平台等息息相关。抛开具体细节，简单来说就是有某种方法可以将`var a = 2`; 的AST 转化为一组机器指令，用来创建一个叫作 `a` 的变量（包括分配内存等），并将一个值储存在 `a` 中。

## V8 引擎

`V8` 引擎执行 `JavaScript` , 主要依赖四个模块

- `parse`：负责将 `JavaScript` 源代码转换成抽象语法树（`AST`）
- `Ignition`： `interpreter`，解释器，将AST转换成字节码（`Bytecode`），解析执行字节码，同时也收集 `TurboFan` 优化编译所需要的信息
- `baseline compiler`: 基线编译器, 生成没有优化的机器码
- `TurboFan` `Grankshaft`：利用 `Ignitio` 所收集的类型信息，将字节码转换为优化的机器码
- `Orinoco`：`garbage collector`，垃圾回收模块，负责将程序不再需要的内存空间回收

![img](https://www.trayvonren.top/img/javascript/0_qAm73-SdFjB2AcuX.png)

## 参考资料

《你不知道的JavaScript 上》
[JavaScript V8 Engine Explained](https://hackernoon.com/javascript-v8-engine-explained-3f940148d4ef)