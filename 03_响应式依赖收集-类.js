
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

  function watchFn(fn) {
    dep.addDependFn(fn)
    fn()
  }

  watchFn(function() {
    console.log(obj.name)
  })
  watchFn(function() {
    console.log(obj.age)
  })

  obj.name = "kobe"
  obj.age = 11
  console.log("对象发生了变化~")

  // 通知对象发送变化重新执行依赖函数, 这里是手动通知的, 这样写并不完美, 当某一次对象变化是我们忘记调整了, 数据就没有更新过来, 欲知后事如何,请听下回分解
  dep.notify()


