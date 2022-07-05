// 실패하거나 성공했을 때 각각 다른 값을 가지는 자료 구조

// Success Type (불변성을 위해 readonly)
type Success<R> = {
  readonly _tag: "success",
  readonly result: R
}

// Fail Type
type Failed<E> = {
  readonly _tag: "failed",
  readonly error: E,
}

// 이제 필요한 것은 계산의 성공과 실패를 나타낼 수 있는 하나의 타입으로 만드는 것
export type Try<E, R> = Failed<E> | Success<R>

// 평범한 값을 성공이나 실패로 만들어주는 값을 만들어 보기
// 이런 함수들이 없으면 tag 를 일일이 만들어줘야 하기에 매우 귀찮음
export const success = <R>(result: R): Try<never, R> => ({
  _tag: "success",
  result
})

export const failed = <E>(error: E): Try<E, never> => ({
  _tag: "failed",
  error
})

// Try 의 타입의 값을 더 구체적으로 확인할 수 있는 값 (tag 를 활용해서 알아 보고 타입 가드를 함께 사용한다)
// unknown ? never ?
  // 안 쓰는 타입 파라미터가 리턴 타입에서 사용할 때는 never
  // 인자의 타입에서 사용할 때는 unknown
  // 인자 타입과 리턴 타입에 따라 서브 타입의 동작이 달라지기에(공변성과 반 공변성) 구분지어 사용한다
export const isSuccess = <R>(ta: Try<unknown, R>): ta is Success<R> =>
  ta._tag === "success";

export const isFailed = <E>(ta: Try<E, unknown>): ta is Failed<E> =>
  ta._tag === "failed";

export const getOrElse = <E, R>(ta: Try<E, R>, defaultValue: (e: E) => R): R => {
  // 에러가 있을 경우 에러에 기반하여 기본 값을 결정한다
  if(isFailed(ta)) return defaultValue(ta.error)
  // 결과가 성공이라면 해당 값을 사용한다
  return ta.result
}

// try 의 map 함수는 option 과 거의 비슷하다
export const map = <E, A, B>(ta: Try<E, A>, f: (a: A) => B): Try<E, B> => {
  if(isFailed(ta)) return ta;
  return success(f(ta.result))
}

// map 의 경우, if 구문에서 success 판정이 나면 R 값을 돌려줄 수 있지만
// else 구문에서는 Array<R> 이라는 타입 때문에 리턴해줄 수가 없다. 그렇다고 값을 지정해주지 않으면 undefined 가 나오는 문
// map 은 구조가 변하면 안 된다는 제한이 걸린다
// flatMap 은 map 과 비슷하지만 구조를 변경할 수 있다

// flatMap :: (A => Array<B>) => (Array<A> => Array<B>)
// map     :: (A => B)        => (Array<A> => Array<B>)

export const KeepSuccess =
  <E, R>(tas: Array<Try<E, R>>): Array<R> => {
    const ret = tas.flatMap((ta) => {
      if (isSuccess(ta)) return [ta.result]
      else return []
    })

    return ret;
}

export const KeepSuccessForLoop = <E, R>(tas: Array<Try<E, R>>): Array<R> => {
  const ret: Array<R> = [];

  for(const ta of tas) {
    if(isSuccess(ta)) {
      // 기존의 구현과 가장 차이가 나는 곳.
      // flatMap 을 사용하면 성공이나 실패의 여부에 따라 값으로 돌려주었고, 값이 무엇이 되어야 하는가를 선언적 사고가 이뤄진다
      // Loop 를 사용하면 Loop 안에서 값을 리턴할 수 없기에 값을 중심으로 사고하기 어렵고, 성공했을 때 어떤 동작을 해야하는지 명력적인 동작을 이루게 된다
      // 함수형 프로그래밍에서는 선언적 방식을 장려하고 있다
      // 중요한 것은 부수효과가 무엇인지 알고 격리하는 방법만 안다면 이런 방식의 코드 작성이 얼마든지 가능하다
      ret.push(ta.result);
    }
  }

  return ret;
}

/**
 * flat 함수의 역할을 배열에만 한정짓지 않는다면 중첩된 효과를 하나의 효과로 푸는 과정이 된다
 *
 * Try에 flat 함수를 적용하면 타입이 어떻게 변경될까?
 * flat :: Try<E, Try<E, A>> => Try<E, A>
 */

export const tryFlat = <E, A>(tta: Try<E, Try<E, A>>): Try<E, A> => {
  // tta 가 성공이라면 result 를 그대로 return 하면 된다
  if(isSuccess(tta)) return tta.result
  // 실패했다면 tta 를 그대로 리턴하면 된다 (중첩되어 있지만 타입이 다른데 이게 어떻게 가능한가?)
  /**
   * Try 라는 타입은 실패했을 때와 성공했을 때 타입이 나뉜다.
   * 실패했을 때는 첫 번째 타입 인자만 사용하고, 성공했을 때는 두 번째 타입 인자만 사용한다
   * 그래서 함수에 주어진 인자가 성공이라면 Success 안에 Try<E, A> 가 담겨 있기에 인자의 result 를 리턴하면 되고
   * 실패했을 때는 Try 의 실패한 것에 해당하는 타입 파라미터만 사용하기 때문에 return 타입과 동일한 Failure 타입이 된다
   */
  return tta;
}

export const tryFlatMap = <E, A, B>(ta: Try<E, A>, f: (a: A) => Try<E, B>):Try<E, B> => {
  return tryFlat(map(ta, f));
}