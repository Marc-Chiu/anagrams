"use strict";
(function() {

  let pieceOnBoard = 0;
  const VOWELS = ["a", "e", "i", "o", "u"];
  const CONSTANANTS = ["b", "c", "d", "f", "g", "h", "j", "k",
  "l", "m", "n", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
  const SECOND = 1000;
  let remainingSeconds = 60;
  let timerId = "";
  let playerID = "";

  window.addEventListener("load", init);

  /**
   * main
   */
  function init() {
    loadHome();
    id("start-btn").addEventListener("click", startGame);
    id("entr-btn").addEventListener("click", checkWord);
    id("entr-btn").disabled = true;
    id("new-btn").addEventListener("click", newGame);
  }

  /**
   * checks if what the user entered is a word
   */
  function checkWord() {
    let word = "";
    let letters = id("board").getElementsByClassName("letter");
    for (let i = 0; i < letters.length; i++) {
      if (letters[i].classList.contains("letter")) {
        word += letters[i].alt;
      }
    }

    let params = new FormData();

    // Add the various parameters to the FormData object
    params.append("word", word.toLowerCase());
    params.append("player_id", playerID);
    fetch("/word", {method: "POST", body: params})
      .then(checkStatus)
      .then(resp => resp.json()) // or this if your data comes in JSON
      .then(updateBoard)
      .catch(handleError);
  }

  /**
   * console logs error
   * @param {err} resp response error
   */
  function handleError(resp) {
    console.log(resp);
  }

  /**
   * updates the score and words found and such
   * @param {json} responseData json response
   */
  function updateBoard(responseData) {
    id("response").textContent = responseData["response"];
    setTimeout(() => {
      id("response").innerHTML = "";
    }, 1500);

    if (responseData["isWord"]) {
      document.getElementsByClassName("score")[0].textContent = "Score: " + responseData["score"];
      document.getElementsByClassName("words")[0].textContent = "Words: " + responseData["words"];
    }

    let letters = id("board").querySelectorAll("img");
    for (let i = 0; i < letters.length; i++) {
      if (letters[i].classList.contains("letter")) {
        removeLetter(letters[i]);
      }
    }
  }

  /**
   * loads home images
   */
  function loadHome() {
    for (let i = 0; i < 7; i++) {
      let image = document.createElement("img");
      image.classList.add("home-piece");
      image.alt = "piece";
      image.src = "img/home.png";
      image.width = 75;
      image.height = 75;
      id("home-pieces").appendChild(image);
    }
  }

  /**
   * starts the game
   */
  function startGame() {
    id("home-view").classList.add("disappear");
    id("game-view").classList.remove("disappear");
    startTimer();
    createBoard();
    fetch("start")
      .then(checkStatus)
      .then(resp => resp.json()) // or this if your data comes in JSON
      .then(function(response) {
        playerID = response["player_id"];
      })
      .catch(handleError);
  }

  /**
   * checks server status
   * @param {status} res response
   * @returns {err} returns an erro
   */
  async function checkStatus(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * creates the board and loads the images
   */
  function createBoard() {
    for (let i = 0; i < 7; i++) {
      let image = document.createElement("img");
      image.classList.add("board");
      image.alt = "board-slot";
      image.src = "img/board-piece.png";
      id("board").appendChild(image);

      let src = "";
      let letter = "";
      if (i % 2 !== 0) {
        letter = VOWELS[Math.floor(Math.random() * VOWELS.length)];
        src = "" + letter + ".png";
      } else {
        letter = CONSTANANTS[Math.floor(Math.random() * CONSTANANTS.length)];
        src = "" + letter + ".png";
      }
      let letterPiece = document.createElement("img");
      letterPiece.addEventListener("click", moveLetter);
      letterPiece.classList.add("letter");
      letterPiece.alt = letter;
      letterPiece.src = "img/" + src;
      id("curr-letters").appendChild(letterPiece);
    }
  }

  /**
   * moves a letter onto the board
   */
  function moveLetter() {
    pieceOnBoard++;
    id("entr-btn").disabled = false;
    let slot = document.querySelector("img[alt='board-slot']");
    slot.addEventListener("click", function() {
      removeLetter(this);
    });
    slot.src = this.src;
    slot.alt = this.alt;
    slot.classList.add("letter");
    slot.classList.remove("board");

    this.removeEventListener("click", moveLetter);
    this.src = "img/border.png";
    this.classList.add("border");
    this.classList.remove("letter");
  }

  /**
   * removes a letter from the board
   * @param {dom} elem dom element
   */
  function removeLetter(elem) {
    pieceOnBoard--;
    if (pieceOnBoard === 0) {
      id("entr-btn").disabled = true;
    }
    let container = id("curr-letters");
    let letters = container.querySelectorAll("img[alt=" + elem.alt + "]");
    let letter = letters[0];
    for (let i = 0; i < letters.length; i++) {
      if (letters[i].classList.contains("border")) {
        letter = letters[i];
      }
    }
    letter.addEventListener("click", moveLetter);
    letter.src = elem.src;
    letter.classList.remove("border");
    letter.classList.add("letter");

    elem.alt = "board-slot";
    elem.src = "/img/board-piece.png";
    elem.classList.remove("letter");
    elem.classList.add("board");
    elem.removeEventListener("click", function() {
      removeLetter(this);
    });
  }

  /**
   * starts the timer when the game starts
   */
  function startTimer() {
    timerId = setInterval(advanceTimer, SECOND);
    displayTime();
    remainingSeconds -= 1;
  }

  /**
   * displays the time left
   */
  function displayTime() {
    if (remainingSeconds === 60) {
      id("time").textContent = "1:00";
    } else if (remainingSeconds >= 10) {
      id("time").textContent = "" + remainingSeconds;
    } else {
      id("time").textContent = "0" + remainingSeconds;
    }
  }

  /**
   * decrements the game timer by one second
   */
  function advanceTimer() {
    if (remainingSeconds === 0) {
      displayTime();
      stopGame();
      clearTimeout(timerId);
    } else {
      displayTime();
      remainingSeconds -= 1;
    }
  }

  /**
   * stops the game when the timer runs out
   */
  function stopGame() {
    id("game-view").classList.add("disappear");
    id("results").classList.remove("disappear");
    id("board").innerHTML = "";
    pieceOnBoard = 0;
    id("entr-btn").disabled = true;
    id("curr-letters").innerHTML = "";
    let score = document.getElementsByClassName("score")[0].textContent;
    let words = document.getElementsByClassName("words")[0].textContent;
    document.getElementsByClassName("score")[1].textContent = score;
    document.getElementsByClassName("words")[1].textContent = words;
    score = "Score: ";
    words = "Words: ";
    fetch("/end/" + playerID)
      .then(checkStatus)
      .then(resp => resp.json()) // or this if your data comes in JSON
      .then(loadWords)
      .catch(handleError);
  }

  /**
   * loads words found at the end of the game
   * @param {json} responseData the reponsedata
   */
  function loadWords(responseData) {
    for (let key in responseData) {
      let word = document.createElement("p");
      word.textContent = key;
      word.classList.add("word-found");
      id("words-found").appendChild(word);
    }
  }

  /**
   * starts a new game
   */
  function newGame() {
    id("results").classList.add("disappear");
    id("game-view").classList.remove("disappear");
    id("words-found").innerHTML = "";
    let score = document.getElementsByClassName("score")[0];
    let words = document.getElementsByClassName("words")[0];
    score.textContent = "Score: ";
    words.textContent = "Words: ";
    remainingSeconds = 60;
    fetch("/start")
      .then(checkStatus)
      .then(resp => resp.json()) // or this if your data comes in JSON
      .then(function(response) {
        playerID = response["player_id"];
      })
      .catch(handleError);
    createBoard();
    startTimer();
  }

  /**
   * helper func
   * @param {string} id id of elem
   * @returns {dom} dom element
   */
  function id(id) {
    return document.getElementById(id);
  }

})();