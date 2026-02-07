---
title: "伪元素content自定义问题"
date: 2024-05-18
tags: []
cover: "1702887621404Slice 1.png"
categories: ["tech_blog"]
author: "quirkybird"
summary_text: "作者在博客中遇到伪元素动态设置 `content` 无效的问题。他旨在通过代码块的 `::after` 伪元素在右上角显示语言名称。

最初尝试是设置 `content: var(--code-lang)`，然后使用 JavaScript 动态更新 CSS 变量 `--code-lang`。然而，此方案未能生效，原因在于伪元素的 `content` 属性需要初始值，且即使设置了初始值也未解决问题。

最终，作者通过利用数据属性（data attributes）找到了解决方案。具体做法是：在代码块元素上设置 `data-after-content` 属性，CSS 中使用 `content: attr(data-after-content)` 来引用该属性值，再通过 JavaScript 动态修改 `data-after-content` 的值。此方法成功实现了在代码块右上角显示语言名称的效果。"
---

> 笔者昨天遇到一个伪元素动态设置 content 无效的问题，始终找不到原因，看来前端编程就是靠捣鼓，如果没有解决问题就一直捣鼓，最终还是解决了。

场景是这样的：我想为我的博客的代码块添加一个显示语言名称的效果，使用代码块伪元素实现，添加到右上角，伪元素的`content`设置为`var(--code-lang)`，检测出语言后，使用 JS 动态设置代码块元素的 CSS 变量`--code-lang`为语言名称,从而实现显示语言名称的效果。

事实上，上述方案行不通，接下来一起看看历程及解决方案吧。

首先，设置好代码块`pre`对应的样式，特别是`content: var(--code-lang)`

```css
pre {
  position: relative;
  border-left: 5px solid #b9ccdb;
}
pre::after {
  content: var(--code-lang);
  position: absolute;
  right: 10px;
  top: 5px;
  display: inline-block;
  color: #3559e0;
  font-size: clamp(12px 0.4em 16px);
}
```

我使用`react-markdown`进行的 markdown 渲染，它允许使用 JSX 语法对标签进行自定义渲染，并可以检测语言名称简写，在`className`参数中，例如 JS，得到`language-js`，把 JS 提取出来就好了

```js
// 组件中有两个全局变量
const lang = useRef();
const langList = useRef([]);
// 处理code渲染的函数
const codeBlock = ({ className, children, node }) => {
  if (className) {
    lang.current = className.split("-")[1].toUpperCase();
    langList.current.push(lang.current);
  }
  return <code>{children}</code>;
};
```

接下来动态设置好 css 变量`--code-lang`

```js
useEffect(() => {
  const codes = document.querySelectorAll("pre");
  const codeBlocks = [...codes];
  for (let index in codeBlocks) {
    // 给每一个代码块对应索引设置好css变量
    codeBlocks[index].style.setProperty("--code-lang", langList.current[index]);
  }
}, []);
```

好，一切顺利，我们等待奇迹发生(☆▽☆)，然而页面并没有任何显示 😭😭😭，这就奇了怪了，逻辑看起来很通畅啊，于是我 Google，看到一位网友的帖子：[css：伪元素:before 和:after 为什么需要指定一个 content](https://blog.csdn.net/weixin_41981909/article/details/106335340)  
总结起来就是伪元素的 content 必须要有初始值，我一开始设置的`var(--code-lang)`为`undefined`,所以根本没有把::after 设置上

> 我一开始问的 GPT，它依然告诉我就如此设置，看来 GPT 也无法理解太细的内容，更何况，它经常造一堆根本不存在的 API

那么问题就来了，我在 pre 中设置一个`--code-lang`的初始值就可以了，对，我的确这样做了，但结果依然不显示结果，在控制台中的确显示了这个变量的正确值，到现在我都不知道怎么回事，知道的朋友欢迎来交流下你的想法  
最后，我还是找到了解决办法就是利用数据属性，具体如下（仅展示核心代码内容）：  
先在渲染代码块时，设置好 data 属性

```js
const preEle = ({ children, node }) => {
  return <pre data-after-content="">{children}</pre>;
};
```

接着，css 设置使用`attr()`CSS 函数，用于访问元素属性

```css
pre::after {
  content: attr(data-after-content);
  //...
}
```

最后，动态改变`data-after-content`

```js
//...
for (let index in codeBlocks) {
  // 先给他们设置上数据属性
  codeBlocks[index].dataset.afterContent = langList.current[index];
}
```

至此，我们的代码名称可以在右上角正常显示，也就是你现在看到代码块的样子
