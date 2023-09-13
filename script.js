/*Javascript for Game of Set */
/* This section is for declaring all the needed variables */
let players = [];
let playerInitialized = [false, false, false, false, false]; //0-3 is Human Player, 4 is CPU player
let canCallSet = false;
let canSelectCards = false;
let selectedCards = [];
let selectedCardsHtml = [];
let setCalledMessageDiv;
let playerIndexWhoCalledSet = -1;
let currentSetFound = [];
let indexOfHintCard = -1;
let currentTimeMin = 10;
let currentTimeSec = 5;
let turnTime = 10;
let turnTimer = null;
// These variable is for ANN - we trained this ANN with 60% of accuracy!
let weights = [0.8853351439282144, 0.8113702608873162, 0.7811270303958303];
let bias = 0.38600826335538263;

/** 
 * Section for player object 
 * @param {*} playerName name of the player instance object
*/
function Player(playerName) {
  this.Name = playerName;
  this.Score = 0;
}

/**
 * Section for event listeners to trigger game functions  
 * */
// Outputs message on webpage who called a set and for them to pick their cards, if they pressed their call set button
document.addEventListener("keyup", function (event) {
  if (event.code === "KeyA" && canCallSet) {
    playerIndexWhoCalledSet = 0;
    setCalledMessageDiv.textContent =
      players[playerIndexWhoCalledSet].Name + " called a set. Pick your cards!";
    createTurnTimer();
    deactivatePlayerBtns();
    disableHintButton();
    activateClickableCards();
  }
  if (event.code === "KeyF" && canCallSet && playerInitialized[1]) {
    playerIndexWhoCalledSet = 1;
    setCalledMessageDiv.textContent =
      players[playerIndexWhoCalledSet].Name + " called a set. Pick your cards!";
    createTurnTimer();
    deactivatePlayerBtns();
    disableHintButton();
    activateClickableCards();
  }
  if (event.code === "KeyH" && canCallSet && playerInitialized[2]) {
    playerIndexWhoCalledSet = 2;
    setCalledMessageDiv.textContent =
      players[playerIndexWhoCalledSet].Name + " called a set. Pick your cards!";
    createTurnTimer();
    deactivatePlayerBtns();
    disableHintButton();
    activateClickableCards();
  }
  if (event.code === "KeyL" && canCallSet && playerInitialized[3]) {
    playerIndexWhoCalledSet = 3;
    setCalledMessageDiv.textContent =
      players[playerIndexWhoCalledSet].Name + " called a set. Pick your cards!";
    createTurnTimer();
    deactivatePlayerBtns();
    disableHintButton();
    activateClickableCards();
  }
});

/**
 * Event Listener for displaying messages on screen
 */
document.addEventListener("DOMContentLoaded", function () {
  setCalledMessageDiv = document.getElementById("setCalledMessage");
});

/* ----- SECTION FOR START GAME/PREGAME FUNCTIONS ----- 
      This section contains functions used to start the game, 
      started by the function startGame, which uses all the functions following it in this section. */

/**
 * startGame: master function for handling all start of game functions.
 * @ensures game starts correctly
*/
function startGame() {
  let numPlayers = getNumOfPlayers();
  addPlayers(numPlayers);
  promptAIPlayer();
  displayScoreBoard();
  let cardDeck = createDeck();
  let timer = createTimer();
  cardDeck.present12Cards();
  putCardDeck();
  findSetOnBoard();
  if (currentSetFound.length == 0) {
    reshuffleUntilSetFound();
  }
  activatePlayerBtns();
  enableHintButton();
  makeClickableCards();
  timer = stopTimer(timer);
  document.getElementById("turn-timer").hidden = true;
}

/** 
 * getNumOfPlayers(): a function for getting number of players from user
 * @returns int - number of players
 */
function getNumOfPlayers() {
  let numPlayers = prompt("Enter the number of players (1-4):");
  // Ensure a valid number of players is entered
  while (numPlayers < 1 || numPlayers > 4 || isNaN(numPlayers)) {
    numPlayers = prompt(
      "Invalid input. Please enter a number of players between 1 and 4:"
    );
  }
  return numPlayers;
}

/**  
 * addPlayers(numPlayers): function for getting player names and adding to Players array 
 * @param {*} numPlayers  number of players to put into array 
 * @ensures players.length = numPlayers
*/
function addPlayers(numPlayers) {
  for (let i = 0; i < numPlayers; i++) {
    let playerName = prompt(`Enter the name for player ${i + 1}:`);
    players.push(new Player(playerName));
    playerInitialized[i] = true;
  }
}

/**
 * Prompts human player whether or not to have an AI player to play against with
 */
function promptAIPlayer() {
  if (confirm('Do you want to add an AI player to play against?')) {
    players.push(new Player('AI Player'));
    playerInitialized[4] = true;
  }
}

/** 
 * createDeck: function for creating the deck and shuffling it 
 * @returns shuffled deck of 81 cards
*/
function createDeck() {
  cardDeck = new cardStack();
  cardDeck.shuffle();
  return cardDeck;
}

/* ----- SECTION FOR LIVE GAMEPLAY FUNCTIONS ------ 
          This section contains functions used for functionality during a live game */

/** 
* displayScoreBoard(): function for creating a scoreboard object and loading it with the player names 
* @ensures scoreboard.length = numPlayers 
*/
function displayScoreBoard() {
  document.getElementById("scores").innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    document.getElementById("scores").innerHTML += players[i].Name + "'s score: " + players[i].Score + "<br>";
  }
}

/** 
 * displayKeyInstruction(): a function for displaying to the players which key they need to press in order to call "Set" 
 * @ensures playerInstructions.length = numPlayers
*/
function displayKeyInstruction() {
  let keyToPress = ["A!", "F!", "H!", "L!"];
  document.getElementById("toCallSet").innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    if (!(playerInitialized[4] && i == players.length - 1)) {
      document.getElementById("toCallSet").innerHTML += players[i].Name + ": Press " + keyToPress[i] + "<br>";
    }
    else document.getElementById("toCallSet").innerHTML += "AI player randomly grab 3 cards every second<br>";
  }

}

/** 
 * removeKeyInstruction(): a function to temporarily hide instructions regarding key(s) that can be pressed to call "Set" 
 * @ensures onscreen messaging updates
*/
function removeKeyInstruction() {
  document.getElementById("toCallSet").innerHTML = "Set call in progress...";
}

/**
 * disableHintButton(): a function to temporarily disable the hint button (while set call is in progress) 
 * @ensures hintbutton cannot be used during set call
*/
function disableHintButton() {
  document.getElementById("hintbutton").setAttribute("disabled", "disabled");
  document.getElementById("hintbutton").style.cursor = "no-drop";
  document.getElementById("hintbutton").style.backgroundColor = "#666";
  document.getElementById("hintbutton").style.boxShadow = "0px 0px 0px 0px #666";
}

/**
 * enableHintButton(): a function to re-enable the hint button (after set call is completed) 
 * @ensures hintbutton can be used again
*/
function enableHintButton() {
  document.getElementById("hintbutton").removeAttribute("disabled");
  document.getElementById("hintbutton").style.cursor = "pointer";
  document.getElementById("hintbutton").style.backgroundColor = "#008000";
  document.getElementById("hintbutton").style.color = "#FFFAF2";
  document.getElementById("hintbutton").style.boxShadow = "0px 0px 5px 5px rgb(0, 0, 0)";
}

/** 
 * createTimer(): function for creating a timer object 
 * @instance creates a timer
*/
function createTimer() {
  return setInterval(() => {
    if (currentTimeSec <= 0) {
      currentTimeSec = 60;
      currentTimeMin--;
    }
    currentTimeSec--;
    document.getElementById("current-min").innerHTML = currentTimeMin;
    document.getElementById("current-sec").innerHTML = currentTimeSec;
    if (playerInitialized[4] && canCallSet && currentTimeSec % 1 == 0) {
      aiAction();
    }
  }, 1000);
}

/** 
 * stopTimer(timer): a function for setting up when the game timer ends (after 10min) 
 * @param {*} timer the timer to be stopped
 * @returns setTimeout function to trigger the end of the game
*/
function stopTimer(timer) {
  return setTimeout(() => {
    clearInterval(timer);
    alert('End of Game');
    endGameScoreBoard();
  }, (currentTimeMin * 60 + currentTimeSec ) * 1000); //convert min to millisecond
}

/** 
 * findSetOnBoard(): function for finding at least one set on the board. It will store copies 
 * of the 3 cards it finds or an empty set if no set found 
 * @ensures if set is on board, stored to array
*/
function findSetOnBoard() {
  indexOfHintCard = -1;
  currentSetFound = [];
  for (let i = 0; i < cardDeck.cardPresenting.length; i++) {
    for (let j = 0; j < cardDeck.cardPresenting.length; j++) {
      for (let k = 0; k < cardDeck.cardPresenting.length; k++) {
        let cardCandidate1 = cardDeck.cardPresenting[i];
        let cardCandidate2 = cardDeck.cardPresenting[j];
        let cardCandidate3 = cardDeck.cardPresenting[k];
        if (
          cardCandidate1 != cardCandidate2 &&
          cardCandidate2 != cardCandidate3 &&
          cardCandidate1 != cardCandidate3 &&
          checkSet(cardCandidate1, cardCandidate2, cardCandidate3)
        ) {
          indexOfHintCard = k;
          currentSetFound.push(cardCandidate1);
          currentSetFound.push(cardCandidate2);
          currentSetFound.push(cardCandidate3);
          return true;
        }
      }
    }
  }
}

/** 
 * reshuffleUntilSetFound(): a function for guaranteeing there is a set on the board with 12 cards
 * @ensures setsOnBoard >= 1
*/
function reshuffleUntilSetFound() {
  while (currentSetFound.length == 0) {
    cardDeck.cardStack.push.apply(cardDeck.cardStack, cardDeck.cardPresenting);
    cardDeck.cardPresenting = [];
    cardDeck.shuffle();
    cardDeck.present12Cards();
    putCardDeck();
    findSetOnBoard();
  }
}

/** 
 * activatePlayerBtns() = function for activating the ability to call "Set!" for all players 
 * @ensures canCallSet = true
*/
function activatePlayerBtns() {
  canCallSet = true;
  displayKeyInstruction();

}

/** 
 * deactivatePlayerBtns() = function for deactivating the ability to call "Set!" for all players 
 * @ensures canCallSet = false
*/
function deactivatePlayerBtns() {
  canCallSet = false;
  removeKeyInstruction();
  removeHintCard();
}

/** 
 * activateClickableCards(): function to make the cards clickable once "Set!" has been called 
 * @ensures   canSelectCards = true
*/
function activateClickableCards() {
  canSelectCards = true;
}

/** 
 * deactivateClickableCards(): function to make the cards unclickable once "Set!" call has been checked 
 * @ensures canSelectCards = false
 * @ensures selectedCards.length = 0
*/
function deactivateClickableCards() {
  canSelectCards = false;
  for (let i = 0; i < selectedCardsHtml.length; i++) {
    selectedCardsHtml[i].classList.remove("selected");
  }
  selectedCardsHtml = [];
  selectedCards = [];
}

/** 
 * showHintCard(): function for hightlighting one card from the findSetOnBoard array when players request 
 * @ensures a set card is highlighted. 
*/
function showHintCard() {
  findSetOnBoard();
  if (indexOfHintCard > -1) {
    document.getElementById("card" + indexOfHintCard).classList.add("hintCard");
  }
}

/**
 * removeHintCard(): function to remove shading from hint card 
 * @ensures hintCard.display = disabled
*/
function removeHintCard() {
  document.getElementById("card" + indexOfHintCard).classList.remove("hintCard");
}

/** 
 * createTimer(): function for creating a timer object 
 * @instance creates a timer
*/
function createTurnTimer() {
  document.getElementById("turn-timer").hidden = false;
  turnTimer = setInterval(() => {
    turnTime--;
    document.getElementById("time-remaining").innerHTML = turnTime;
    if (turnTime == 0) {
      decreasePlayerScore(playerIndexWhoCalledSet);
      setCallFailure();
      stopTurnTimer();
    }
    if (canSelectCards == false) {
      stopTurnTimer();
      activatePlayerBtns();
      enableHintButton();
    }
  }, 1000);
}

/** 
 * stopTurnTimer(): a function that stops turn timer and resets it back to 10 seconds 
 * @ensures timer is stopped and reset for next turn
*/
function stopTurnTimer() {
  clearInterval(turnTimer);
  selectedCards = [];
  selectedCardsHtml = [];
  document.getElementById("turn-timer").hidden = true;
  turnTime = 10;
  document.getElementById("time-remaining").innerHTML = turnTime;
}

/** 
 * increaseScore(player): a function that increases a players score and pushes that update to the scoreboard 
 * @param {*} player the player whose score must be increased
*/
function increaseScore(player) {
  players[player].Score = players[player].Score + 1;
  displayScoreBoard();
}

/** 
 * decreasePlayerScore(player): a function that decreases a player score if it is more than zero and pushes that update to the scoreboard 
 * @param {*} player player whose score must be decreased
*/
function decreasePlayerScore(player) {
  if (players[player].Score > 0) {
    players[player].Score = players[player].Score - 1;
  }
  displayScoreBoard();
}

/** 
 * deal3Cards: a function for finding the 3 blank spaces on the board and dealing a card to each. 
 * @ensures cardsOnBoard = 12
*/
function dealThreeCards() {
  cardDeck.replaceCards(selectedCards);
  putCardDeck();
}

/**
 * Present card into HTML - show MODEL on VIEW!
 * @ensures document.gameContainer -=- this.cardPresenting
 */
function putCardDeck() {
  var grid = document.getElementsByClassName("card-face")
  for (let i = 0; i < cardDeck.cardPresenting.length; i++) {
    var image_tag = '<img src="images/'.concat(cardDeck.cardPresenting[i].toString(), '.png">');
    grid[i].style.visibility = true;
    grid[i].innerHTML = image_tag;
  }
};

/**
 * Checks if the 3 cards are a set. 3 cards cannot be the same card of any pair, and they must meet following standards:
 * They must have SAME OR DIFFERENT Color AND
 * They must have SAME OR DIFFERENT Shape AND
 * They must have SAME OR DIFFERENT Shade AND
 * They must have SAME OR DIFFERENT Number
 * 
 * @param {*} card1 Card candidate 1
 * @param {*} card2 Card candidate 2
 * @param {*} card3 Card candidate 3
 * @returns true if they are set, false otherwise
 */
function checkSet(card1, card2, card3) {
  result =
    (card1.color == card2.color) &&
    (card2.color == card3.color) ||
    (card1.color != card2.color &&
      card2.color != card3.color &&
      card1.color != card3.color);
  result = result &&
    ((card1.shape == card2.shape && card2.shape == card3.shape) ||
      (card1.shape != card2.shape &&
        card2.shape != card3.shape &&
        card1.shape != card3.shape));
  result =
    result &&
    ((card1.shading == card2.shading && card2.shading == card3.shading) ||
      (card1.shading != card2.shading &&
        card2.shading != card3.shading &&
        card1.shading != card3.shading));
  result =
    result &&
    ((card1.number == card2.number && card2.number == card3.number) ||
      (card1.number != card2.number &&
        card2.number != card3.number &&
        card1.number != card3.number));
  return result;
};

/** 
 * setCallSuccessful(player): a master function for what happens when a player successfully identifies a set 
 */
function setCallSuccessful() {
  setCalledMessageDiv.textContent = "Set Found! +1 point for " + players[playerIndexWhoCalledSet].Name;
  increaseScore(playerIndexWhoCalledSet);
  displayScoreBoard();
  dealThreeCards();
  deactivateClickableCards();
  findSetOnBoard();
  if (currentSetFound.length == 0) {
    setCalledMessageDiv.textContent = "Set Found! +1 point for " + players[playerIndexWhoCalledSet].Name + ". Also reshuffled and dealt because of no set on board"
    reshuffleUntilSetFound();
  }
  activatePlayerBtns();
  enableHintButton();
}

/** 
 * setCallFailure(player): a master function for what happens when a player's selection is not a set 
 */
function setCallFailure() {
  if (turnTime == 0) {
    setCalledMessageDiv.textContent = "Ran out of time! -1 point for " + players[playerIndexWhoCalledSet].Name;
  } else {
    setCalledMessageDiv.textContent = "Not a set. -1 point for " + players[playerIndexWhoCalledSet].Name;
  }
  deactivateClickableCards();
  decreasePlayerScore(playerIndexWhoCalledSet);
  displayScoreBoard();
  activatePlayerBtns();
  enableHintButton();
}

/**
 * EvLstnr for selecting cards
 */
function makeClickableCards() {
  let cards = Array.from(document.getElementsByClassName("card"));

  cards.forEach(card => {
    card.addEventListener("click", function () {
      if (canSelectCards && selectedCardsHtml.length < 3) {
        if (card.classList.contains('selected')) {
          card.classList.remove('selected');
          selectedCards.pop(cardDeck.cardPresenting[Number(card.id.replace("card", ""))]);
          selectedCardsHtml.splice(selectedCardsHtml.indexOf(card), 1);
        } else {
          card.classList.add('selected');
          selectedCards.push(cardDeck.cardPresenting[Number(card.id.replace("card", ""))]);
          selectedCardsHtml.push(card);
        }

        if (selectedCards.length === 3) {
          if (checkSet(selectedCards[0], selectedCards[1], selectedCards[2])) {
            setCallSuccessful();
          } else {
            setCallFailure();
          }
        }
      }
    })
  });
};

/** 
 * startGameButton(): a function for displaying the start menu and launching the game upon clicking "Start Game".
 */
function startGameButton() {
  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gamePage').style.display = 'block';
  startGame();
};

/** 
 * generateTableHead(table, data): a function for generating end game results. This generates the table header. 
 */
function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
};

/** 
 * generateTable(table, data): a function for generating end game results. This generates the actual table. 
 */
function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
};

/** 
 * endGameScoreBoard(): a master function to display the winner of the game after 10 minutes 
 */
function endGameScoreBoard() {
  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gamePage').style.display = 'none';
  document.getElementById('scorePage').style.display = 'block';

  let table = document.querySelector("table");
  let data = Object.keys(players[0]);
  players.sort(function (a, b) {
    var keyA = a.Score,
      keyB = b.Score;
    // Compare the 2 dates
    if (keyA > keyB) return -1;
    if (keyA < keyB) return 1;
    return 0;
  });

  const maxScore = Math.max(...players.map(players => players.Score));
  const playersWithMaxScore = players.filter(players => players.Score === maxScore);
  const playerNames = playersWithMaxScore.map(players => players.Name);

  generateTableHead(table, data);
  generateTable(table, players);

  if (playersWithMaxScore.length == 1) {
    alert(playersWithMaxScore[0].Name.concat(' is the winner. Congratulations!!'));
  } else {
    let endMessage = playerNames.slice(0, -1).join(', ') + ' and ' + playerNames.slice(-1);
    alert(endMessage.concat(' tied for 1st!'));
  };
}

/* This section is for ANN */

/**
 * Helper function: return the value of Sigmoid(x)
 * @param {*} x the input value
 * @returns Sigmoid of x range from 0 to 1
 */
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
};

/**
 * Forward propagate of pre-trained ANN to guess if these 3 cards are a set
 * @param {*} card1 Candidate card 1
 * @param {*} card2 Candidate card 2
 * @param {*} card3 Candidate card 3
 * @returns True if ANN thinks this is a set, false otherwise. This has 61% of accuracy among 1080 sets of 50k+ card permutations
 */
function guessSet(card1, card2, card3) {
  let sum = 0;
  const inputs = [card1.toInt(), card2.toInt(), card3.toInt()];
  //const inputs = card1.toDoubleArray().concat(card2.toDoubleArray(), card3.toDoubleArray());
  inputs.sort(function (a, b) { return a - b });
  for (let i = 0; i < weights.length; i++) {
    sum += (inputs[i] + bias) * weights[i];
  }
  return sigmoid(sum) > 0.5;
};

/**
 * The AI's behavior of each time being called. It's tied to the timer function and then perform the game play
 */
function aiAction() {
  // Get 3 cards from card presenting. The random function results integer from 0 to 11
  // The first card is picked through a hint to avoid massive calculations
  card1 = currentSetFound[0];
  card2 = cardDeck.cardPresenting[Math.floor(Math.random() * (11 - 0 + 1))];
  //This ensures no duplicated cards are picked
  while (card2.toInt() == card1.toInt()) {
    card2 = cardDeck.cardPresenting[Math.floor(Math.random() * (11 - 0 + 1))];
  }
  card3 = cardDeck.cardPresenting[Math.floor(Math.random() * (11 - 0 + 1))];
  while (card3.toInt() == card1.toInt() || card3.toInt() == card2.toInt()) {
    card3 = cardDeck.cardPresenting[Math.floor(Math.random() * (11 - 0 + 1))];
  }
  if (guessSet(card1, card2, card3) && checkSet(card1, card2, card3)) {
    playerIndexWhoCalledSet = players.length - 1;
    setCalledMessageDiv.textContent = "AI found a SET! Better keep it up, humans!";
    increaseScore(playerIndexWhoCalledSet);
    displayScoreBoard();
    removeHintCard();
    selectedCards = [card1, card2, card3];
    dealThreeCards();
    deactivateClickableCards();
    findSetOnBoard();
    if (currentSetFound.length == 0) {
      setCalledMessageDiv.textContent = "AI found a SET! Better keep it up, humans! Also reshuffled and dealt because of no set on board"
      reshuffleUntilSetFound();
    }
    activatePlayerBtns();
    enableHintButton();
  }
};