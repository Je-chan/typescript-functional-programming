console.clear()

const tenDivideBy = (n: number) : number => {
  if(n === 0) {
    // Error 가 추가됐지만 return 타입은 변함없이 number
    // 함수의 타입만으로는 이 함수가 예외를 발생시키는 함수인지를 확인하기 어렵다
    throw new Error("0으로 나눌 수 없습니다.")
  }

  return 10 / n;
}

// 아래의 코드 경우 1) 과 2) 는 프로그램의 동작에 변함이 없지만
// y 에 대한 선언이 try, catch 바깥으로 나오게 되면 return 1 을 하지 않고 에러를 발생시킨다
// 때문에 main 의 x 에 대한 콘솔과 "프로그램이 종료되었습니다" 라는 콘솔은 실행되지 않는다
const test = () => {
  const y = tenDivideBy(0);
  try {
    return y;
    // 1) return tenDivideBy(0)
    /**
     * 2)
     * const y = tenDivideBy(0)
     * return y
     */
  } catch (e) {
    return 1;
  }
}

// 명시적으로 값을 사용한다면 이를 해결할 수 있다 => Try 의 타입을 만들어 보기

export const main = () => {
  const x = test();
  console.log(x);
  console.log("프로그램이 종료되었습니다")
}
