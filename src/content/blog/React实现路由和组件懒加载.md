---
title: "React中路由懒加载和组件懒加载"
date: 2024-07-24
tags: []
cover: "1703316470364react.png"
categories: ["tech_blog"]
author: "quirkybird"
summary_text: "文章介绍了React路由和组件懒加载的实现。作者因面试未答出路由懒加载而决定学习。核心方法是使用React的`lazy` API包裹动态导入的组件，如`lazy(() => import('./component'))`。为处理加载时的白屏或错误，需配合`Suspense`组件，提供一个`fallback`（如加载指示器）。路由懒加载时，将`Outlet`包裹在`Suspense`中；组件懒加载则在条件渲染时使用。文章强调组件懒加载能避免即使条件渲染也执行未渲染代码导致的性能问题。"
---

> 对于 React 老手来说，哈？懒加载都不会，学啥 React 嘛，不过对于看文档学习 React 来实现自己的博客来说，懒加载路由和组件咱也没想过要使用，这或许就是看视频和自己翻文档学习的差别，视频会有别人使用该技术的最佳实践，自己就瞎琢磨吧

让笔者想起这个问题的原因是参加一个公司的前端实习面试，面试官问我：React 实现路由懒加载？  
我回答:使用 require()，传入一个箭头函数，里面导入组件（💦💦💦，当时的想法是咱也在 React 项目里面使用过路由懒加载啊，只是记得 Vue3 中是使用`() => import()`做的，哪怕是回答一个`import()`也比 require()强啊，现在想想尴尬极了，怪不得当时面试官只是疑问的说 require?然后淡淡的“嗯”，直接下一个问题）

尴尬归尴尬啊，咱们要从中汲取经验，这就来给自己的 yamorz 站点加一个路由懒加载，下次再问咱们可就不怕了 😎😎😎

通过文档很快就可以解决这个问题，主要就是使用到 React 的一个 API -> `lazy`

这个属性可以完成路由懒加载和组件懒加载，我们先说路由懒加载，其实就是用`lazy`包裹一个返回 Promise 的函数，返回一个 React 组件具体来说就是：

```js
import { lazy } from "react";

const Blog = lazy(() => import("./components/Blog"));
```

接下来我们需要用`Suspense`组件来处理懒加载路由暂时还没加载时的应急处理，本身应该是白屏，React 给出了以下错误：

> A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.

我们不使用`startTransition`,使用刚刚提到的`Suspense`组件（启用了 Suspense 的路由在默认情况下会将导航更新包装至 transition 中），由于我们使用 React Router v6 中的`createBrowserRouter`, 包裹在渲染用的`<Outlet />`即可

```js
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

<Suspense fallback={<Loading />}>
  <Outlet />
</Suspense>;
```

如此设置之后，路由加载时，处于暂停状态，将显示`<Loading />`，至此，路由懒加载完成

接下来在演示一下如何实现组件懒加载，其实开始我还有一个疑惑，组件懒加载没必要啊，我是用条件渲染不就可以控制组件是否渲染吗 ❓ 查了一下才知道，原来就算是条件渲染 React 也会执行未渲染的代码，造成性能问题，特别是需要加载一个相对较大的组件时
举一个组件懒加载的小例子：

```js
import { lazy, Suspense, useState } from "react";
import Loading from "./components/common/Loading";

const MyComponent = lazy(() => import("./component/MyComponent"));

const App = () => {
  const [isShow, setIsShow] = useState(false);
  return (
    <section>
      <h2>点击按钮查看精彩内容🔥</h2>
      {isShow && (
        <Suspense fallback={<Loading />}>
          <h2>BOOM!</h2>
          <MyComponent />
        </Suspense>
      )}
      <button onClick={() => setIsShow(true)}></button>
    </section>
  );
};

export default App;
```

> 参考内容：
> [lazy 能够让你在组件第一次被渲染之前延迟加载组件的代码。](https://react.docschina.org/reference/react/lazy) > [<Suspense> 允许在子组件完成加载前展示后备方案](https://react.docschina.org/reference/react/Suspense) > [startTransition 可以让你在不阻塞 UI 的情况下更新 state](https://react.docschina.org/reference/react/startTransition)
