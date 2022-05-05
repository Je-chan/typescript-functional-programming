import {Item} from "../cart";

const totalCaculator = (list: Array<Item>, getValue: (item: Item) => number) => {
  // 아래의 코드들을 map 의 잘못된 방식으로 사용한다면 어떻게 되는가
  // let total = 0;
  // for (let i = 0 ; i < list.length ; i++) {
  //   if(!list[i].outOfStock) total = total + getValue(list[i])
  // }
  //
  // return total

  // 기존에 좋은 방법으로 리팩터링 했을 때는 .filter, .map 을 사용했다
  // 그런데 기능 저하를 우려하여 이 둘을 하나로 합친다고 생각한다

  const result: Array<number> = [];


  /**
   * 메소드 체이닝을 하지 않았다.
   * 이런 함수들은 ESLint 애서는 에러를 낼 것
   * 콜백 함수가 리턴하는 게 없다면 실수일 것. 만약 정말로 리턴할 게 없다면 forEach 라는 함수로 대신하라는 안내문이 나올 것
   * map 함수는 입력과 배열의 원소의 개수와 동일한 개수의 배열을 돌려줘야 한다.
  */
  list.map(function(item) {
    if(!item.outOfStock) {
      result.push(getValue(item));
    }
  })

  /**
   * forEach 의 타입은 map 함수와 다르게 타입 파라미터를 사용하고 있지 않는다.
   * 반복해서 실행하는 인자인 콜백 함수는 무조건 void 를 반환하다.
   * forEach 의 최종적인 리턴 타입도 void 다.
   * forEach 를 사용하면 의미있는 리턴값이 없으므로 더이상 함수를 합성할 수 없고 이어서 체이닝을 할 수 없다.
   * void 타입은 부수효과를 일으키는 함수는 void, unit 과 같은 타입을 리턴한다.
   * 입력받은 값으로 부수효과를 발생시키기 떄문에 리턴값이 의미가 없거나 그 값을 정할 수 없다
   * 지금 우리가 사용한 forEach 는 result 라는 외부값만 변경하고 의미있는 리턴값을 만들지 않는다.
   * 그래서 위의 코드 처럼 map 을 사용할 이유가 없다.
   *
   * 그러므로, Map 을 사용할 떄, 인자로 전달된 콜백함수에서 부수효과만 일으키는 함수를 사용한다면? 잘못 사용하고 있는 것
   *
   * 그러나 forEach 보다 map 을 더 선호한다.
   * 함수형 프로그래밍에서는 부수효과를 줄이고 순수함수만을 사용하는 것이 좋다고 판단하기 때문
   * forEach 는 부수효과를 일으키는 함수
   *
   * map, filter 를 연속으로 사용하면 성능이 나빠지는 거 아닌가?
   * 그러나 협업과 유지를 위해서는 쉽게 이해할 수 있는 코드가 중요하다. 성능이 중요하다면 iterator, string 같은 자요구조로 자료를 더 적게 순회할 것
   */
  list.forEach(function(item) {
    if(!item.outOfStock) {
      result.push(getValue(item));
    }
  })

  return result.reduce((total,value) => total + value)
}