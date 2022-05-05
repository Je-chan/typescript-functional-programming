/* 요구 사항: 장바구니를 그려야 한다.
* 장바구니를 순회한다
* => 화면에 상품 이름, 가격, 수량을 표시한다
*
* 전체 가격 전체 수량도 화면에 그려야 한다
* => 위의 과정에서 totalPrice, totalCount 에 값을 누적한다
*
* 재고 없는 상품을 class="gray" 로 만들어야 한다
* => 4번, 7번 째 줄의 동작을 수행할 떄 재고 여부에 따라 다르게 동작시킨다
*
*
* 함수형 프로그래밍으로 해야하는 이유
* => 좋은 틀을 만들면 안정적으로 개발할 수 있따
* => 틀이 이상해지면 작업의 공수가 매우 커진다. 혹은 비슷한 일을 하는 코드가 반복한다
* => 함수형 프로그래밍은 최소한의 의미를 갖는 순수함수를 가지고 레고블럭처럼 조합해서 더 큰 프로그램을 만들어 나간다
* => 함수의 재사용성을 높이고 합성을 쉽게 하기 위해서는 함수가 여러 일을 하지 않고 하나의 일만 제대로 처리를 해야 한다
* */

// 함수로 나눈다면
// 1. 아이템 목록 화면 / 재고가 있는 아이템, 재고가 없는 아이템
// 2. 전체 수량 표시
// 3. 젙체 가격 표시



import {cart, Item} from './cart'

const stockItem = (item: Item): string => `
  <li>
    <h2>${item.name}</h2>
    <div>가격: ${item.price}원</div>
    <div>수량: ${item.quantity}개</div>
  </li>
`

const outOfStockItem = (item: Item): string => `
  <li class="gray">
    <h2>${item.name} (품절)</h2>
    <div>가격: ${item.price}원</div>
    <div>수량: ${item.quantity}개</div>
  </li>
`

const item = (item: Item): string => {
  if(item.outOfStock) return outOfStockItem(item)
  else return stockItem(item)
}

// 이 상태의 totalCount, totalPrice, List 는 아직은 순수함수로 보기 어렵다
// 전역 변수인 cart 에 의존하고 있고, 아무런 인자를 받고 있지 않기 때문
// 그렇기에 전역 변수인 cart 가 주어지지 않으면 테스트하기도 어렵고 모듈화도 어렵다.
// 그래서 각각의 함수에는 list 라는 인자를 부여한다.
const totalCount = (list: Array<Item>): string => {
  let totalCount = 0;
  for (let i = 0 ; i < list.length; i++) {
    if(!list[i].outOfStock) {
      totalCount += list[i].quantity
    }
  }

  return `<h2>전체 수량: ${totalCount}개</h2>`
}

const totalPrice = (list: Array<Item>): string => {
  let totalPrice = 0;
  for (let i = 0 ; i < list.length; i++) {
    if(!list[i].outOfStock){
      totalPrice += list[i].quantity * list[i].price
    }
  }
  return `<h2>전체 가격: ${totalPrice}원</h2>`
}

const list = (list: Array<Item>) => {
  let html = "<ul>";

  for (let i = 0 ; i < list.length; i++) {
    html += item(list[i])
  }

  html += "</ul>"

  return `
        ${html}
    `
}

// 추가적으로 보면, 현재 totalCount와 totalPrice 는 return 부분만 제외하고는 거의 유사하다.
// 이런 것들은 모듈화할 수 있다.

/**
 * 전체 목록 중 재고가 있는 상품만 getValue를 실행하고 그 값을 모두 더한다.
 * 1. 재고가 있는 상품만 분류하기
 * 2. 분류된 상품들에 대해 getValue 를 실행하기
 * 3. getVAlue 가 실행된 값 모두 더하기
 * => 이런 모든 기능들은 for 문을 통해서 하는 것보다 array 내장 메소드들, filter, map, reduce 를 활용해 구현할 수 있다.
 */
const totalCalculator = (list: Array<Item>, getValue: (item: Item) => number) => {

  // 아래의 코드들은 filter, map, reduce 함수들을 사용해서 해결할 수 있다.
  // let total = 0;
  //
  // for (let i = 0 ; i < list.length; i++) {
  //   if(!list[i].outOfStock){
  //     total += getValue(list[i])
  //   }
  // }
  // return total

  return list
    // 1. 재고가 있는 상품들만 분류하기
    .filter(item => !item.outOfStock)
    // 2. 분류된 상품들에 대해서 getValue 실행하기
    .map(getValue)
    // 3. getValue가 실행된 값 모두 더하기
    .reduce((total, value) => total + value, 0)
}

// 위의 함수를 사용해서 totalCount 와 totalPrice 는 다음과 같이 리팩터링이 가능하다
const totalCountRefactored = (list: Array<Item>): string => {
  const totalCount = totalCalculator(list, (item) => item.quantity);
  return `<h2>전체 수량: ${totalCount}개</h2>`
}

const totalPriceRefactored = (list: Array<Item>): string => {
  const totalPrice = totalCalculator(list, (item) => item.quantity * item.price);
  return `<h2>전체 가격: ${totalPrice}원</h2>`
}


/**
 * 위에서 언급했듯이 현재 List 는 리팩터링을 할 수 있다.
 * 1. 목록에 있는 아이템을 태그로 변경한다
 * 2. 태그의 목록을 모두 하나의 문자열로 연결한다
 */
const listRefactored = (list: Array<Item>) => {
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
        ${listRefactored(cart)}
        ${totalCountRefactored(cart)}
        ${totalPriceRefactored(cart)}
    `
}