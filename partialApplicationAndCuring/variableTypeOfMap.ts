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
  const map_ = curry2(flip(map));

  map_(isEven)(numbers)

}