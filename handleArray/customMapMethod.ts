// map 함수는 모든 타입의 배열에 동작할 수 있어야 하므로 generic 으로 작성해야 한다
// f의 타입은 당연히 A 가 돼야 한다
// 출력 타입은 입력한 타입과 다른 타입이여도 된다

export const map = <A, B>(array: Array<A>, f:(a: A) => B ): Array<B> => {

  const result: Array<B> = []
  // for 문으로 구현하기
  for(const value of array) {
    // value 는 타입이 A 고, f의 타입이 A 이기에 For 문 내에서는 f 에 적용하는 것만 가능하다
    result.push(f(value));
  }

  return result

  // map 함수의 동작은 Array Map 메소드와 동일
  // map 을 사용할 때는 map 함수가 어떻게 구현돼 있는지 알 필요가 없고 주어진 함수를 사용해서 새로운 배열을 얻는다는 것만 알면 된다.
  // 이런 게 고차함수를 이용한 추상화 방식.
}