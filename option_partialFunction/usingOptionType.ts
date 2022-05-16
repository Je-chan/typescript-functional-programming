/**
 * If 문은 사용하는 맥락에 따라 다양하게 사용할 수 있다.
 * 값이 있는지 없는지 뿐만 아니라 대수 비교 등 다양한 조건들을 검증한다
 * 쓰임이 매우 다양하기에 If 문 어떻게 처리하는지 파악하려면 사용하는 맥락을 고려해야 한다
 * 값의 부재를 확인하는 용도로 사용할 때는 정확하게 그런 목적을 표현하는 타입을 사용하는 것이 부수적인 맥락을 파악할 떄 덜 신경써도 된다
 *
 * 또, 명령적인 구문이 사용되는 건 합성하기 까다롭다
 * 그리고 구문처럼 제각각인 코드를 작성해야 하기에 알아야 하는 것도 많다
 * 부수 효과의 추상화와 추상화된 부수효과를 단일 인터페이스로 다룬다면 서로 다른 부수효과라도 통일된 방식으로 코드를 작성할 수 있다
 *
 * 이 스크립트에서는 이전에 If 문으로 작성했던 코드를 Option 을 사용해서 리팩터링 해보자
 */

import {cart, Item} from './cart'
import * as O from './option'

const stockItem = (item: Item): string => {
  // let saleText = '';
  // let discountPrice = 0;
  // if(item.discountPrice !== undefined) {
  //   saleText = `(${item.discountPrice}원 할인)`
  //   discountPrice = item.discountPrice
  // }

  // 주석 처리된 코드는 아래의 코드들로 리팩터링할 수 있다.
  // 이전에는 discountPrice 의 값이 If 문에 의해 변경될 가능성이 있어 let 으로 선언했으나
  // 이제는 선언적으로 만들 수 있으므로 const 로 선언할 수 있게 되었다.
  const optionDiscountPrice = O.fromUndefined(item.discountPrice);
  const discountPrice = O.getOrElse(optionDiscountPrice, 0);

  let saleText = "";
  if(O.isSome(optionDiscountPrice)) {
    saleText = `(${discountPrice}원 할인)`
  }
  return `
    <li>
      <h2>${item.name}</h2>
      <div>가격: ${item.price - discountPrice} ${saleText}</div>
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
    // 함수 호출이 중첩됐지만, 함수형 프로그래밍 언어에서 함수 합성을 쉽게 해주는 타입 프라임 오퍼레이터나 컴포즈 연산자가 필수 사용이다
    // item.discountPrice /> O.fromUndefined($) /> O.getOrElse($, 0)
    const discountPrice = O.getOrElse(O.fromUndefined(item.discountPrice), 0);

    return discountPrice * item.quantity
  })

  return `<h2>전체 가격: ${totalPrice - totalDiscountPrice}원 (총 ${totalDiscountPrice}원 할인)</h2>`
}


const list = (list: Array<Item>) => {
  return `
  <ul>
    ${list
    // 1. 목록에 있는 아이템을 태그로 변경
    .map(item)
    // 2. 태그의 목록을 모두 하나의 문자열로 연결
    .reduce((tags, tag) => tags + tag, "")
  }
  </ul>
  `
}

const app = document.getElementById("app")
if(app!==null) {
  app.innerHTML = `
        <h1>장바구니</h1>
        ${list(cart)}
        ${totalCount(cart)}
        ${totalPrice(cart)}
    `
}