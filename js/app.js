//calling the function to create the cards on load
document.body.onload = createCards;

let count = 0; //count of moves/card clicks
let matchCount = 0; //count of the matching cards
let starCount = 3; //count of the stars

let oneSecond = 1000; //one second as 1000miliseconds
let totalTime = 0; //total time taken
let timeInSecs; //total time in seconds
let timeMins; //time in mins
let timeSecs; //time in secs
let timeToDisplay; //time to display
let eleTimer; // the element to display time

let eleMoves; //the element which displays the count of user moves
let timeIntervalID; //the id returned by setInterval method

let setOpenCards = new Set(); //set of open cards
let setOpenCardsClass = new Set(); //set of class of the child element of open cards

//this function creates 2 cards with each symbols(by adding classes)
//call to the createNode function to create <li> element after shuffling the cards
function createCards() {
  let arrImg = ['fa-cube','fa-paper-plane-o','fa-bolt','fa-anchor','fa-leaf','fa-bicycle','fa-diamond','fa-bomb'];
  let arrCard = [];
  for(const img of arrImg){
    for(let i = 0 ; i < 2 ; i++){
      var  childI= document.createElement("i");
      childI.classList.add('fa',img);
      arrCard.push(childI);
    }
  }
  createLIElement(shuffle(arrCard));
}

// Shuffle function from http://stackoverflow.com/a/2450976
//shuffle the created cards
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

//this function creates <li> element with <i> child element
function createLIElement(array){
  let elementLi;
  let eleULParent= document.getElementsByClassName('deck')[0];
  for(const child of array){
    elementLi = document.createElement("li");
    elementLi.classList.add('card');
    elementLi.appendChild(child);
    eleULParent.append(elementLi);
  }
  addEvent();
}

//add event listeners to the cards
//setInterval to find the tital time taken
function addEvent(){
  const cards = document.querySelectorAll('.card'); //list of all cards
  for(const card of cards){
    card.addEventListener('click',cardClick);
  }
  let eleRestart = document.getElementsByClassName('fa-repeat')[0];
  eleRestart.addEventListener('click',restartGame);
  eleMoves = document.getElementsByClassName('moves')[0];
  timeIntervalID = setInterval(startTimer,oneSecond);
  eleTimer = document.getElementsByClassName('spanTimer')[0];
}

//this function updates time every second
//and display it to the game board
function startTimer(){
  totalTime = totalTime + oneSecond;
  timeInSecs = totalTime/1000;
  eleTimer.innerHTML = displayTime(timeInSecs);
}

//this function calculates time in mins n secs
function displayTime(time){
  timeMins = (time/60).toFixed(0);
  timeSecs = time % 60;
  timeToDisplay = timeMins + ' mins ' + timeSecs + ' seconds';
  return timeToDisplay;
}

//this function is called at card click event
//the if condition makes sure that the open card should not be selected again
function cardClick(event){
  let cardClicked = event.target;
  if(!((cardClicked.classList.contains('open')) ||
        (cardClicked.classList.contains('fa')) ||
        (cardClicked.classList.contains('match')))){
    addCount();
    showCard(event);
  }
}

//this function has a counter for the number of moves
//and displays it to the span element
function addCount(){
  ++count;
  eleMoves.innerHTML = count;
  checkCount();
}

//this function checks moves
function checkCount(){
  if((count === 20)||(count === 30)||(count === 40)){
    removeStar();
  }
}

//this function removes star at 10,20 and 30 moves
function removeStar(){
  let eleIStar = document.getElementsByClassName('fa-star')[0];
  if(typeof eleIStar !== 'undefined'){
    eleIStar.remove();
    starCount--;
  }
}

//this function turns the card and show the symbol at user's click
function showCard(event){
  let cardClicked = event.target;
  cardClicked.classList.add('open','show');
  openCards(cardClicked);
}

//this function checks if there is already any card in the Set
//then checks if the cards match by the className of the child element
//if there is a match it adds the card to the Set and calls cardsMatch function
//if there is no match still it adds the card to the Set and calls cardsMismatch function
//if the Set is empty it adds the cards and child class name to respective Sets
function openCards(cardOpen){
  let cardCls = cardOpen.firstElementChild.className;
  if(setOpenCards.size == 1){
    //the set has one card
    if(setOpenCardsClass.has(cardCls)){
      setOpenCards.add(cardOpen);
      cardsMatch(setOpenCards);
    }else{
      setOpenCards.add(cardOpen);
      cardsMismatch(setOpenCards);
    }
  }else{ // the set is empty
    setOpenCards.add(cardOpen);
    setOpenCardsClass.add(cardCls);
  }
}

//this function adds counter to the match cards
//removes open and show classes from the card
//adds match class to the cards
//clears the Sets and calls gameWon function
function cardsMatch(setOpenCards){
  ++matchCount;
  let iterator = setOpenCards.values();
  for(let i = 0 ; i < setOpenCards.size ; i++){
    let card = iterator.next().value;
    card.classList.remove('open','show');
    card.classList.add('match');
  }
  setOpenCards.clear();
  setOpenCardsClass.clear();
  gameWon(matchCount);
}

//this function removes open and show class from the card
//after a time out of 500 ms
//clears the Sets
function cardsMismatch(setOpenCards){
  let iterator = setOpenCards.values();
  for(let i = 0 ; i < setOpenCards.size ; i++){
    let card = iterator.next().value;
    setTimeout(function delay(){
         card.classList.remove('open','show');
       },500);
  }
  setOpenCards.clear();
  setOpenCardsClass.clear();
}

//this function is called after every match
//after the count is 8 the game finishes
function gameWon(matchCounter){
  if(matchCounter === 8){
    let dialog = document.getElementById('gameDialog');
    addDialogStar(starCount);
    const eleDMoves = document.getElementsByClassName('dialogMoves')[0];
    const eleDTime = document.getElementsByClassName('timer')[0];
    eleDMoves.innerHTML = 'By ' + count + ' moves';
    eleDTime.innerHTML = 'And ' + displayTime(timeInSecs);
    dialog.showModal();
    clearInterval(timeIntervalID);
  }
}

//this function adds Stars to the dialog
function addDialogStar(totalStar){
  let elePDialog = document.getElementsByClassName('dialogStar')[0];
  let eleIStar;
  while(totalStar != 0){
    eleIStar = document.createElement("i");
    eleIStar.classList.add('fa','fa-star');
    elePDialog.appendChild(eleIStar);
    totalStar--;
  }
}

//this function is called when the user resets the game
//or plays again
//this reloads the page and reinitializes variables
//which are counters for moves,matching cards and time
function restartGame(){
  restartCard();
  restartTimer();
  restartCountsAndDialog();
  restartStar();
}

//this function makes the cards back to start
function restartCard(){
  const cards = document.querySelectorAll('.card'); //list of all cards
  for(const card of cards){
    card.classList.remove('match','open','show');
    card.classList.add('card');
  }
}

//this function adds stars back to the score panel
function restartStar(){
  let eleULParent = document.getElementsByClassName('stars')[0];
  for(let j = 0;j < eleULParent.children.length; j++){
    if(eleULParent.children[j].firstChild == null){
      eleI = document.createElement("i");
      eleI.classList.add('fa','fa-star');
      eleULParent.children[j].appendChild(eleI);
    }
  }
  starCount = 3;
}

//this function reinitializes the counts and
//updates the element related and close dialog
function restartCountsAndDialog(){
  count = 0;
  eleMoves.innerHTML = count;
  matchCount = 0;
  let dialog = document.getElementById('gameDialog');
  dialog.close();
}

//this function stops the timer and restarts it
function restartTimer(){
  clearInterval(timeIntervalID);
  eleTimer.innerHTML = '';
  totalTime = 0;
  timeIntervalID = setInterval(startTimer,oneSecond);
}
