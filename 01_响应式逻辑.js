// 一般使用对象进行响应式的情况比较多, 当然使用单一数据进行响应式也是可以的
  const obj = {
    name: "messi",
    age: 33 
  }

  // 下面这些东西是依赖对象的, 我们可以放到一个函数中, 作为依赖函数
  // console.log(obj.name)
  // console.log(obj.age)
  function foo() {
    console.log(obj.name)
    console.log(obj.age)
  }
  foo()

  // 当对象的内部发生改变时, 我们需要再次调用依赖函数才能获取实时数据
  obj.name = "kobe"
  foo() 