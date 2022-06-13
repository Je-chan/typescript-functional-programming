const delivery = (present: string, from: string, to: string) => {
  return `
  보내는 물건 : ${present}
  보내는 사람 : ${from}
  받는 사람 : ${to}
  `
}

// 커링을 만드는 방법은 간단
// 인자가 하나인 함수들의 함수 열로 바꾸면 됨.
const deliveryCurried = (present: string) => (from: string) => (to: string) => {
  return `
  보내는 물건 : ${present}
  보내는 사람 : ${from}
  받는 사람 : ${to}
  `
}

// 임의의 함수를 curried function 으로 만드는 것을 만들 수 있다
// 여기에서는 인자가 세 개인 함수를 커링하는 방법으로 만들기
// 커링된 함수는 궁극적으로 원래 함수를 호출하기에 같은 함수라 받아들일 수 있음
const curry3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) =>
  (a: A) => (b: B) => (c: C) => f(a, b, c);

const deliveryByCurry3 = curry3(delivery)


const main = () => {
  console.clear();

  // 원래는 이렇게
  console.log(delivery("상품권", "엄마", "아들"));
  console.log(delivery("상품권", "엄마", "딸"));
  console.log(delivery("상품권", "엄마", "할머니"));

  console.log('===========================================')

  // 커링된 함수는 일부 인자만 입력해서 재사용하는 것이 편리하기에 함수형 프로그래밍에서 자주 사용
  // 일부 함수형 언어들은 이렇게 커링된 함수를 기본적으로 사용하는 언어들도 존재함
  const momsPresent = deliveryCurried("상품권")("엄마")

  console.log(momsPresent("아들"));
  console.log(momsPresent("딸"));
  console.log(momsPresent("할머니"));
}

