const BLACKJACK_HIGH_SCORE = 21

const blackjackDeck = getDeck();

/**
 * Represents a card player (including dealer).
 * @constructor
 * @param {string} name - The name of the player
 */
class CardPlayer {
    constructor(name) {
        this.name = name;
    }
    hand = []
    drawCard() {
        const randomCard = deck[Math.floor(Math.random() * 52)]
        //const randomCard = deck[0] // For testing Ace card value logic
        this.hand.push(randomCard)
        console.log(`${this.name} draw card displayVal: ${randomCard.displayVal}`);
        console.log(`${this.name} draw card val: ${randomCard.val}`);
        document.write(`</br>${this.name} draw card displayVal: ${randomCard.displayVal}`);
        document.write(`</br>${this.name} draw card val: ${randomCard.val}\n`);
    }
};

// // CREATE TWO NEW CardPlayers
const dealer = new CardPlayer('Player');
const player = new CardPlayer('Dealer');

/**
 * Calculates the score of a Blackjack hand
 * @param {Array} hand - Array of card objects with val, displayVal, suit properties
 * @returns {Object} blackJackScore
 * @returns {number} blackJackScore.total
 * @returns {boolean} blackJackScore.isSoft
 */
const calcPoints = (hand) => {
    const calcPointsObj = {
        total: '',
        isSoft: false
    };  

    let total = 0;
    for (let i = 0; i < hand.length; i++) {
        // Additional logic for Ace card
        if (hand[i].displayVal === 'Ace') {
            // By default, Ace card face value is 11, so, set 'isSoft' to 'true'
            calcPointsObj.isSoft = true;

            // If the total score is (with Ace card face value 11) exceeding 21,
            // then, set Ace card face value to 1
            // also set 'isSoft' to 'false'
            if ((total + hand[i].val) > BLACKJACK_HIGH_SCORE) {
                hand[i].val = 1; // set Ace value to 1
                calcPointsObj.isSoft = false; // set flag to false
                console.log('With the drawn Ace card, Total score can exceed 21, So, will cout Ace as 1');
                document.write(`</br>With the drawn Ace card, Total score can exceed 21, So, will cout Ace as 1`);
            }
        }

        // Otherwise, just add 'hand.val' value to the total
        // Above logic will determine if Ace card value need to be 1 (if not it will be counted as 11)
        total += hand[i].val; 
    }
    calcPointsObj.total = total;
    return calcPointsObj;
}

/**
 * Determines whether the dealer should draw another card.
 * 
 * @param {Array} dealerHand Array of card objects with val, displayVal, suit properties
 * @returns {boolean} whether dealer should draw another card
*/
const dealerShouldDraw = (dealerHand) => {
  let drawAnother = false; // default value to end dealer turn

  const totalScore = calcPoints(dealerHand);

  // if the dealer's hand is 16 points or less, the dealer must draw another card
  if (totalScore.total <= 16) {
    drawAnother = true;
    // If the dealer's hand is exactly 17 points, and the dealer has an Ace valued at 11, then dealer must draw another card
  } else if ((totalScore.total === 17) && (totalScore.isSoft === true)) {
    drawAnother = true;
  } else if (totalScore.total >= 17) {
    drawAnother = false;
  } else {
    drawAnother = false; // default value to end dealer turn
  }

  return drawAnother;
}

/**
 * Determines the winner if both player and dealer stand
 * @param {number} playerScore 
 * @param {number} dealerScore 
 * @returns {string} Shows the player's score, the dealer's score, and who wins
 */
const determineWinner = (playerScore, dealerScore) => {
    let result = ''
    if (playerScore === dealerScore) {
        result = 'Play is a tie, nobody won'
    } else if (playerScore > dealerScore) {
        result = 'Player won'
    } else {
        result = 'Dealer won'
    }
    console.log(`Player score: ${playerScore}, Dealer Score: ${dealerScore}, and the result is: ${result}`);
    document.write(`</br>Player score: ${playerScore}, Dealer Score: ${dealerScore}, and the result is: ${result}`);
}

/**
 * Creates user prompt to ask if they'd like to draw a card
 * @param {number} count 
 * @param {string} dealerCard 
 */
const getMessage = (count, dealerCard) => {
  return `Dealer showing ${dealerCard.displayVal}, your count is ${count}.  Draw card?`
}

/**
 * Logs the player's hand to the console
 * @param {CardPlayer} player 
 */
const showHand = (player) => {
  const displayHand = player.hand.map((card) => card.displayVal);
  console.log(`${player.name}'s hand is ${displayHand.join(', ')} (${calcPoints(player.hand).total})`);
  document.write(`</br>${player.name}'s hand is ${displayHand.join(', ')} (${calcPoints(player.hand).total})`);
}

/**
 * Runs Blackjack Game
 */
const startGame = function() {
  player.drawCard();
  dealer.drawCard();
  player.drawCard();
  dealer.drawCard();

  let playerScore = calcPoints(player.hand).total;
  // If the player got exactly 21 after the first 2 cards,
  // Declare that player won, and return
  if (playerScore === BLACKJACK_HIGH_SCORE) {
    console.log('Player score after the first two draws: ', playerScore);
    document.write('</br>Player score after the first two draws: ', playerScore);
    document.write('</br>Player got exactly 21 after the first 2 draws - player win!');

    return 'Player got exactly 21 after the first 2 draws - player win!';
  }

  // Now check if dealter got 21 after the first two draws
  const dealerScoreAfterTwoDraws = calcPoints(dealer.hand).total;
  if (dealerScoreAfterTwoDraws === BLACKJACK_HIGH_SCORE) {
    console.log('Dealer score after the first two draws: ', dealerScoreAfterTwoDraws);
    document.write('</br>Dealer score after the first two draws: ', dealerScoreAfterTwoDraws);
    document.write('</br>Dealer got exactly 21 after the first 2 draws - dealer win!');

    return 'Dealer got exactly 21 after the first 2 draws - dealer win!';
  }

  showHand(player);
  while (playerScore < 21 && confirm(getMessage(playerScore, dealer.hand[0]))) {
    player.drawCard();
    playerScore = calcPoints(player.hand).total;
    showHand(player);
  }
  if (playerScore > 21) {
    document.write('</br>You went over 21 - you lose!');
    return 'You went over 21 - you lose!';
  }
  console.log(`Player stands at ${playerScore}`);
  document.write(`</br>Player stands at ${playerScore}`);

  let dealerScore = calcPoints(dealer.hand).total;
  while (dealerScore < 21 && dealerShouldDraw(dealer.hand)) {
    dealer.drawCard();
    dealerScore = calcPoints(dealer.hand).total;
    showHand(dealer);
  }
  if (dealerScore > 21) {
    document.write('</br>Dealer went over 21 - you win!');
    return 'Dealer went over 21 - you win!';
  }
  console.log(`Dealer stands at ${dealerScore}`);
  document.write(`</br>Dealer stands at ${dealerScore}`);

  return determineWinner(playerScore, dealerScore);
}
console.log(startGame());