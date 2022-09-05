const GAME_TIME = 9;
let score = 0;
let time = GAME_TIME;
let isPlaying = false;
let timeInterval;
let checkInterval; // 이 부분 이 방법 유의
let words = [];
const wordDisplay = document.querySelector('.word-display');
const wordInput = document.querySelector('.word-input');
const scoreDisplay = document.querySelector('.score');
const timeDisplay = document.querySelector('.time');
const button = document.querySelector('.button');


init();

function init(){
  buttonChange('게임로딩중...'); // 단어를 다 받아오기전에는 로딩중이 뜨도록 설정.
  getWords();
  wordInput.addEventListener('input', checkMatch);
}

function checkStatus(){
  if(!isPlaying && time === 0){
    buttonChange("게임시작") // "게임 종료"를 입력하게되면 buttonChange 함수의 조건식에 의해 버튼이 재활성화가 안되니 주의!
    clearInterval(checkInterval);
  }
}

// 게임 실행
function run (){
  if (isPlaying) { // 게임중에 버튼이 눌리지 않도록! 게임중이면 시작하자마자 리턴을 시켜버리면 게임이 실행되지 않음.
    return;
  }
  isPlaying = true; // 이게 없으면 처음에는 작동하나, 두번째부터 안됨 false로 바뀐상태로 유지되기 때문.
  time = GAME_TIME; // 다시시작할 때 시간 초기화.
  wordInput.focus(); // 버튼을 누르면 input창에 포커스가 감.
  score = 0;
  scoreDisplay.innerText = 0; 
  timeInterval = setInterval(countDown, 1000); // countDown 다음에 괄호를 붙이면 8초에서 멈춰있는 버그가 발생.
  checkInterval = setInterval(checkStatus, 50); // 게임중이 아니고(false) 시간이 0인지 계속학인해줌
  buttonChange('게임중..'); // 게임이 실행되면 게임중으로 바뀌고, buttonChange함수의 조건으로 인해, 비활성화됨.
};

// 단어 불러오기
function getWords(){ // 구글 검색 - axios - github - Using jsDelivr CDN 코드 복사해서 HTML head안에 붙여넣기. & performing a Get request의 첫문단? 복붙. npm을 사용하지 않았기 떄문에 const axios = require('axios')라는 문장을 불필요.
  axios.get('https://random-word-api.herokuapp.com/word?number=100') 
  .then(function (response) {
    // handle success

    response.data.forEach((word)=>{ // 받아온 데이터는 words라는 배열에 넣어주는데
      if (word.length < 10) { //forEach문으로 돌면서 10자리보다 작은 단어만 push해줌.
        words.push(word);
      }
    })
    buttonChange('게임시작') // 단어를 다 받아왔으면 게임시작으로 활성화해줌.
    //console.log(words);
    words = response.data; 
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

// 단어 일치 체크
function checkMatch() {
  if(wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()){ //toLowerCase뒤에 괄호를 빼먹으니, 한글자 입력할때마다 스코어가 올라가는 버그가 생김.
    wordInput.value = '';
    if(!isPlaying){
      return;  // 게임중이 아니면 score가 올라가지 않도록 리턴줘서 끝내버림
    }
    score++;
    scoreDisplay.innerText = score;
    time = GAME_TIME // 맞췄으면 시간 다시주기
    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.innerText = words[randomIndex]; 
  }
}





function countDown(){
  time > 0 ? time-- : isPlaying = false;
  if(!isPlaying){
    clearInterval(timeInterval) // 인터벌이 게속 돌아이고 있기 떄문에, 끝내주는 것임.
  }
  timeDisplay.innerText = time;
}


function buttonChange(text){
  button.innerText = text;
  text === '게임시작' ? button.classList.remove('loading') : button.classList.add('loading'); // loading 앞에 .을 붙이면 정상작동이 안됨.
}


// function checkMatch () {
//   console.log(wordInput.value);
//   if(wordDisplay.innerText === wordInput.value){
//         score++
//   }
// }