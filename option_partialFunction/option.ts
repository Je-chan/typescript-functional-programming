// 값이 있거나 없는 두 가지 중 하나가 될 수 있는 타입. => 값이 있을 수도, 없을 수도 있는 자료구조

// 아래의 코드 경우, undefined 가 여러 상황에서 사용될 수 있기 때문에 좋은 코드는 아
export type OptionBad<A> = A | undefined;

// 값이 있을 때는 some, 없을 때는 none 으로 처리
// 각각의 타입이 무엇인지를 명시하기 위해 _tag 를 단다.
// 함수형 프로그래밍에서는 값의 변경이 일어나면 안 되기에 readonly 로 모두 작성한다.
// SOME 은 원래의 값을 가질 수 있어야 하기에 제네릭으로 갖게 한
export type Some<A> = {
  readonly _tag: "Some",
  readonly value: A
}

// None 은 값이 없다는 것을 나타내기 위한 용도이기에 다른 값을 가지지 않아도 된다
export type None = {
  readonly _tag: "None"
}

export type Option<A> = Some<A> | None

const n1: Option<number> = {_tag: "Some", value: 1};

// 값을 조금 더 쉽게 만들기 위해 Some 과 None 타입의 값을 만들어 주는 함수를 만들어 보자
// A와 undefined 를 사용하지 않은 대신 이렇게 번거롭게 구현하는 이유는 타입을 더 정확하고 안정성 있게 작성하기 위한 방법
// ADT 라 부르는 대수 자료 구조의 합 타입의 일종. Swift, Kotlin, Rust 에서 비슷한 기능을 제공 중.
export const some = <A>(value: A): Option<A> => ({_tag: "Some", value});
export const none = (): Option<never> => ({_tag: "None"})

// some 타입인지 확인하는 로직
// 타입을 식별하는 _tag 를 사용.
export const isSome = <A>(oa: Option<A>): oa is Some<A> => oa._tag === "Some"
export const isNone = <A>(oa: Option<A>): oa is None => oa._tag === "None"

// undefined 를 사용해서 값의 부재를 나타내는 타입을 Option 으로 변환해주는 함수
export const fromUndefined = <A>(a:A | undefined) : Option<A> => {
  if(a === undefined) return none();
  return some(a);
}

// usingOptionType 에서 공통으로 사용되는 로직:
// 1. 값이 없으면 지정된 값을 사용하고 (지정된 값이 아래 함수에서는 defaultValue)
// 2. 값이 있다면 해당 값을 사용한다
export const getOrElse = <A>(oa: Option<A>, defaultValue: A): A => {
  // 1. 값이 없으면 지정된 값을 사용한다
  if(isNone(oa)) return defaultValue;
  return oa.value;
}

// Option 의 Map 함수 구현하기
// 배열의 map 과 마찬가지로 두 가지의 인자를 받아야 한다. Option 타입의 값 하나와, 적용할 함수 하나
export const optionMap = <A, B>(oa: Option<A>, f:(a:A) => B) : Option<B> => {
  // 값이 없으면 값이 없는 상태를 유지할 것
  if(isNone(oa)) return oa;
  // 값이 있으면 값을 함수에 적용할 것

  // 밑의 리턴 타입은 Option<B> 가 아니라 순수 B 타입이 때문에 에러가 발생한다.
  // return f(oa.value);

  // 함수의 리턴값을 값이 있는 Option 인, Some 타입으로 만들어야 한다.
  return some(f(oa.value))
}

// optionMap 이 먼저 실행돼야 한다. 그러므로 optionMap 과 관련된 모든 인자를 가져다 넣는다.
// getOrElse 함수의 인자 중, 첫 번째 인자는 optionMap 의 결과과 입력될 것이기에 생략해야 한다. 하지만 defaultValue 는 필요
//
export const optionMapOrElse = <A,B>(
  oa: Option<A>,
  f: (a: A) => B,
  defaultValue: B
): B => {

  return getOrElse(optionMap(oa, f), defaultValue)
}