---
title: "Flex为1时到底怎么个事儿(未完成)"
date: 2024-01-01
tags: []
categories: ["tech_blog"]
author: "quirkybird"
---

> 你有没有想过 CSS 中的 flex属性如何工作?它是 flex-grow，flex-shrink和flex-basis的简写。开发中最常见的写法是flex：1，它表示 flex 项目扩展并填充可用空间。

接下来，我们来详细看看它表示是什么意思。

## flex-grow 属性
flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。flex-grow的值只接受一个整数。考虑下面代码：

```html
<div class="wrapper"> 
  <div class="item item-1"></div> 
  <div class="item item-2"></div> 
  <div class="item item-3"></div> 
</div> 
```
```css
.wrapper { 
    display: flex; 
    flex-wrap: wrap; 
} 
 
.item { 
    flex-grow: 1; 
} 
```
注意：flex-grow会影响宽度或高度，具体取决于flex-direction属性。对于以下示例，默认的flex-direction的值都是row。

在不使用flex-grow的情况下，flex 项目的宽度将默认为其初始宽度。但是，使用flex-grow: 1时，flex 项目会平均剩余可用的空间。
![](https://ishadeed.com/assets/flex-css/flex-grow-1.png)


你可能想知道，flex 项目之间的空间是如何分配的?嗯，这是个好问题，稍后会回答。

在下面的图中，是没有使用flex-grow情况。换句话说，这是它们的自然大小。
![](https://ishadeed.com/assets/flex-css/flex-grow-2.png)

要了解 flex 项目宽度的计算方式，可以参考下面的公式。

我们来计算一下文本是 CSS 的项目宽度。
![](https://ishadeed.com/assets/flex-css/flex-grow-3.png)

**项目宽度 = (( flex-grow / flex-grow 总个数) * 可用空间)+ 初始项目宽度**

多个 flex-grow 值
在前面的示例中，所有flex项目的flex-grow值都相同。现在我们把第一项的flex-grow值改为2。这们它又是如何计算?请注意，本示例的可用空间为498px。
![](https://ishadeed.com/assets/flex-css/flex-grow-4.png)

上图已经解释的很清楚，这里就不在啰嗦了，还不懂的，可以多看几次。

可以用0作为flex-grow的值吗?
当然可以!因为flex-grow属性接受整数值，所以可以使用0,可以防止 flex 项目占用可用空间的一种方式。



这在边界情况下非常有用，我们希望使 flex 项目保持其初始宽度。

flex-grow 不能让 flex 项目相等
有一个常见的误解，使用flex-grow会使项目的宽度相等。这是不正确的，flex-grow的作用是分配可用空间。正如在公式中看到的，每 flex 项目的宽度是基于其初始宽度计算的(应用flex-grow之前的宽度)。

如果你想让项目的宽度相等，可以使用flex-basis，这个在接下来的部分会对此进行讲解。

flex-shrink 属性
flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

考虑下面的例子：中间的项目宽度为300px，flex-shrink的值为```。如果没有足够的空间来容纳所有的项目，则允许项目缩小宽度。



复制
.item-2 { 
    width: 300px; 
    flex-shrink: 1; 
} 
1.
2.
3.
4.
在下列条件下，浏览器会保持项目宽度为300px:

所有项目宽度的总和小于包装器宽度
视窗宽度等于或小于项目
下面是项目在不同视口大小下的行为。



如图所示，在视口宽度大于300px时，宽度为300px，少于 300px，该项目的宽度就被压缩成跟视口一样的宽度。

flex-basis 属性
flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间(main size)。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

flex-basis可以设为跟width或height属性一样的值(比如350px，默认值为 auto)，则项目将占据固定空间。

复制
.item-1 { 
    flex-grow: 0; 
    flex-shrink: 0; 
    flex-basis: 50%; 
} 
1.
2.
3.
4.
5.


在上面的例子中，第一项的宽度为50%。这里需要将flex-grow重置为0，以防止项目宽度超过50%。

如果将 flex-basis 设置为 100%，会怎么样?该项目单独占一行，其他项目将换行。



flex 属性
flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。这也说 flex 项目会根据其内容大小增长

flex 项目相对大小
复制
.item { 
    /* 默认值，相当于 flex：1 1 auto */ 
    flex: auto; 
} 
1.
2.
3.
4.
flex 项目的大小取决于内容。因此，内容越多的flex项目就会越大。



flex 项目绝对大小
相反，当flex-basis属性设置为0时，所有flex项目大小会保持一致。

复制
.item { 
    /* 相当于  flex: 1 1 0% */ 
    flex: 1; 
} 
1.
2.
3.
4.


我喜欢 flex 属性
的几个点!顾名思义，此属性可以灵活使用其值。请看下面的例子。

一个值的情况
复制
.item { 
    flex: 1; 
} 
1.
2.
3.
上面默认对应的值是 1 1 0，也就是 flex-grow: 1，flex-shrink:1, flex-basic: 0。

两个值的情况
复制
.item { 
    flex: 1 1; 
} 
1.
2.
3.
上面对应的值是 1 1 0，也就是 flex-grow: 1，flex-shrink:1, flex-basic: 0。

一个长度值
如果 flex 值是一个长度值，这会作用于flex-basis。flex-grow和flex-shrink默认为1。

复制
.item { 
    flex: 100px; 
    /* flex: 1 1 100px */ 
} 
1.
2.
3.
4.
使用无单位0
有时，你想把 felx-basis 设置为 0，你可能会这样写：

复制
.item { 
    flex: 0; 
} 
1.
2.
3.
不建议这样做，因为让开发人员和浏览器感到困惑。你到底是要把 flex-grow 或者 flex-shirnk 设置为 0，还是将 flex-basis 设置为 0。

所以，你应该添加一个单位，如px或%。

复制
.item { 
    flex: 0%; 
    /* flex: 1 1 0% */ 
} 
1.
2.
3.
4.
建议使用 flex 简写属性
当你需要设置grow、shrink和basis时，最好使用flex属性来实现这个目的。

根据 CSS 规范：

建议开发者使用 `flex` 简写来控制灵活性，而不是直接使用它的普通属性，因为简写的可以正确地重置任何未指定的组件以适应常见情景。
flex 用例
用户头像



flexbox 的一个常见用例是用户组件，头像和文本内容应该在同一行。

复制
<div class="user"> 
 <img class="user__avatar" src="shadeed.jpg" alt="" /> 
 <div> 
  <h3>Ahmad Shadeed</h3> 
  <p>Author of Debugging CSS</p> 
 </div> 
</div> 
1.
2.
3.
4.
5.
6.
7.
复制
.user { 
    display: flex; 
    flex-wrap: wrap; 
    align-items: center; 
} 
 
.user__avatar { 
    flex: 0 0 70px; 
    width: 70px; 
    height: 70px; 
} 
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
11.
上面为 头像 添加了 flex：0 0 70px。如果这里不这样设置，在某些旧版浏览器，图像看起来像被压缩的一样。除此之外，flex 的优先级高于width属性(flex-direction: row)或height(flex-direction: column)。

如果我们仅通过调整flex属性来改变头像的大小，那么width将被浏览器忽略。

复制
.user__avatar { 
    /* width 是 100px, 不是 70px */ 
    flex: 0 0 100px; 
    width: 70px; 
    height: 70px; 
} 
1.
2.
3.
4.
5.
6.
头部


如果想让一个标题填满所有可用的空间，使用flex: 1非常适合这种情况。

复制
.page-header { 
    display: flex; 
    flex-wrap: wrap;  
} 
 
.page-header__title { 
    flex: 1; 
} 
1.
2.
3.
4.
5.
6.
7.
8.
输入框



复制
form { 
    display: flex; 
    flex-wrap: wrap;  
} 
 
input { 
    flex: 1; 
    /* Other styles */ 
} 
1.
2.
3.
4.
5.
6.
7.
8.
9.
在两张卡片上对齐最后一项



假设CSS grid具有两列布局。这里的问题是日期没有对齐，它们应该在同一条线上(红色那条)。

我们可以使用flexbox做到这一点。

复制
<div class="card"> 
 <img src="thumb.jpg" alt=""> 
 <h3 class="card__title">Title short</h3> 
 <time class="card__date"></time> 
</div> 
1.
2.
3.
4.
5.
通过设置flex-direction: column，我们可以在标题上使用flex-grow使其填充可用空间，这样，即使标题很短也将日期保留在末尾。

复制
.card { 
    display: flex; 
    flex-direction: column; 
} 
 
/* 第一个解决方案 */ 
.card__title { 
    flex-grow: 1; 
} 
1.
2.
3.
4.
5.
6.
7.
8.
9.
同样，无需使用flex-grow也可实现，我们使用margin-top: auto

复制
/* 第二个解决方案*/ 
.card__date { 
    margin-top: auto; 
} 
1.
2.
3.
4.
用例 - 多个 flex 属性
这里的意思是使用flex-grow或flex-shrink，但值不为1。在本节中，我们会探讨一些可以将其合并的想法。

footer


像上面这样的布局， 我们可以这样写：

复制
.actions { 
    display: flex; 
    flex-wrap: wrap; 
} 
 
.actions__item { 
    flex: 2; 
} 
 
.actions__item.user { 
    flex: 1; 
} 
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
11.
12.
扩展动画


我们可以做的一件有趣的事情是在悬停时为flex项目设置动画。这很有用的，下面是一个简单的例子：

复制
.palette { 
    display: flex; 
    flex-wrap: wrap; 
} 
 
.palette__item { 
    flex: 1; 
    transition: flex 0.3s ease-out; 
} 
 
.palette__item:hover { 
    flex: 4; 
} 
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
11.
12.
13.


增加的用户体验



源码：https://codepen.io/shshaw/pen/EbjvbQ

当内容大于其包装器时



不久前，我收到一个读者的问题，他的问题如下。如图所示，两个图像应保留在其包装的边界内。

复制
.wrapper { 
    display: flex; 
} 
 
.wrapper img { 
    flex: 1; 
} 
1.
2.
3.
4.
5.
6.
7.
这里，即使 使用了 flex: 1，图像仍然会溢出。根据CSS规范：

默认情况下，flex 项目不会缩小到其最小内容大小(最长的单词或固定大小的元素的长度)以下。要更改此设置，请设置min-width或min-height属性。

上面情况，是由于图片太大，flexbox不会缩小图片。要更改此行为，我们需要设置以下内容：

复制
.wrapper img { 
    flex: 1; 
    min-width: 0; 
} 
1.
2.
3.
4.
作者：Ahmad shaded 译者：前端小智

来源：sitepoint 原文：https://ishadeed.com/article/css-flex-property/