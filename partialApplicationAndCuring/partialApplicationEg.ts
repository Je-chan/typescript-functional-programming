const delivery = (present: string, from: string, to: string) => {
  return `
  보내는 물건 : ${present}
  보내는 사람 : ${from}
  받는 사람 : ${to}
  `
}

const main = () => {
  console.clear();

  // 엄마가 상품권 보낼 일이 많다면 상품권과 엄마라는 인자를 반복해서 작성하는 것은 굉장히 비효율적
  console.log(delivery("상품권", "엄마", "아들"));
  console.log(delivery("상품권", "엄마", "딸"));
  console.log(delivery("상품권", "엄마", "할머니"));
}

// 아래의 코드는 present, from 을 입력 받으면 받을 사람을 입력 받는 함수를 리턴하게 된다
const partialApplicationDelivery = (present: string, from: string) => (to: string) => {
  return `
  보내는 물건 : ${present}
  보내는 사람 : ${from}
  받는 사람 : ${to}
  `
}

const partialApplicationMain = () => {
  console.clear();

  const momsPresent = partialApplicationDelivery("상품권", "엄마")
  console.log(momsPresent("아들"));
  console.log(momsPresent("딸"));
  console.log(momsPresent("할머니"));
}