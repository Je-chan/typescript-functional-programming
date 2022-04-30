/*
* 사과: 5000원
* 포도: 10000원
* 망고: 15000원
* */

let totalPrice = 0;

// 순서대로 사과, 포도, 망고를 구매했다고 생각할 수 있음
totalPrice += 5000;
totalPrice += 10000;
totalPrice += 15000;

// 그러나 아래의 코드는 ??? 사과 6개? 포도 3개? 망고 2개? 알 수 없음
totalPrice += 30000;

// 사과를 더하려다가 오타로 1000원을 더 추가해버리는 문제가 있을 수도 있다.
// 하나의 메인에 모든 것을 다 작성하면 어려운 것
totalPrice += 6000


// * 명령형으로 해결하는 방법
// 명령형 프로그래밍의 방식은 지금처럼 컴퓨터가 계산 하는 절차를 명령을 내리는 방식으로 진행
// 그렇기에 더해주는 값이 필요하므로 전역 변수를 생성해야만 한다. (더하기의 명령의 대상이 되는 변수가 필요하기 때문)
// 문제는 전역 변수 때문에 부수효과가 발생할 수 있다.
// 전역 변수에는 계속 값이 할당 돼 있는 상태라 파일이 리셋해야할 때 되지 못하면 이전의 값을 그대로 들고 간다)
let ImperativeTotalPrice = 0;

const addApple = () => {
    ImperativeTotalPrice += 5000
}

const addGrape = () => {
    ImperativeTotalPrice += 10000
}

const addMango = () => {
    ImperativeTotalPrice += 15000
}

// 하나의 묶음 세트로 사과, 포도, 망고 하나씩 판매하는 경우
const ImperativeList1 = () => {
    addApple()
    addGrape()
    addMango()
}

// 하나의 묶음 세트로 망고 세 개씩 판매하는 경우
const ImperativeList2 = () => {
    addMango()
    addMango()
}

// 사과 100개?!
const ImperativeList3 = () => {
    for (let i = 0 ; i < 100 ; i++) {
        addApple();
    }
}

// * 함수형으로 해결하는 방법 (1)
// 각각의 과일의 가격이 얼마인지 나타내는 함수를 만들어서 이야기 풀어내기
// 순수 함수 위주로 코드 작성한다
// 명령형과 함수형의 주된 차이는 "어떻게" 와 "무엇" 이다.
// 어떻게 계산할 것인가가 아니라, 얼마만큼의 값인가. 이렇게 나뉜다.


// 극단적이긴 하지만 아래의 함수들은 항상 동일한 값만을 나타낸다.

// 호출할 떄마다 가격을 계산하는 것이 아니라 값만을 나타낸다.
const priceOfApple = () => 5000;
const priceOfOrange = () => 10000;
const priceOfMango = () => 15000;


// 계산된 결과를 계산해서 리턴해주고 있다
const DeclarativeList1 = () => {
    return priceOfApple() + priceOfOrange() + priceOfMango()
}

const DeclarativeList2 = () => {
    return priceOfMango() + priceOfMango()
}

const DeclarativeList3 = () => {
    // 더한다는 행위가 필요하지 않으므로 *100 으로 가능해진다.
    return priceOfApple() * 100;
}


// * 함수형으로 해결하는 방법 (2)
// 위의 코드를 리팩터링하자. 값을 가져오는 함수를 일반화해보기

// string 은 정의역, number, undefined 는 공역이 된다. 치역은 5000, 10000, 15000, undefined 가 된다
// 구현 코드를 보지 않고 타입만 갖고도 그 함수의 정보를 아는 경우가 존재한다.
const getPrice = (name: string): number | undefined => {
    if(name === "apple") return 5000
    else if(name === "orange") return 10000
    else if(name === "mango") return 15000
}


// price: number 로만 타입을 주면 getPrice 의 공역과 isExpensive 의 정의역이 같지 않으므로 에러 발생
// number | undefined 로 동일하게 가야 한다.
const isExpensive = (price: number | undefined) => {
    // 이번에는 price 가 undefined 일 수 있으므로 크기 비교가 안 돼 에러를 발생시킨다
    // 그래서 undefined 인 경우를 분기처리한다

    if(price === undefined) return  false
    return price > 10000;
}

// 이은 함수들은 다시 하나의 이름으로 함수 하나를 만든다
// 함수의 합성은 정의역과 공역을 일치시키기만 하면 된다.
const isExpensivePrice= (fruitName: string): boolean => {
    return isExpensive((getPrice(fruitName)))
}

const main = () => {
    // const price = getPrice( "orange")
    // return isExpensive(price)
    // 함수를 잇는다는 건 아래와 같이 어떤 함수의 출력을 입력으로 넘겨주는 것을 의미한다

    // 타입이라는 건 나중에 문제가 생기지 않도록 미리 알려주는 것. 컴파일러가 이런 상황을 알려주지 않았다면 런타임 에러로 나왔을 것
    // return isExpensive((getPrice("orange")))

    return isExpensivePrice("orange")
}


