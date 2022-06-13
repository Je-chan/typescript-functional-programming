import * as O from '../option_partialFunction/option'

export const curry2 = <A, B, C>(f: (a: A, b:B) => C) => (a: A) => (b: B) : C => f(a, b);

export const flip = <A, B, C>(f: (a:A, b:B) => C) => (b: B, a: A): C => f(a, b);

// Array<A> == A[]
// map :: (Array<A>, (A => B)) => Array<B>
export const map = <A, B>(array: Array<A>, f:(a: A) => B) : Array<B> => {
   const result: Array<B> = [];
   for(const value of array) {
     result.push(f(value));
   }

   return result;
}

export const main = () => {
  const numbers = [1, 2, 3];
  const isEven = (x: number) => x % 2 === 0;

  map(numbers, isEven);

  // currying 된 map 함수는 아래와 같음
  // curriedMap :: Array<A> => ((A => B) => Array<B>)
  const curriedMap = curry2(map);
  curriedMap(numbers)(isEven);

  // 원래 기본 내장 Array.prototype.map 을 사용한다면 아래와 같다
  // 아래 코드는 map 이 배열의 메소드이기 때문에 numbers 가 인자로 주어진 것이 아니라 인스턴스로써 메서드를 직접 호출하고 있는 것
  // Array<A>.map :: (A => B) => Array<B>
  // 위의 타입 표현은 아래처럼 표현할 수 있다. (인스턴스를 타입으로 빼고 암시적인 인자라는 표현으로 ~> 을 사용)
  // map :: Array<A> ~> (A => B) => Array<B>
  // 이것과 위의 curriedMap 의 표현식과 거의 동일
  numbers.map(isEven)

  // flip과 curry2 함수를 조합하면 인자 순서를 변경하고 커링하는 과정을 단순하게 표현할 수 있다
  // map_ 은 작은 함수들을 조합해서 큰 함수를 만들어내는 것. 함수를 합성해서 복잡한 프로그램을 만들어내는 것
  // map_ :: (A => B) => Array<A> => Array<B>
  const map_ = curry2(flip(map));
  map_(isEven)(numbers)

  // 위 함수는 이미 커링이 된 함수이기 때문에 인자를 하나만 넣을 수 있다
  // 이렇게 하면 어떤 값이 될 것인가?
  // isEven :: number => boolean
  // mapIsEven :: Array<number> => Array<boolean>
  // 커링함수를 보면 위의 타입 결과는 당연한 것 / map_ :: (A => B) => (Array<A> => Array<B>) 이기 때문
  const mapIsEven = map_(isEven)

  mapIsEven(numbers);
  mapIsEven([]);
  mapIsEven([42]);

  // 완전히 동일한 작업이 Option 에서도 할 수 있다
  const omap = curry2(flip(O.optionMap));

  // optionIsEven :: Option<number> => Option<boolean>
  const optionIsEven = omap(isEven);
  optionIsEven(O.some(42));
  optionIsEven(O.none());

  /**
   * 지금까지의 내용을 종합해보면
   *
   * 부수효과를 추상화한 자료구조인 배열과 Option 을 만들고 사용
   * map 이라고 하는 부수효과를 동반하는 데이터에 순수 함수를 적용할 수 있는 공통적인 인터페이스가 존재
   * map 덕분에 순수함수를 서로 다른 부수 효과에 적용할 수 있는 효과적인 방법이 하나 생긴 것
   * 부수효과를 찾아내고 공통적인 방법으로 추상화할 수 있게 된다
   *
   * map 함수의 실용적인 의미
   * functor 를 실용적인 측면에서 생각해본다면 map 함수를 이용해서 부수효과가 없는 순수 함수를 부수 효과를 다루는 함수로 만들어주고
   * 특정한 부수 효과가 아니라 다양한 부수효과에 범용적으로 다룰 수 있다
   *
   * 부수 효과의 중첩에서 봤던 flatmap 과 같은 것
   */
}

