
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
    Object.keys(obj).forEach(key => {
      let value = obj[key]
  
      Object.defineProperty(obj, key, {
        // .对象属性发生变化时调用set方法匹配到创建出来的相应dep后, 执行依赖数组的依赖函数
        set: function(newValue) {
          value = newValue
          const dep = getDepend(obj, key)
          dep.notify()
        },
        // 依赖函数执行时调用一次get后由于第一次没有对应依赖所以会创建一个对应dep对象并返回出来, 并把依赖函数添加到依赖数组中
        get: function() {
          console.log("依赖函数调用了get方法！")
          const dep = getDepend(obj, key)
          dep.addDependFn(tempDepObj)
          return value
        }
      })
    })
    return obj
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
  









