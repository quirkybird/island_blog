---
title: "前端埋点简析"
date: 2023-12-15
tags: []
categories: ["tech_blog"]
author: "quirkybird"
summary_text: "本文介绍了toC项目中用户行为数据收集（埋点）的重要性，旨在分析用户行为并进行数据可视化。文章列举了Google Analytics、百度统计等成熟的第三方解决方案。同时，详细解释了UV（独立访客）、IP（独立IP）、PV（页面浏览量）和VV（访问次数）等核心概念及其区别。最后，文章还展示了简单的代码埋点实现方式，用于监听页面加载和按钮点击等事件。"
---

> 嗯，相对庞大的一块知识

在日常的 toC 项目中，我们通常需要收集用户行为数据，比如他这次访问了哪个页面、点击了哪个按钮、停留时间等，短视频平台比如完播率、浏览量等之类的，都需要把用户的数据收集起来然后上传回服务器，方便我们对数据进行分析，再通过可视化技术显示出来。

市面上有一些相当成熟的方案：包括 Google Analytics、Mixpanel、Hotjar、Amplitude、Segment、Matomo、百度统计、友盟等。

下面是一些相关概念

### UV（Unique visitor）

是指通过互联网访问、浏览这个网页的自然人。访问您网站的一台电脑客户端为一个访客。00:00-24:00 内相同的客户端只被计算一次。一天内同个访客多次访问仅计算一个 UV。

### IP（Internet Protocol）

独立 IP 是指访问过某站点的 IP 总数，以用户的 IP 地址作为统计依据。00:00-24:00 内相同 IP 地址之被计算一次。

- UV 与 IP 区别

> 如：你和你的家人用各自的账号在同一台电脑上登录新浪微博，则 IP 数+1，UV 数+2。由于使用的是同一台电脑，所以 IP 不变，但使用的不同账号，所以 UV+2

### PV（Page View）

即页面浏览量或点击量，用户每 1 次对网站中的每个网页访问均被记录 1 个 PV。用户对同一页面的多次访问，访问量累计，用以衡量网站用户访问的网页数量。

### VV（Visit View）

用以统计所有访客 1 天内访问网站的次数。当访客完成所有浏览并最终关掉该网站的所有页面时便完成了一次访问，同一访客 1 天内可能有多次访问行为，访问次数累计。

PV 与 VV 区别

> 如：你今天 10 点钟打开了百度，访问了它的三个页面；11 点钟又打开了百度，访问了它的两个页面，则 PV 数+5，VV 数+2.PV 是指页面的浏览次数，VV 是指你访问网站的次数。

我们也可以自己实现一些简单的代码埋点,大概的模式如下：

```js
// 监听页面加载事件
window.addEventListener("load", function () {
  // 发送页面加载时间数据到后端或第三方平台
  reportData("page_load_time", calculatePageLoadTime());
});

// 监听按钮点击事件
document.getElementById("button1").addEventListener("click", function () {
  // 发送按钮点击事件数据到后端或第三方平台
  reportData("button_click", "提交按钮被点击");
});

// 数据上报函数
function reportData(eventType, eventData) {
  // 发送数据到后端或第三方平台的逻辑
  // 可以使用Ajax请求或者其他方式将数据发送到指定的接口
  // 例如：sendDataToBackend(eventType, eventData);
}
```

> 本文参考：
> [前端埋点系统](https://zhuanlan.zhihu.com/p/493826518) > [前端埋点实现方案](https://juejin.cn/post/7094146488439144455)
