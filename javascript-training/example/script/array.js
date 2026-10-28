  const a = [1, 2, 3];
  console.log("🚀 ~ file: array.js ~ line 2 ~ a", a);
  const b = Array.of(4, 'value', 'true');
  console.log("🚀 ~ file: array.js ~ line 3 ~ b", b);
  const c = [...a, ...b];
  console.log("🚀 ~ file: array.js ~ line 6 ~ c", c)
  console.log("c[4] ~ ", c[4])
  const arr = [
    [1, 2, 3],
    ['value', 4, 5],
    Array(3).fill(1)
  ]
  console.log("🚀 ~ file: array.js ~ line 13 ~ arr", arr)
  console.log("🚀 ~ file: array.js ~ line 14 ~ arr[1][3]", arr[1][2])
  console.log("🚀 ~ file: array.js ~ line 15 ~ arr.length", arr.length)
  a.push([5, 6, 7]);
  console.log("🚀 ~ file: array.js ~ line 17 ~ push", a)
  arr.pop();
  console.log("🚀 ~ file: array.js ~ line 19 ~ pop", arr)
  b.unshift([6, 7, 'abc']);
  console.log("🚀 ~ file: array.js ~ line 21 ~ arr.unshift", b)
  c.shift();
  console.log("🚀 ~ file: array.js ~ line 23 ~ arr.shift", c)
  console.log("find")
  const arr1 = [1, 2, 3, 4, 5]
  console.log("🚀 ~ file: array.js ~ line 26 ~ arr1", arr1)
  const arr2 = arr1.find(e => e > 3)
  console.log("🚀 ~ file: array.js ~ line 30 ~ arr2 ~ find", arr2)
  console.log("findIndex")
  const arr3 = arr1.findIndex(e => e >=2 )
  console.log("🚀 ~ file: array.js ~ line 30 ~ findIndex", arr3)
  console.log("include")
  const arr4 = arr1.includes(5)
  console.log("🚀 ~ file: array.js ~ line 33 ~ arr4", arr4)
