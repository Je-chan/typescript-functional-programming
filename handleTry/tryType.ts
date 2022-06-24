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
      if(isSuccess(ta)) return [ta.result]
      else return []
    })

    return ret;
  }