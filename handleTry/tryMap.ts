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
  _tag: "parsedItem"
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
type ArrayItemTryMap =  Array<T.Try<ParseError, ParsedItem>>

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

const renderItem = (item: Item): string => {
  try {
    // parseItem 은 타입이 Try 이고 이 안에 파싱된 값이 들어 있는 형태
    // 그렇기에 outOfStockItem 에 바로 적용할 수 없다(outOfItem 은 성공한 타입(parsedItem) 만을 취하기 때문)
    // 이런 상황에서 필요로 하는 것이 map
    // Option 에서는 값이 존재할 때만 map 함수를 사용한 것과 유사함
    // Try 는 실패했을 때는 자신을 리턴하고, 성공일 경우에만 인자로 전달된 함수를 자기 자신의 데이터에 적용해서 그 결과를 리턴한다
    // 이 과정에서 성공과 실패의 여부는 바뀌지 않는다. map 의 가장 중요한 것은 구조가 보존돼야 한다는 점
    const parsedItem = parseItem(item);

     if(item.outOfStock) {
      return outOfStockItem(item);
    } else {
      return stockItem(item);
    }
  } catch(e) {
    // 기존에는 error 가 나면 화면에 그려주는 방식
    // 그러나, 파싱이 실패하면 T.map 덕분에 parseError Type 의 값을 얻을 수 있다
    // item 값을 받아서 HTML 로 바꾸었듯이 동일하게 parseError 의 타입을 HTML 문자열로 변경하는 함수를 만들어서 사용할 수 있다
    // 다시 말하면, Error 타입의 값을 받아서 화면에 렌더링할 컴포넌트를 만들 수 있다는 것
    // 그걸 errorItem 이라는 함수로 만들어서 사용한다
    return `
      <li style="color: red">
        <h2>${item.name}</h2>
        <div>${e}</div>
      </li>
    `
  }
}

const errorItem = (e: ParseError) => `
    <li style="color: red">
       <h2>${e.name}</h2>
       <div>${e.message}</div>
    </li>
 `

// 불필요한 Try Catch 문도 없앨 수 있다
// 그리고 이제 item 으로 받는 것들은 모두 Parsed 된 것들만 인자로 넣어주도록 한다 (그래야 위에 거 마냥 item에서 에러가 발생 X)
const renderItemAfterUsingTryMap = (item: ParsedItem): string => {
  const parsedItem = parseItem(item);
  const render = T.map(parsedItem, (item) => {
    if(item.outOfStock) {
      return outOfStockItem(item);
    } else {
        return stockItem(item);
    }
  })
  return T.getOrElse(render, errorItem)
}

const totalCalculator = (list: ArrayItem, getValue: (item: Item) => number) => {
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

const totalCalculatorTryMap = (list: ArrayItemTryMap, getValue: (item: ParsedItem) => number) => {
  return T.KeepSuccess(list)
    // Array<T.Try<ParseError, ParsedItem>> => Array<ParsedItem>
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


const totalPrice = (list: Array<Item>): string => {
  const totalPrice = totalCalculator(list, (item) => item.quantity * item.price);

  const totalDiscountPrice = totalCalculator(list, (item) => {
    const discountPrice = O.getOrElse(O.fromUndefined(item.discountPrice), 0);

    return discountPrice * item.quantity
  })

  return `<h2>전체 가격: ${totalPrice - totalDiscountPrice}원 (총 ${totalDiscountPrice}원 할인)</h2>`
}


const list = (list: ArrayItemTryMap) => {
  return `
  <ul>
    ${list
    // 1. 목록에 있는 모든 아이템을 태그로 변경
    .map(item => T.getOrElse(
      T.map(item, parsedItem => renderItemAfterUsingTryMap(parsedItem)), 
      errorItem
    ))
    // 2. 태그의 목록을 모두 하나의 문자열로 연
    .reduce((tags, tag) => tags + tag, "")
  }
  </ul>
  `
}


