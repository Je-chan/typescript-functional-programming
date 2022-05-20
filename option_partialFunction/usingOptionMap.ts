import {cart, Item} from './cart'
import * as O from './option'

const stockItem = (item: Item): string => {
  const optionDiscountPrice = O.fromUndefined(item.discountPrice);
  const discountPrice = O.getOrElse(optionDiscountPrice, 0);

  // 아래 주석처리된 코드는 밑의 optionMap 함수를 사용해서 해결할 수 있다 => 생각의 차이
  // 주석 처리된 코드는 상태에 따라서 값을 변경하는 것. 즉, 컴퓨터가 어떻게 동작하기를 바라는지를 설명하는 코드

  // let saleText = "";
  //
  // if(O.isSome(optionDiscountPrice)) {
  //   saleText = `(${discountPrice}원 할인)`
  // }

  // 이 코드는 특정 문자열로 변환해서 새로운 Option 을 얻는다
  // Option 타입의 값의 상태라 할 수 있는 None, Some 은 유지한 채, 그 안에 값이 있을 때만 주어진 함수를 사용하고, 아니면 그냥 리턴
  // 이 과정에서 Option 에 값이 있는지 없는지는 optionMap 와 getOrElse 가 처리해줬다.
  // saleText 는 결국, 선언적으로 const 가 할 수 있다. saleText 란 무엇이 돼야 하는지 설명하는 코드
  const optionSaleText = O.optionMap(
    optionDiscountPrice,
    discountPrice => `${discountPrice} 원 할인`
  )

  const saleText = O.getOrElse(optionSaleText, '');

  // 객체 지향에서는 메소드 체이닝이 있지만, 함수형 프로그래밍에서는 함수 합성을 통해서 간단하게 표현할 수 있다
  const saleTextComposed = O.getOrElse((O.optionMap(
    optionDiscountPrice,
    discountPrice => `${discountPrice}원 할인`
  )), "")

  // 그런데 Option 에서는 위에서 처럼 optionMap 과 getOrElse 를 합성해서 사용하는 경우가 많으므로 미리 합성한 함수를 만든다
  const saleTextCustomComposed = O.optionMapOrElse(
    optionDiscountPrice,
    discountPrice => `${discountPrice}원 할인`,
    ""
  )



  return `
    <li>
      <h2>${item.name}</h2>
      <div>가격: ${item.price - discountPrice} ${saleTextCustomComposed}</div>
      <div>수량: ${item.quantity}</div>
    </li>
  `
}

const outOfStockItem = (item: Item): string => `
  <li class="gray">
    <h2>${item.name} (품절)</h2> 
    <div class="strike">가격: ${item.price}</div>  
    <div class="strike">수량: ${item.quantity}</div>
  </li>
`

const item = (item: Item): string => {
  if(item.outOfStock) {
    return outOfStockItem(item)
  } else {
    return stockItem(item)
  }
}

const totalCalculator = (list: Array<Item>, getValue: (item: Item) => number) => {
  return list
    .filter(item => !item.outOfStock)
    .map(getValue)
    .reduce((total, value) => total + value, 0)
}

const totalCount= (list: Array<Item>): string => {
  const totalCount = totalCalculator(list, (item) => item.quantity);


  return `<h2>전체 수량: ${totalCount}개</h2>`
}

const totalPrice = (list: Array<Item>): string => {
  const totalPrice = totalCalculator(list, (item) => item.quantity * item.price);

  const totalDiscountPrice = totalCalculator(list, (item) => {
    const discountPrice = O.getOrElse(O.fromUndefined(item.discountPrice), 0);

    return discountPrice * item.quantity
  })

  return `<h2>전체 가격: ${totalPrice - totalDiscountPrice}원 (총 ${totalDiscountPrice}원 할인)</h2>`
}


const list = (list: Array<Item>) => {
  return `
  <ul>
    ${list
    .map(item)
    .reduce((tags, tag) => tags + tag, "")
  }
  </ul>
  `
}

const app = document.getElementById("app")
if(app !== null) {
  app.innerHTML = `
        <h1>장바구니</h1>
        ${list(cart)}
        ${totalCount(cart)}
        ${totalPrice(cart)}
    `
}