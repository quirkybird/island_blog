---
title: "Promise处理并发任务"
date: 2024-01-01
tags: []
categories: ["tech_blog"]
author: "quirkybird"
---

Promise 的出现解决了地狱回调问题，在以前，我们要实现一个任务的异步处理必须要使用 callback，一旦满足某个条件，就执行回调函数，造成代码无限嵌套，代码的可读性大大下降，我们常常面对一大堆括号，大概长这样：

![5236f565eece3195cb41be76c4eab9cd.jpg](https://cdn.file.fastcuthub.com/blog/5236f565eece3195cb41be76c4eab9cd.jpg)

2015 年发布的 ES6 给我们带来了 Promise，极大的方便了我们执行异步操作和并发任务。

### Promise 有三种状态

- pending 待定状态
- fulfilled 已兑现
- rejected 已拒绝

promise 只会有一种状态，如果是已兑现，就不可能变为拒绝
![MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/promises.png)

> 本文省略 promise 的基本异步操作使用，着重了解一下 promise 的并发任务

### 并发任务

Promise 为什么提供了四个静态方法

- `Promise.all()`
- `Promise.allSettled()`
- `Promise.any()`
- `Promise.race()`

#### Promise.all()

传入一个可迭代对象，等待所有 promise 兑现后，所有兑现后返回一个 promise 对象，兑现后一个包含传入 promise 兑现后的数组(按照传入数组 promise 顺序)，如果有一个被拒绝，则返回第一个拒绝的信息，如果传入是已经兑现的值，也等待异步执行。
示例代码:

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("1111");
  }, 1000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
    // reject("error message")
  }, 2000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("3333");
  }, 3000);
});

// 需求：所有的Promise都变成fulfilled时，再拿到结果
// 意外： 在拿到所有结果之前，有一个promise变成了rejected，那么整个promise是rejected
Promise.all([p1, p2, p3])
  .then((res) => {
    //按照传入顺序执行
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

#### Promise.allSettled()

出入可迭代对象，所有 promise 敲定后，兑现后的值是一个数组，无论是 fulfilled 还是 rejected,都会返回所有的传入 promise 敲定后结果（按照传入 promise 顺序），每一个都会给出一个状态 status，如果是 "fulfilled"，会有一个 value 字段，如果是"rejected",会有一个 reason 字段。
示例代码:

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("1111");
  }, 1000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("error message");
  }, 2000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("3333");
  }, 3000);
});

// 需求：所有的Promise都变成fulfilled时，再拿到结果
// 意外： 在拿到所有结果之前，有一个promise变成了rejected，那么整个promise是rejected
Promise.all([p1, p2, p3])
  .then((res) => {
    //按照传入顺序执行
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

#### Promise.any()

传入一个可迭代对象，返回一个 promise 对象，在可迭代对象中第一个兑现后返回一个 promise，即"fulfilled",返回兑现值，相反，如果全部被拒绝，在错误中捕获拒绝原因数组的  [`AggregateError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
示例代码:

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p1 resolve");
  }, 4000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("error message");
  }, 2000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("p3 resolve");
  }, 3000);
});

// race竞争，谁先有结果就返回谁，无论是fulfilled还是reject
Promise.race([p1, p2, p3])
  .then((res) => {
    console.log("race resolve:" + res);
  })
  .catch((err) => {
    console.log("race error:" + err);
  });
```

#### Promise.race()

和 Promise.any()类似，无论是第一个是"fulfilled"，还是"rejected",任意一个先敲定的值
示例代码:

```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("1111");
  }, 4000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("error message");
  }, 2000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("3333");
  }, 3000);
});

// 与race类似，不同的是他需要一个resolve的fulfilled状态返回
Promise.any([p1, p2, p3])
  .then((res) => {
    console.log("any resolve:" + res);
  })
  .catch((err) => {
    console.log("any error:" + err);
  });
```

了解这些 Promise 完成并发任务的静态方法后，能够完成对多个并发任务的更加精确的控制。
