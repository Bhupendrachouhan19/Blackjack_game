// Challenge-1: The Blackjack Game

//Here in the below line blackjackGame is an Object.
let blackjackGame = {   /* Here "you", "dealer", "cardsMap" are calleds Keys or properties or objects(for here) and "cards' is an array. */
    "you":  {"scoreSpan" : "#your-blackjack-result", "div" : "#your-box", "score" : 0}, /* This is a dictionary. A dictionary is a general-purpose data structure for storing a group of objects */
    "dealer":  {"scoreSpan" : "#dealer-blackjack-result", "div" : "#dealer-box", "score" : 0},
    "cards":  ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'K', 'Q'],
    "cardsMap":  {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'A': [1, 11], 'J': 10, 'K': 10, 'Q': 10},
    "wins" : 0, 
    "losses" : 0,
    "draws" : 0,
    "isStand" : false,
    "turnsOver" : false, 
};

const YOU = blackjackGame["you"]
const DEALER = blackjackGame["dealer"]

const hitSound = new Audio("static/sounds/whoosh.mp3")
const dealSound = new Audio("static/sounds/deal.mp3")
const winSound = new Audio("static/sounds/winner.mp3")
const lostSound = new Audio("static/sounds/lost.mp3")
const drewSound = new Audio("static/sounds/drew.mp3")

document.querySelector('#blackjack-hit-button').addEventListener("click", blackjackHit);

document.querySelector("#blackjack-deal-button").addEventListener("click", blackjackDeal);

document.querySelector("#blackjack-stand-button").addEventListener("click", dealerLogic);

// Below code is for limmiting the number of clicks of hit button.
// var clicked = 0;
// function blackjackHit(){
//     let cardImage = document.createElement("img");
//     cardImage.src = "static/images/Q.png";
//     document.querySelector(YOU["div"]).appendChild(cardImage);
//     clicked++;
    
//     if (clicked == 10)
//     document.getElementById("blackjack-hit-button").disabled=true;
// }


function blackjackHit(){
    if(blackjackGame["isStand"] === false){

        let card = randomCard();
        console.log(card);
        showCard(card, YOU);
        
        updateScore(card, YOU);
        showScore(YOU);
        console.log(YOU["score"]);
        
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer){
    if(activePlayer["score"] <= 21){    
        let cardImage = document.createElement("img");
        cardImage.src = `static/images/${card}.png`;   /* NOTE: alwars write string in between `` so that you can add variables or arguments by using ${someVar}*/
        document.querySelector(activePlayer["div"]).appendChild(cardImage);

        hitSound.play();
    }
}

// Code for click button.

function blackjackDeal(){

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // We can add this line of code to make the game, a double player game. Otherwise it does not make any sense to add this line.
    // showResult(computeWinner());
    // OR    
    // let winner = computeWinner();
    // showResult(winner);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////


    dealSound.play();
    if(blackjackGame["turnsOver"] ===  true){

        blackjackGame["isStand"] = false;

        let yourImages = document.querySelector("#your-box").querySelectorAll("img");
        console.log(yourImages);

        let dealerImages = document.querySelector("#dealer-box").querySelectorAll("img");
        console.log(dealerImages);

        for(let i=0; i<yourImages.length; i++){
            yourImages[i].remove("img");
        }

        for(let i=0; i<dealerImages.length; i++){
            dealerImages[i].remove("img");
        }

        YOU["score"] = 0;   
        DEALER["score"] = 0;   

        document.querySelector("#your-blackjack-result").textContent = 0;
        document.querySelector("#your-blackjack-result").style.color = "yellow";
        
        document.querySelector("#dealer-blackjack-result").textContent = 0;
        document.querySelector("#dealer-blackjack-result").style.color = "yellow";

        document.querySelector("#blackjack-result").textContent = "Let's Play";
        document.querySelector("#blackjack-result").style.color = "green";

        blackjackGame["turnsOver"] = true;
    }
} 

function updateScore(card, activePlayer){
    // If adding 11 keeps me below 21, then add 11, else add 1.
    if(card === "A"){   
        if((activePlayer["score"] + blackjackGame["cardsMap"][card][1])<=21){
        activePlayer["score"] += blackjackGame["cardsMap"][card][1];
        } 

        else{
            activePlayer["score"] += blackjackGame["cardsMap"][card][0];
        }
    }

    else{
        activePlayer["score"] += blackjackGame["cardsMap"][card];
    }
}

function showScore(activePlayer){
    if(activePlayer["score"] > 21){
        document.querySelector(activePlayer["scoreSpan"]).textContent = "!Busted!";
        document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
    }
    else{
        document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    
    blackjackGame["isStand"] = true;

    // while(DEALER["score"] < 16 && blackjackGame["isStand"] === true){
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    

    blackjackGame["turnsOver"] = true;
    let winner = computeWinner();
    showResult(winner); 
}

// Compute winner and return who just won.
// Update the wins, draws, and losses.

function computeWinner(){
    let winner;
    
    if (YOU["score"] <= 21){
        // Condition : higher score then dealer or when dealer busts but you're 2.
        if(YOU["score"] > DEALER["score"] || DEALER["score"] > 21){
            // console.log("You Won!"); 
            blackjackGame["wins"]++;
            winner = YOU;
            // document.querySelector("#blackjack-jack")
        }
        else if(YOU["score"] < DEALER["score"]){
            // console.log("You Lost!");
            blackjackGame["losses"]++;
            winner = DEALER;
        }
        else if(YOU["score"] === DEALER["score"]){
            // console.log("Game Tied!");
            blackjackGame["draws"]++;

        }
    }
    //Condition : When you bust but dealer does't.
    else if(YOU["score"] > 21 && DEALER["score"] <= 21){
        // console.log("...YOU LOST...");
        blackjackGame["losses"]++;
        winner = DEALER;
    }
    // Condition : When YOU and the DEALER both bust.
    else if(YOU["score"] > 21 && DEALER["score"] > 21){
        blackjackGame["draws"]++;
        console.log("...YOU DREW...");
    }

        
    console.log("Winner is" ,winner);
    console.log(blackjackGame);
    return winner;
}

function showResult(winner){
    let message, messageColor;

    if(blackjackGame["turnsOver"] === true){
        if(winner === YOU){
            document.querySelector("#wins").textContent = blackjackGame["wins"];
            message = "!You Win!";
            messageColor = "green";
            winSound.play();
        }
        else if(winner === DEALER){
            document.querySelector("#losses").textContent = blackjackGame["losses"];
            message = "!You Lost!";
            messageColor = "red";
            lostSound.play();
        }
        else{
            document.querySelector("#draws").textContent = blackjackGame["draws"];
            message = "!Game Drew!";
            messageColor = "brown";
            drewSound.play();
        }

        document.querySelector("#blackjack-result").textContent = message;
        document.querySelector("#blackjack-result").style.color = messageColor;
    }
}






























