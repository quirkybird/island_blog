---
title: "TS的内置类型"
date: 2024-01-01
tags: []
categories: ["tech_blog"]
author: "quirkybird"
---

一开始使用TS的我，“什么玩意儿，多写这么多代码，ESLint一直报错”，后面切换回JS，怎么vscode这么安静，代码一跑起来，怎么又报错了。  <br />今天来走一遍TS内置类型，让我们的代码更加清晰明了，在执行前编辑器里嘎嘎报错。  

1. Partial (部分的)
```tsx
/**
 * Make all properties in T optional
 */
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```
作用是让传入的属性全部变为可选类型
> 举个例子

```tsx
interface Person {
  name: string;
  age: string;
}

const one: Person = {}

const two: Partial<Person> = {}
```
![image.png](https://s2.loli.net/2024/07/31/ERjdP9Dy6U5bmZu.png)<br />可以发现two等于一个空对象都不会报错，而one说缺少属性

2. Required (必须的)
```tsx
/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```
跟Partial作用是相反的，所有传入类型的属性变为必填
> 举个例子

```tsx
interface Person {
  name?: string;
  age?: string;
}

const one: Person = {};

const two: Required<Person> = {};

```
![image.png](https://s2.loli.net/2024/07/31/7dL9sqlTWafCBMK.png)<br />发现本来可选的，加了Required后，报错必须传入

3. Readonly（只读的）
```tsx
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```
作用是传入类型中所有的属性变为只读的（修改类型报错）
> 举个例子

```tsx
interface Animal {
  type: string;
  speed: 'fast' | 'middle' | 'slow';
}

const animal1: Readonly<Animal> = { type: '猎豹', speed: 'fast' };

animal1.speed = 'slow';

```
![image.png](https://s2.loli.net/2024/07/31/7PDwirjQ3O6VqxE.png)

4. Pick（选择）
```tsx
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```
作用是选择传入类型的部分属性作为新类型
>  举个例子

```tsx
interface Animal {
  type: string;
  speed: 'fast' | 'middle' | 'slow';
  gender: 'male' | 'female';
}

const animal: Pick<Animal, 'type' | 'gender'> = { type: '猎豹', speed: 'fast' };

```
![image.png](https://s2.loli.net/2024/07/31/si93DOMxrwAJS4k.png)<br />可以看到，我们挑选出了`type`和`gender`的联合类型，传入`speed`时, 便会报错

5. Record（记录）
```tsx
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```
构建一个对象类型，其中键、值都有相同类型
> 举个例子

```tsx
interface Animal {
  type: string;
  speed: 'fast' | 'middle' | 'slow';
  gender?: 'male' | 'female';
}

const animal: Record<string, Animal> = {
  animal1: {
    type: '东北虎',
    speed: 'fast',
  },
  animal2: {
    type: '企鹅🐧',
    speed: 'slow',
  },
  animal3: ['猫咪', 'middle'],
};

```
![image.png](https://s2.loli.net/2024/07/31/n1R3aIrmhVX8BZ9.png)<br />Record决定值的类型为Animal，为一个对象Animal类型，传入不符合就会报错

6. Exclude（排除）
```tsx
/**
 * Exclude from T those types that are assignable to U
 */
type Exclude<T, U> = T extends U ? never : T;
```
排除联合类型中部分属性，不能针对interface（interface用Omit）
> 举个例子

```tsx
export type PersonAttr = 'name' | 'age';

export type StudentAttr = 'name' | 'age' | 'class' | 'school';

const student1: Exclude<StudentAttr, PersonAttr> = {name: 'lihua'};
```
![image.png](https://s2.loli.net/2024/07/31/lidK9U8mLCXMZoR.png)<br />排除了`name`和`age`

7. Omit（省略）
```tsx
/**
 * Construct a type with the properties of T except for those in type K.
 */
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```
传入一个对象类型和需要排除的属性类型，组成一个新的类型
> 举个例子

```tsx
interface Animal {
  type: string;
  speed: 'fast' | 'middle' | 'slow';
  gender?: 'male' | 'female';
}

type Person = Omit<Animal, 'type' | 'speed'> & { name: string };

const person1: Person = {
  name: 'quirkybird',
  gender: 'male',
};

const person2: Person = {
  name: 'yamorz',
  gender: 'male',
  type: 'person',
};

```
![image.png](https://s2.loli.net/2024/07/31/MvwQ8icSUIsYEzu.png)<br />被省略后，新类型中不再有`type`和`speed`，无法再添加进对象

除此之外，还有很多类型，`NonNullable`、`Parameters`、`Capitalize`、`Uncapitalize`... ...<br />以上就是列举的部分常见内置类型，有了他们，可以更快速、安全的维护我们的代码，用起来吧🙃

> [TypeScript内置类型一览](https://segmentfault.com/a/1190000041101150)

