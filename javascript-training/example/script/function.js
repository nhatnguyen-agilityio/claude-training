  //Basic function
  function getData() {
    return 'hi'
  }
  console.log("🚀 ~ file: function.js ~ line 3 ~ getData ~ getData()", getData())
  
  //Passing parameter
  function getInfo(name, age, address){
    if(!!name && !!age && !!address){
      console.log("Name: ", name)
      console.log("Address: ", address)
      console.log("Age: ", age)
    }
    else {
      console.log("Error!")
    }
  }
  getInfo('Nhat', 22, 'Da Nang')

  //Function defined inside function
  function getFunction() {
    function logic() {
      console.log("Function defined inside function")
      return ['Nhat', 22]
    }
    return logic()
  }
  let [name, age] = getFunction()
  console.log("🚀 ~ file: function.js ~ line 29 ~ name", name)
  console.log("🚀 ~ file: function.js ~ line 30 ~ age", age)

  //Arrow function
  const getData1 = () => {
    console.log("basic arrow function")
  }
  getData1()

  //Have one parameter
  const getData2 = name => console.log(name)
  getData2("Nhat")

  //Have multiple parameter
  const getData3 = (lastName, age, address) => {
    console.log("🚀 ~ file: function.js ~ line 44 ~ getData3 ~ address", address)
    console.log("🚀 ~ file: function.js ~ line 44 ~ getData3 ~ age", age)
    console.log("🚀 ~ file: function.js ~ line 44 ~ getData3 ~ lastName", lastName)
  }
  getData3("Nhat", 22, "Da Nang")

  //Default parameters
  const getData4 = (name = "Nhat Nguyen", age = 22) => {
    return [name, age]
  }

  let [fullName, age1] = getData4()
  console.log("🚀 ~ file: function.js ~ line 55 ~ fullName", fullName)
  console.log("🚀 ~ file: function.js ~ line 56 ~ age1", age1)