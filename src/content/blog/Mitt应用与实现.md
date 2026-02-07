---
title: "Mitt实现与应用"
date: 2025-04-20
tags: []
cover: "1745052962601Mitt.png"
categories: ["tech_blog"]
author: "quirkybird"
summary_text: "本文通过购物车组件通信的实例，详细介绍了如何使用事件总线（Event Bus）实现组件间的解耦通信。文章分别展示了在Vue和React项目中，如何利用`mitt`库创建并使用事件总线，实现商品列表、购物车及导航栏组件间的数据传递和操作同步，如添加/移除商品、更新数量等。

此外，文章深入解析了`mitt`事件发射器的核心实现原理，包括事件类型定义、`on`、`off`、`emit`方法的具体逻辑，以及其基于`Map`存储事件和处理器的特点。

最后，文章对比了事件总线与全局状态管理库（如Redux）的区别，强调事件总线主要用于解耦通信和发布/订阅模式，而全局状态管理则侧重于中心化、持久化的应用状态管理，两者可协同使用。"
---

### 具体场景示例：购物车组件通信

## Vue 实现

### **1.创建事件类型声明**

```typescript
export type CartEvents = {
  addToCart: { productId: string; quantity: number };
  removeFromCart: { productId: string };
  updateQuantity: { productId: string; quantity: number };
  checkout: void;
};
```

### **2.初始化事件总线**

```typescript
import mitt from "mitt";
import type { CartEvents } from "../types/events";
export const cartEventBus = mitt();
```

### **3.商品列表组件**

```typescript
<script setup lang="ts">
import { cartEventBus } from '@/utils/eventBus';

const addToCart = (productId: string) => {
  cartEventBus.emit('addToCart', {
    productId,
    quantity: 1
  });
};
</script>

<template>
  <div class="product-list">
    <div v-for="product in products" :key="product.id">
      <button @click="addToCart(product.id)">加入购物车</button>
    </div>
  </div>
</template>
```

### **4.购物车组件**

```typescript
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { cartEventBus } from '@/utils/eventBus';

const cartItems = ref<Array<{ id: string; quantity: number }>>([]);

// 处理添加商品
const handleAddToCart = ({ productId, quantity }: { productId: string; quantity: number }) => {
  cartItems.value.push({ id: productId, quantity });
};

// 处理移除商品
const handleRemoveFromCart = ({ productId }: { productId: string }) => {
  const index = cartItems.value.findIndex(item => item.id === productId);
  if (index > -1) {
    cartItems.value.splice(index, 1);
  }
};

onMounted(() => {
  cartEventBus.on('addToCart', handleAddToCart);
  cartEventBus.on('removeFromCart', handleRemoveFromCart);
});

onUnmounted(() => {
  cartEventBus.off('addToCart', handleAddToCart);
  cartEventBus.off('removeFromCart', handleRemoveFromCart);
});
</script>

<template>
  <div class="shopping-cart">
    <div v-for="item in cartItems" :key="item.id">
      <span>商品ID: {{ item.id }}</span>
      <span>数量: {{ item.quantity }}</span>
      <button @click="cartEventBus.emit('removeFromCart', { productId: item.id })">
        删除
      </button>
    </div>
  </div>
</template>
```

### **5.导航栏组件显示购物车数量**

```typescript
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { cartEventBus } from '@/utils/eventBus';

const cartCount = ref(0);

onMounted(() => {
  cartEventBus.on('addToCart', () => cartCount.value++);
  cartEventBus.on('removeFromCart', () => cartCount.value--);
});

onUnmounted(() => {
  cartEventBus.all.clear();
});
</script>

<template>
  <div class="navbar">
    <div class="cart-icon">
      购物车 ({{ cartCount }})
    </div>
  </div>
</template>
```

## React 实现

### **1.定义事件类型**

```typescript
export type CartEvents = {
  addToCart: { id: string; name: string; price: number; quantity: number };
  removeFromCart: { id: string };
  updateQuantity: { id: string; quantity: number };
  clearCart: void;
};
```

### **2.配置事件总线**

```typescript
import mitt from "mitt";
import { CartEvents } from "../types/events";

export const cartEventBus = mitt<CartEvents>();
```

### **3.商品列表组件**

```typescript
import React from "react";
import { cartEventBus } from "../utils/eventBus";

const products = [
  { id: "1", name: "商品1", price: 100 },
  { id: "2", name: "商品2", price: 200 },
];

export const ProductList: React.FC = () => {
  const handleAddToCart = (product: (typeof products)[0]) => {
    cartEventBus.emit("addToCart", {
      ...product,
      quantity: 1,
    });
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <h3>{product.name}</h3>
          <p>￥{product.price}</p>
          <button onClick={() => handleAddToCart(product)}>加入购物车</button>
        </div>
      ))}
    </div>
  );
};
```

### **4.购物车组件**

```typescript
import React, { useEffect, useState } from "react";
import { cartEventBus } from "../utils/eventBus";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export const Cart: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const handleAddToCart = (item: CartItem) => {
      setItems((prev) => {
        const exists = prev.find((i) => i.id === item.id);
        if (exists) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, item];
      });
    };

    const handleRemoveFromCart = ({ id }: { id: string }) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    };

    cartEventBus.on("addToCart", handleAddToCart);
    cartEventBus.on("removeFromCart", handleRemoveFromCart);

    return () => {
      cartEventBus.off("addToCart", handleAddToCart);
      cartEventBus.off("removeFromCart", handleRemoveFromCart);
    };
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart">
      <h2>购物车</h2>
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <span>￥{item.price}</span>
          <span>x {item.quantity}</span>
          <button
            onClick={() => cartEventBus.emit("removeFromCart", { id: item.id })}
          >
            删除
          </button>
        </div>
      ))}
      <div className="cart-total">总计: ￥{total}</div>
    </div>
  );
};
```

- 商品列表添加商品到购物车
- 购物车组件显示和管理商品
- 导航栏显示购物车数量
- 组件间的解耦和事件处理

## Mitt 事件发射器实现教程

### 1. 基础类型定义

```typescript
// 事件类型定义
export type EventType = string | symbol;
// 事件处理器定义
export type Handler<T = unknown> = (event: T) => void;
export type WildcardHandler<T = Record<string, unknown>> = (type: keyof T, event: T[keyof T]) => void;
// 处理器列表定义
export type EventHandlerList = Array>;
export type WildcardHandlerList> = Array>;
// 事件处理器映射定义
export type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<
keyof Events | '*',
EventHandlerList | WildcardHandlerList;
```

### 2. 接口定义

```typescript
export interface Emitter<Events extends Record<EventType, unknown>> {
  all: EventHandlerMap;
  // 添加事件监听
  on(type: Key, handler: Handler): void;
  on(type: "*", handler: WildcardHandler): void;
  // 移除事件监听
  off(type: Key, handler?: Handler): void;
  off(type: "*", handler: WildcardHandler): void;
  // 触发事件
  emit(type: Key, event: Events[Key]): void;
}
```

### 3. 核心实现

on 方法实现

```typescript
export default function mitt<Events extends Record<EventType, unknown>>(
  all?: EventHandlerMap<Events>
): Emitter<Events> {
  type GenericEventHandler =
    | Handler<Events[keyof Events]>
    | WildcardHandler<Events>;
  all = all || new Map();

  return {
    /**
     * 一个事件名称到已注册处理函数的映射。
     */
    all,

    /**
     * 为指定类型注册一个事件处理器。
     * @param {string|symbol} type 要监听的事件类型，或 `'*'` 表示所有事件
     * @param {Function} handler 响应指定事件时调用的函数
     * @memberOf mitt
     */
    on<Key extends keyof Events>(type: Key, handler: GenericEventHandler) {
      const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
      if (handlers) {
        handlers.push(handler);
      } else {
        all!.set(type, [handler] as EventHandlerList<Events[keyof Events]>);
      }
    },
  };
}
```

实现  off  方法

```typescript
/**
		 * 移除指定类型的事件处理器。
		 * 如果未提供 `handler`，则移除该类型的所有处理器。
		 * @param {string|symbol} type 要取消注册 `handler` 的事件类型（`'*'` 表示移除通配符处理器）
		 * @param {Function} [handler] 要移除的处理器函数
		 * @memberOf mitt
		 */
		off<Key extends keyof Events>(type: Key, handler?: GenericEventHandler) {
			const handlers: Array<GenericEventHandler> | undefined = all!.get(type);
			if (handlers) {
				if (handler) {
					handlers.splice(handlers.indexOf(handler) >>> 0, 1);
				} else {
					all!.set(type, []);
				}
			}
		},
```

实现 emit 方法

```typescript
/**
		 * 调用指定类型的所有处理器。
		 * 如果存在，`'*'` 处理器会在类型匹配的处理器之后调用。
		 *
		 * 注意：不支持手动触发 `'*'` 处理器。
		 *
		 * @param {string|symbol} type 要调用的事件类型
		 * @param {Any} [evt] 任意值（推荐使用对象，功能更强大），会传递给每个处理器
		 * @memberOf mitt
		 */
		emit<Key extends keyof Events>(type: Key, evt?: Events[Key]) {
			let handlers = all!.get(type);
			if (handlers) {
				(handlers as EventHandlerList<Events[keyof Events]>)
					.slice()
					.map((handler) => {
						handler(evt!);
					});
			}

			handlers = all!.get('*');
			if (handlers) {
				(handlers as WildCardEventHandlerList<Events>)
					.slice()
					.map((handler) => {
						handler(type, evt!);
					});
			}
		}
```

### 4. 使用示例

```typescript
import mitt from "./index";
// 创建发射器实例
const emitter = mitt();
// 添加普通事件监听器
emitter.on("foo", (e) => console.log("foo event", e));
// 添加通配符事件监听器
emitter.on("*", (type, e) => console.log("any event", type, e));
// 触发事件
emitter.emit("foo", { data: 123 });
// 移除特定事件监听器
emitter.off("foo");
// 移除通配符监听器
emitter.off("*");
```

### 5. 关键实现特点

1. 使用 `Map` 存储事件和处理器
2. 支持类型安全的事件处理
3. 实现通配符 `*` 监听所有事件
4. 使用 `slice()` 创建处理器数组副本
5. 支持链式调用
6. 代码精简，无外部依赖

## 事件总线和全局状态对比

事件总线机制和全局状态管理库的主要目的是不同的，它们具有不同的特点，尽管它们在应用中可能会有所重叠。以下是它们之间的对比：

**事件总线 (Event Bus):**

- **主要目的：** 主要用于应用程序不同部分之间的**解耦通信**，这些部分不需要直接了解彼此。它遵循**发布/订阅**模式。组件发布事件，其他组件订阅特定的事件类型，以便在事件发生时得到通知。
- **状态管理：** 通常**不以管理持久的、中心化的应用程序状态**为主要关注点。虽然事件可以携带数据并因此影响状态，但事件总线本身并不存储或控制这种状态的长期演变。
- **耦合性：** **降低了组件之间的直接耦合**。发布者不需要知道谁在监听，订阅者也不需要知道谁在发布。
- **数据流：** **间接且通常在特定的事件流中是单向的**。数据作为事件有效负载的一部分传递。
- **调试：** **跟踪状态变化可能更具挑战性**，因为事件的影响可能分散在多个独立的监听器中。更难追踪特定状态值是如何演变到当前值的。
- **可伸缩性：** 有助于构建**更模块化和可伸缩的应用程序**，通过解耦关注点。
- **适用场景：** 非常适合：
  - 通知和警报。
  - 解耦的 UI 交互（例如，一个组件触发 UI 中完全不相关的部分的动作）。
  - 跨领域关注点，如日志记录或分析，应用程序的不同部分需要对某些事件做出反应。
  - 编排复杂的工作流程，不同的服务或模块需要异步通信。

**全局状态管理库 (例如 Redux, Zustand, Recoil):**

- **主要目的：** 主要用于**管理和集中化应用程序状态**，这些状态需要被许多组件共享和访问。它们提供了一种可预测的方式来更新和检索状态。
- **状态管理：** **中心化的存储**保存应用程序的状态。这些库通常强制执行更新状态的模式（例如，Redux 中的 Actions 和 Reducers）。
- **耦合性：** 可能会引入**与全局存储的更紧密耦合**，尽管良好设计的架构旨在最小化组件对整个存储的直接依赖。
- **数据流：** 通常是**单向且更明确的**，使得更容易理解状态如何随时间变化（例如，Action -> Reducer -> Store -> View）。
- **调试：** 通常提供**开发者工具**，可以更轻松地检查状态、跟踪更改和重放操作，极大地帮助调试。
- **可伸缩性：** 对于**管理具有大量共享状态的复杂应用程序**至关重要，提供结构和可预测性。
- **适用场景：** 非常适合：
  - 管理用户会话和身份验证状态。
  - 存储和更新应用程序范围的数据（例如，用户配置文件、设置）。
  - 协调跨多个视图的复杂数据更新。
  - 实现撤销/重做或乐观更新等功能。

**以下表格总结了关键区别：**

| **特性**         | **事件总线 (Event Bus)** | **全局状态管理库 (Global State Management Library)** |
| ---------------- | ------------------------ | ---------------------------------------------------- |
| **主要目标**     | 解耦通信                 | 中心化状态管理                                       |
| **状态**         | 瞬态，由事件携带         | 持久化，集中存储                                     |
| **耦合性**       | 低（通信组件之间）       | 可能较高（与全局存储）                               |
| **数据流**       | 间接，事件驱动           | 直接，通常是单向的 (Action -> Update)                |
| **调试**         | 跟踪状态变化可能更难     | 通常提供优秀的调试工具                               |
| **伸缩性关注点** | 模块化，独立组件         | 管理共享状态的复杂性                                 |
| **主要用例**     | 通知，解耦的交互         | 共享应用数据，复杂的更新                             |

**它们可以一起使用吗？**

是的，应用程序通常会同时使用这两种机制。例如：

- 全局状态管理库可能用于核心应用程序数据，而事件总线可以处理 UI 级别的通知或不需要成为中心状态一部分的解耦交互。
- 事件总线可以用于触发全局状态管理系统中的 actions。

**本质上：**

- 当你需要组件在没有直接依赖的情况下进行通信时，尤其是一次性事件或通知，使用**事件总线**。
- 当你有需要在应用程序的许多部分长期共享和可预测地管理的数据时，使用**全局状态管理库**。

选择合适的工具取决于你的应用程序的具体需求和复杂性。对于更简单的应用程序，基本的事件发射器可能足以进行通信，而内置的状态管理可能就足够了。随着应用程序复杂性的增加，专门用于这两种模式的库变得越来越有价值。
