function findChangedProperties(obj1, obj2) {
  const changedProperties = {};

  // 获取两个对象的所有属性名
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 合并两个对象的所有属性名
  const allKeys = new Set([...keys1, ...keys2]);

  // 遍历所有属性名
  allKeys.forEach((key) => {
    // 检查属性是否在两个对象中都存在
    const val1 =
      typeof obj1[key] === "object" && obj1[key] !== null
        ? JSON.stringify(obj1[key])
        : obj1[key];
    const val2 =
      typeof obj2[key] === "object" && obj2[key] !== null
        ? JSON.stringify(obj2[key])
        : obj2[key];
    if (val1 !== val2) {
      if (key === "tagNames") return;
      changedProperties[key] = obj2[key]; // 记录变化的属性及其新值
    }
  });

  return changedProperties;
}

module.exports = { findChangedProperties };
