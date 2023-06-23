
  const obj = {
    name: "messi",
    age: 44
  }

  // 创建一个响应式收集的类, 其内部定义了存放依赖的数组, 收集依赖的函数所, 执行依赖的函数
  class Depend {
    constructor() {
      this.reactiveFns = []
    }
    addDependFn(fn) {
      if(fn) {
        this.reactiveFns.push(fn)
      }
    }
    notify() {
      this.reactiveFns.forEach(fn => fn())
    }
  }

  const dep = new Depend()

  // 依赖收集函数
  function watchFn(fn) {
    dep.addDependFn(fn)
    fn()
  }
  // 依赖函数
  watchFn(function() {
    console.log(obj.name)
    console.log("name发生了变化~")
  })
  watchFn(function() {
    console.log(obj.age)
    console.log("age发生了变化`")
  })
    // 解决方案一--vue2
  Object.keys(obj).forEach(key => {
    let value = obj[key]

    Object.defineProperty(obj, key, {
      set: function(newValue) {
        value = newValue
        dep.notify()
      },
      get: function() {
        return value
      }
    })
  })

  // 这样写并不完美, 有两个问题 1.通知对象发送变化重新执行依赖函数, 这里是手动通知的当某一次对象变化时我们忘记dep.notify()了, 数据就没有更新过来. 2.所有依赖函数都放到了一个数组中, 一旦调用那么所有依赖都要重新执行一遍, 欲知后事如何解决,且听下回分解
  // dep.notify()
  obj.name = "aaa"
  obj.age = 111
  obj.name = "bbb"
  obj.name = "ddd"
  obj.age = 1111
  obj.age = 1212
  obj.name = "潘"
  obj.name = "其"

