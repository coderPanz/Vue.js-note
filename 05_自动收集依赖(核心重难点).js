
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

  const obj = {
    name: "messi",
    age: 44
  }
  // 依赖函数
  let tempDepObj = null
  function watchFn(fn) {
    tempDepObj = fn
    fn()
    // 传递完成后清除, 避免后续受到影响  
    tempDepObj = null
  }

  // 解决方案一--vue2
  Object.keys(obj).forEach(key => {
    let value = obj[key]

    Object.defineProperty(obj, key, {
      // .对象属性发生变化时调用set方法匹配到创建出来的相应dep后, 执行依赖数组的依赖函数
      set: function(newValue) {
        // 给对象赋新的value
        value = newValue
        const dep = getDepend(obj, key)
        dep.notify()
      },
      // 依赖函数执行时, 调用一次get后由于第一次没有对应依赖所以会创建一个对应dep对象并返回出来, 并把依赖函数添加到依赖数组中
      get: function() {
        console.log("依赖函数调用了get方法！")
        const dep = getDepend(obj, key)
        dep.addDependFn(tempDepObj)
        return value
      }
    })
  })

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



  // 实现超精准自动收集依赖原理
  /**
   * 一、重构Depend实例对象（dep对象）的数据结构
   * 1.obj对象（一般指我们定义出来的对象）每一个属性对应一个dep对象形成一组键值对，并放入map对象进行管理
   * 2.所有obj对象对应map对象组成键值对，并放入objMap进行管理
   */
  /**
   * 二、当执行依赖函数时（第四部所需的一个条件），也会调用defineProperty中的get方法，同时依赖的是哪个对象的哪个key也已经确定。在get方法中确定key的dep对象
   */
  /**
   * 三、重点核心一：怎么确定key的dep对象-->创建一个函数并返回key对应的dep对象 （在代码中我们具体介绍）
   */
  /**
   * 四、重点核心二：外层收集依赖函数watchFn如何确定dep对象并调用对象方法addDependFn？--> 定义一个临时存放dep对象的变量，进入watchFn函数内部后1.fn赋值给临时变量，2.执行fn，当执行依赖函数时（fn）会去执行监听函数中的get方法，在get方法中再通过dep对象调用对象方法addDependFn并传入临时变量，自此完成最后最伟大的作品, 此时每一个对象的属性都有其对应的依赖集合数组
   */

  // 依赖收集函数
  watchFn(function() {
    console.log(obj.name)
    console.log("name发生了变化~")
  })
  watchFn(function() {
    console.log(obj.age)
    console.log("age发生了变化`")
  })
  
  console.log("--------------")
  obj.name = "kobe"
  obj.age = 11
  obj.age = 666
  obj.age = 789
  obj.age = 321
  obj.age = 1991
  obj.name = "kobe"
  obj.age = 1323








  
