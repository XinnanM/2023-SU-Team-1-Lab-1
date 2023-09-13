
# THE GAME OF SET:
This is a web-based riff on the popular [game of Set](https://en.wikipedia.org/wiki/Set_(card_game)), where players look to macth 3 cards based on their attributes to score points.
This game is played on one local computer. It allows for 1-4 human player who are assigned their own unique key on the keyboard in order to call "Set". There is also an option to play against a computer player. 

## CARDS:
1. There are 81 unique cards. There is one of each for every permutation of the following attributes.
    a. **Shape on the card**: diamond, squiggle, or oval
    b. **The number of shapes on the card**: 1, 2, or 3
    c. **The color of the shape**: blue, yellow, or red
    d. **The fill of the shape**: empty, lined, or solid

## WHAT IS A "SET"?
1. A set is made by combining 3 cards based on their attributes. At least one attribute must be different between all 3 cards since there are no duplicate cards. The remaining 3 attributes must either all be the same or must all be uniquely different. Some examples of sets are listed below. 
    - 4 differing attributes: 1 empty blue diamond, 2 lined yellow squiggles, 3 empty red ovals.
    - 3 *differing* attributes, 1 **matching**: *1 empty* **blue** *diamond*, *2 lined* **blue** *squiggles*, *3 solid* **blue** *ovals*.
    - 2 *differing* attributes, 2 **matching**: *1 empty* **blue diamond**, *2 lined* **blue diamonds**, *3 solid* **blue diamonds**.
    - 1 *differing* attribute, 3 **matching**: *1* **solid red diamond**, *2* **solid red diamonds**, *3* **solid red diamonds**.

## RULES:
1. The deck is 81 unique cards with 4 attributes each: the shape on the card, how many of said shape, the color of the shape, and the fill of the shape.
2. Players are presented with 12 cards. They must make a set by choosing cards that match in an attribute or are all different in that attribute. 
3. Players must "buzz in" with their associated keyboard button in order to call "Set". 
4. The player who calls "Set" has 10 seconds to click the 3 cards they believe constitute a set. 
    a. A successful "Set" call rewards 1 point to the player.
    b. If the timer runs out or the set is not valid, the player will lose a point unless they are already at zero.
5. The game continues for 10 minutes. At the end of that 10 minute period, the player with the most points wins. 

## HOW TO RUN:
1. Clone the repository from GitHub or download all the source files as a ZIP file and extract to some place on your local machine.
2. Open "index.html" in your web browser of choice. 

## ASSUMPTIONS:
1. All human players are playing on one local machine.
2. All human players agree to use the hint button if no one can find a set or civilly agree to its use. 

## DIFFERENCES FROM ORIGINAL GAME:
1. Our game runs on a time of 10 minutes for a game of moderate length.
2. The 12 cards presented will always contain a set. If there is no set on the board, our game reshuffles all 81 cards and deals a new grid of 12 cards.

## FEATURES:
1. The hint button will highlight one card that can make a set. The players must identify the other two. For fairness, the hint button cannot be pressed after set is called. 
2. A customized deck is loaded for increased accessibility for people with color blindness. We eliminated red/green combos.
3. There's an option to play with an AI player. The human player(s) can decide whether or not they wish to have the AI join at the final stage of the start menu. 
    - The implementation of this AI is a pretrained neuron network with 3 inputs and 1 output. It works by getting 3 cards from the presenting cards and ringing in if it receives a viable set. The expected score of AI player is 6-15 points. It is possible to increase the iterations of AI action to increase AI difficulty, which the highest score so far is 100 points if iterates 10 times per second.

## Note to grader:
- If you don't want to play the full ten minutes, you can adjust when the game ends at line 239 in script.js at the end of the stopTimer(timer) function. 