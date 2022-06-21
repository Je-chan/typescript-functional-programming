import {cart, Item} from "../option_partialFunction/cart";
import * as O from '../option_partialFunction/option'
import * as T from './tryType'
/**
 * 요구 사항
 * - 한 번에 너무 많은 수량을 주문할 수 없도록 최대 구매 수량을 10개로 제한
 * - 주문 수량이 - 등으로 잘못 입력되는 경우를 방지(1개 미만인 경우 에러)
 */

console.clear()

// 이 함수는 유효성만 판단하는 용도기에 return 은 따로 지정하지 않는다
const validateItem = (item: Item) => {
  if(item.quantity < 1) {
    throw new Error("상품은 반드시 한 개 이상 담아야 합니다.")
  } else if (item.quantity > 10) {
    throw new Error("한 번에 10개를 초과하여 구매할 수 없습니다.")
  }
}


/**
 * validation 에는 한 가지 오류가 존재한다
 * 판에 박힌 코드가 계속해서 반복된다는 것.
 * 값이 올바른지를 한 번만 검사해서 확인할 수는 없는가?
 * validation 은 검증만 할 뿐 그 검증 결과를 프로그램 전반에 걸쳐 알려주기가 어렵다
 * 그러나 파싱을 사용한다면 이런 부분을 일정 부분 해결할 수 있다
 * JSON.parse 처럼 임의의 문자열을 구체적인 Object Type 으로 바꾸고 실패하면 Error 로 Throw 를 한다
 * 우리의 Item 도 그렇게 바꿔보자
 * - 일단 우리가 검증해야 하는 대상은 Item 타입의 값
 * - return 타입은 parsing 이라는 작업은 실패할 수도 있기에 Try 타입으로 바꾸기
 */

// Parsing 이 성공적으로 완료됐을 때의 타입
type ParsedItem = {
  _tag: "parsedITem"
} & Item

// Parsing 이 실패했을 때의 타입
type ParseError = {
  name: string;
  message: string;
}

const parseItem = (item: Item): T.Try<ParseError, ParsedItem> => {
  if(item.quantity < 1) {
    return T.failed({
      name: item.name,
      message: "상품은 반드시 한 개 이상 담아야 합니다."
    })
  } else if (item.quantity > 10) {
    return T.failed({
      name: item.name,
      message: "한 번에 10개를 초과하여 구매할 수 없습니다."
    })
  }

  return T.success({
    _tag: "parsedItem",
    ...item
  })
}



type ArrayItem = Array<Item>

const stockItem = (item: ParsedItem): string => {
  return `
    <li>
      <h2>${item.name}</h2>
      <div>가격: ${item.price}</div>
      <div>수량: ${item.quantity}</div>
    </li>
  `
}

const outOfStockItem = (item: ParsedItem): string => `
  <li class="gray">
    <h2>${item.name} (품절)</h2>
    <div class="strike">가격: ${item.price}원</div>
  </li>
`

const renderITem = (item: Item): string => {
  try {
    const parsedItem = parseItem(item);

     if(item.outOfStock) {
      return outOfStockItem(item);
    } else {
      return stockItem(item);
    }
  } catch(e) {
    return `
      <li style="color: red">
        <h2>${item.name}</h2>
        <div>${e}</div>
      </li>
    `
  }
}

const totalCalculator = (list: ArrayItem, getValue: (item: Item) => number) => {
  // 수량이 잘못된 함수만 제외할 것이기에 여기에서 Filter 를 이용
  return list
    .filter(item => {
      try{
        validateItem(item);
        return !item.outOfStock
      } catch(e) {
        return false;
      }
    })
    .map(getValue)
    .reduce((total, value) => total + value, 0);
}

const totalCount = (list: ArrayItem): string => {
  const totalCount = totalCalculator(list, (item) => item.quantity)
  return `<h2>전체 수량: ${totalCount}</h2>`
}
