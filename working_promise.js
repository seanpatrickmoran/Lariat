
function squares(x){
  return x**2
}

async function waits(y) {
  return await new Promise(resolve => resolve(squares(y)),reject => console.log("what???"));
  // return 10;
}

function f(c) {
  // shows 10 after 1 second
  waits(c).then(reply => console.log(reply));
}


f(3);
