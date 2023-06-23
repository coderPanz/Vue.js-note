  
  const obj = {
    name: "messi",
    age: 33 
  }

  // 依赖搜集思想: 
  // 前面我们讲过, 当对象的内部发生改变时, 我们需要再次调用依赖函数才能获取实时数据
  // 更进一步, 我们可以创建一个搜集依赖的函数, 当对象内部发送改变时, 把依赖函数作为参数传进去并push到一个数组中, 在数组中把所有依赖函数都执行一遍.

  obj.name = "curry"
  obj.age = 44 

  const reactiveFns = []
  function watchFn(fn) {
    reactiveFns.push(fn)
    // 收集依赖时我们一般执行一次原来的依赖函数
    fn()
  }

  // 依赖函数
  watchFn(function() {
    console.log(obj.name)
  })
  watchFn(function() {
    console.log(obj.age)
  })
  
  obj.name = "kobe"
  obj.age = 1111
  
  reactiveFns.forEach(fn => {
    fn()
  })