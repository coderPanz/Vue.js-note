
class Depend {
  constructor() {
    // Set的元素不允许重复, 可以规避添加重复依赖函数
    this.reactiveFns = new Set()
  }
  addDependFn(fn) {
    if(fn) {
      this.reactiveFns.add(fn)
    }
  }
  notify() {
    this.reactiveFns.forEach(fn => fn())
  }
}

const dep = new Depend()

// 依赖函数
let tempDepObj = null
function watchFn(fn) {
  tempDepObj = fn
  fn()
  // 传递完成后清除, 避免后续受到影响  
  tempDepObj = null
}

// 解决方案一--vue2
function reactive(obj) {
  const objProxy = new Proxy(obj, {
    set: function(target, key, newValue, receiver) {
      // target[key] = newValue
      Reflect.set(target, key, newValue, receiver)
      const dep = getDepend(target, key)
      dep.notify()
    },
    get: function(target, key, receiver) {
      const dep = getDepend(target, key)
      dep.addDependFn(tempDepObj)
      return  Reflect.get(target, key, receiver)
    }
  })
  return objProxy
}


// 所有obj对象对应map对象组成键值对组成的对象objMap(WeakMap只能使用对象作为键名)
const objMap = new WeakMap()
// 封装一个函数, 通过obj的key来获取对应的dep对象
function getDepend(obj, key) {
  // obj对应map, 通过obj获取map对象
  let map = objMap.get(obj)
  if(!map) {
    // 这里为什么不使用WeakMap(WeakMap只能使用对象作为键名)
    map = new Map()
    objMap.set(obj, map)
  }
  // key对应dep, 根据key对象获取dep
  let dep = map.get(key)
  if(!dep) {
    dep = new Depend()
    map.set(key, dep)
  }
  return dep
}



console.log("-------------业务代码-------------------")

const obj = reactive({
  name: "kobe",
  age: 11
})
// 依赖收集函数
watchFn(function() {
  console.log(obj.name)
  console.log("name发生了变化~")
})
watchFn(function() {
  console.log(obj.age)
  console.log("age发生了变化`")
})

const stu = reactive({
  adress: "BeiJing",
  club: "byte dance~"
})

// 依赖收集函数
watchFn(function() {
  console.log(stu.adress)
  console.log("adress发生了变化~")
})
watchFn(function() {
  console.log(stu.club)
  console.log("club发生了变化`")
})
stu.adress = "深圳"
stu.adress = "广州"





// Reflect.get() 是 JavaScript 中的一个内置方法，用于获取对象的属性值。它与传统的访问对象属性的语法 obj[key] 类似，但具有更高的可控性和扩展性。

// Reflect.get() 的参数包括三个：

//     target：要从中获取属性值的对象。
//     key：要获取的属性的名称或 Symbol 值。
//     receiver（可选）：用作 this 值的对象。

// 当 target 对象中存在指定的属性（即 key 所指定的属性或其继承属性），Reflect.get() 方法会返回该属性的值。如果不存在该属性，则返回 undefined。

// receiver 参数用于指定 Reflect.get() 方法中 this 关键字所代表的对象。如果不指定 receiver，this 的默认值为 target 对象本身。如果指定了 receiver 参数，则 this 将指向该参数所传递的对象。




// Reflect.set() 是 JavaScript 中的一个内置方法，用于设置对象的属性值。它与传统的设置对象属性的语法 obj[key]=value 类似，但具有更高的可控性和扩展性。

// Reflect.set() 的参数包括四个：

//     target：要设置属性值的对象。
//     key：要设置的属性的名称或 Symbol 值。
//     newValue：需要设置的新值。
//     receiver（可选）：用作 this 值的对象。

// 当 target 对象中存在指定的属性（即 key 所指定的属性或其继承属性），Reflect.set() 方法会将其值设置为 newValue，并返回 true。如果不存在该属性，则会根据 target 对象的类型和相应的操作进行处理，并返回 true 或 false。

// receiver 参数用于指定 Reflect.set() 方法中 this 关键字所代表的对象。如果不指定 receiver，this 的默认值为 target 对象本身。如果指定了 receiver 参数，则 this 将指向该参数所传递的对象。

// 需要注意的是，Reflect.set() 方法不会自动执行 setter 函数，而是只是简单地设置属性值。如果需要调用 setter 函数，则应该使用函数调用语法，例如 Reflect.set(obj, 'prop', value).call(receiver)。
