// 숫자가 타입인 함수
const idNumber = (n: number) : number => n

// 문자이 타입인 함수
const idString = (s: string) : string => s

// 불린이 타입인 함수
const idBooelan = (b: boolean) : boolean => b

// 지금 작성한 함수들은 모두 구현이 동일하다. 입력값을 그대로 돌려주는 구조
// 다른 모든 타입에 대해서도 구현은 항상 동일한 함수가 있다면 일반화 시켜서 하나의 함수로 만들 수 있다
// 그렇게 만드는 게 Generic
// 타입을 매개변수화시켜 어떤 값이 들어오더라도 같은 타입을 반환

// 임의의 T 타입의 x 를 받아서 반환.
// 타입을 이용한 함수형 프로그래밍에서는 함수에 대한 실제 구현 생각 전에 함수의 타입을 최대한 일반화시킨다.
// 제네릭을 사용해 타입을 만들고 안내되는 타입에 따라 구현하는 방식도 있다.
// 단 x 라는 게 온다는 것만 알고 number 타입의 연산 등은 구현할 수 없다
// Array.map / filter 등이 generic 을 사용해서 만든 메소드.
// 요약하자면, generic 으로 만들어진 타입은 타입을 받으면 그 타입을 리턴.
const id = <T>(x: T): T => x

// isExpensivePrice 에 특화된 Compose 함수 => 이후 Generic 을 사용해서 일반화된 함수로 만들기
const specificCompose = (isExpensive: (n: number | undefined) => boolean, getPrice: (s: string) => number | undefined) => (fruitName: string) => {
    return isExpensive(getPrice(fruitName));
}

// 이제 specificCompose 함수를 generic 을 사용해서 더욱 일반화 해보자

// 함수를 합성할 때 감싸진 함수의 공역과, 감싼 함수의 정의역은 같아야 한다.
// 1. genericCompose 에서 받는 인자는 f의 인자 값으로 바로 들어간다. 즉 두 개의 타입이 동일해야 한다.
// 2. 다음, f 의 반환 타입(공역)과 g 의 매개변수(정의역) 타입이 동일해야 한다
// 3. g의 출력 타입이 Boolean 뿐만 아니라 어떤 타입이 오더라도 사용할 수 있도록 만들어야 한다
const genericCompose = <A, B, C>(g: (y: B) => C, f: (s: A) => B) => (x: A) => {
    return g(f(x))
}


// ! 고차함수 타입 쉽게 알아보기
// <A,B,C>(g: (y: B) => C, f: (s: A) => B): (x: A) => C

// 타입스크립트가 화살표 등을 사용해 타입을 표현하는 것은 ML(MetaLanguage) 의 영향을 많이 받았다
// 타입의 표기, 특히 함수의 타입 표기가 어렵다면 매개변수를 지워 보이면 시워보인다

// <A,B,C>((B) => C, (A) => B): (A) => C
// 해석해보면 B 타입을 입력받아 C 타입을 반환하는 함수, A 타입을 입력받아 B 타입을 반환하는 함수를 인자로 갖고
// A 타입의 값을 입력받고 C 타입을 리턴하는 함수를 만든다
// 이렇게 생각하면 될듯.