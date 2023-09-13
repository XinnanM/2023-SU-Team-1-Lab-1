/**Global variables for card creation. */
const COLORS = ["red", "yellow", "blue"];
const SHADINGS = ["empty", "lined", "solid"];
const SHAPES = ["squiggle", "diamond", "oval"];
const NUMBERS = [1, 2, 3];

/** 
 * Abstract Card object providing file name conversion
*/
class card {
  /**
   * Constructs card using params given
   * @param {*} color The color of this card: red, yellow, blue
   * @param {*} shading The shape of this card: empty, lined, solid
   * @param {*} shape The shape of this card: squiggle, diamond, oval
   * @param {*} number Number of shapes on this card: 1, 2, 3
   * @error The constructor will throw error if the input is not one of the possible input
   * @ensures this.color = Color, this.shading = Shading, this.shape = Shape, this.number = Number
   */
  constructor(color, shading, shape, number, value) {
    if (!COLORS.includes(color)) {
      throw new Error(`Invalid color: ${color}`);
    }
    if (!SHADINGS.includes(shading)) {
      throw new Error(`Invalid shading: ${shading}`);
    }
    if (!SHAPES.includes(shape)) {
      throw new Error(`Invalid shape: ${shape}`);
    }
    if (!NUMBERS.includes(number)) {
      throw new Error(`Invalid number: ${number}`);
    }

    this.color = color;
    this.shading = shading;
    this.shape = shape;
    this.number = number;
    this.intValue = value;
  }

  /**
   * The string representation of this card aligns with file name.
   * @returns String representation of this: color_shape_number_shading
   */
  toString() {
    return this.color + "_" + this.shape + "_" + this.number + "_" + this.shading;
  }

  /**
   * The int representation of this card's order being created
   * @returns Integer representation if this: order_of_creation
   */
  toInt() {
    return this.intValue;
  }
};

/**
 * Card stack abstract object contains 81 distinct cards to play SET game
 * @field this.cardStack is the Stack to contain 81 cards. FIFO
 * @field this.cardPresenting is the array of 12 cards currently presenting - MODEL of MVC
 * @ensures |this.cardStack| = 81 and this.cardStack has UNIQUE elements.
 */
class cardStack {

  /**
   * Constructor
   */
  constructor() {
    this.cardStack = [];
    this.cardPresenting = [];
    this.initializeCards();
  }

  /**
   * Construct the card stack without elegance.
   * @ensures |this.cardStack| = 81 and this.cardStack has UNIQUE elements.
   */
  initializeCards() {
    this.cardStack = []
    let val = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            this.cardStack.push(
              new card(COLORS[i], SHADINGS[j], SHAPES[k], NUMBERS[l], val)
            );
            val++;
          }
        }
      }
    }
  }

  /**
   * Shuffle the cardStack to make game fun!
   * @ensures this.cardStack has random order
   */
  shuffle() {
    let currentIndex = this.cardStack.length,
      randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [this.cardStack[currentIndex], this.cardStack[randomIndex]] = [
        this.cardStack[randomIndex],
        this.cardStack[currentIndex],
      ];
    }
  }

  /**
   * Adds a card into this.cardStack
   * @param {*} card new card to be added on
   * @asserts card is instance of card
   */
  addCard(card) {
    if (!(card instanceof card)) {
      throw new Error(
        "Invalid card type. Only instances of the Card class can be added."
      );
    }
    this.cardStack.push(card);
  }

  /**
   * Removes a card from this.cardStack
   * @param {*} card card to drop out
   * @asserts card is instance of card
   */
  removeCard(card) {
    const index = this.cardStack.indexOf(card);
    if (index == -1) {
      throw new Error("Card not found in the stack.");
    }
    this.cardStack.splice(index, 1);
  }

  /**
   * Adds 12 cards into presenting set for the game.
   * @ensures 0 <= |this.cardPresenting| <= 12 and |this.cardStack| = |$this.cardStack| - |this.cardPresenting|
   */
  present12Cards() {
    for (let i = 0; i < 12 && this.cardStack.length > 0; i++) {
      this.cardPresenting.push(this.cardStack.pop());
    }
  }

  /**
   * Adds 3 cards into presenting set for the game.
   * @ensures 0 <= |this.cardPresenting| <= 3 and |this.cardStack| = |$this.cardStack| - |this.cardPresenting|
   */
  present3MoreCards() {
    if (this.cardPresenting <= 12) {
      for (let i = 0; i < 3 && this.cardStack.length > 0; i++) {
        this.cardPresenting.push(this.cardStack.pop());
      }
    }
  }

  /**
   * Replace the cards in array with new cards when a SET has been called.
   * @param {*} selectedCards The set being card to re insert into this.cardStack
   * @ensures this.cardPresenting = $this.cardPresenting - selectedCards + 3 cards and |this.cardStack|+=3 and this.cardStack reshuffled
   */
  replaceCards(selectedCards) {
    for (let i = 0; i < selectedCards.length; i++) {
      if (this.cardPresenting.includes(selectedCards[i])) {
        const index = this.cardPresenting.indexOf(selectedCards[i]);
        if (index == -1) {
          throw new Error("Card not found in the stack.");
        }
        if (this.cardStack.length > 0) {
          this.cardStack.push(selectedCards[i]);
          this.shuffle();
          this.cardPresenting[index] = this.cardStack.pop();
        }
        else this.cardPresenting[index] = null;
      }
    }
  }
};
