const suits = ["♠", "♣", "♥", "♦︎"]
const numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

let cards: Array<string> = []

for (const suit of suits) {
  for (const number of numbers) {
    cards.push(suit + number)
  }
}


// 모든 카드 목록은 아래의 작업이 완료된 것이다
const cards2 =
// 아래의 모든 작업을 모든 무늬에 적용한다
  suits.map((suit) =>
//  아래의 작업을 모든 숫자에 적용한다
    numbers.map((number) =>
//    카드는 무늬와  숫자를 연결한 문자열이다
      suit + number))
// 이렇게 하면 이중 배열로 출력이 된다.
// string[][] 타입으로 바뀐다 이것을 바꾸기 위해서는
// 무늬별로 나누어진 카드를 하나로 합쳐야 한다. Array<Array<T>> => Array<T> .
      .flat()


// 그런데 위의 동작을 수행해주는 것중에 flatMap 이 있다
const cards3 = suits.flatMap((suit) =>
  numbers.map((number) =>
    suit + number))