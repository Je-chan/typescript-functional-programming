import {cart} from './cart'

const list = () => {
    let html = "<ul>";

    // 현재 하나의 For 문 내에서 모든 것을 처리하려다 보니 관심사가 한 곳으로 집중되지 못하고 분산된다
    // 계산을 해야하는 기능별로 For 문을 분리해야 한다.
    // for 문 리팩터링 전

    // for (let i = 0 ; i < cart.length; i++) {
    //     html += "<li>"
    //     html += `<h2>${cart[i].name}</h2>`
    //     html += `<div>가격: ${cart[i].price}원</div>`
    //     html += `<div>수량: ${cart[i].quantity}개</div>`
    //     html += "<li>"
    //
    //     totalCount += cart[i].quantity
    //     totalPrice += cart[i].quantity * cart[i].price
    // }

    // For 문 리팩터링 후
    // 관심사별로 코드가 분리됨.
    // 관심사별로 모였지만 판에 박힌 코드가 반복되고 있다.
    // 또한 기존의 요구 사항에서 outOfStock 이 false 라면 품절처리 하는 로직을 추가한다고 했을 때
    // 다음과 같이 코드가 중복돼서 나타나는 문제가 발생한다.

    for (let i = 0 ; i < cart.length; i++) {
        if(!cart[i].outOfStock) {
            html += "<li>"
            html += `<h2>${cart[i].name}</h2>`
            html += `<div>가격: ${cart[i].price}원</div>`
            html += `<div>수량: ${cart[i].quantity}개</div>`
            html += "<li>"
        } else {
            html += "<li class='gray'>"
            html += `<h2>${cart[i].name} (품절)</h2>`
            html += `<div>가격: ${cart[i].price}원</div>`
            html += `<div>수량: ${cart[i].quantity}개</div>`
            html += "<li>"
        }
    }
    html += "</ul>"


    let totalCount = 0;
    for (let i = 0 ; i < cart.length; i++) {
        if(!cart[i].outOfStock) {
           totalCount += cart[i].quantity
        }
    }
    html += `<h2>전체 수량: ${totalCount}개</h2>`


    let totalPrice = 0;
    for (let i = 0 ; i < cart.length; i++) {
        if(!cart[i].outOfStock){
            totalPrice += cart[i].quantity * cart[i].price
        }
    }
    html += `<h2>전체 가격: ${totalPrice}원</h2>`

    return `
        ${html}
    `
}

const app = document.getElementById("app")
if(app!==null) {
    app.innerHTML = `
        <h1>장바구니</h1>
        ${list()}
    `
}