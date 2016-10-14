//Array to hold deck of cards
/*
var arr = [];
var start_btn = document.getElementById("start_game");
var cardLink = document.getElementsByClassName('card');

//Global object for settings
var config = {
    noOfCards: 18,
    cardContent: ["Drama", "Art", "Business", "Catering", "ICT", "Maths", "Science", "German", "Product Design"],
    imagePath: "img/",
    imageFormat: ".png",
    noOfPairs: function() {
        return this.noOfCards % 2 == 0 ? this.noOfCards / 2 : console.log("Error: uneven number used");
    },
    arr: []
};



//Function to use as template for card objects created
function Card(name, image) {
  this.name = name;
  this.image = config.imagePath+image;
}

//Function to create cards and push into array - 'arr'
function createCards(deck, noOfPairs){
    var newCard;
    for ( var i = 0; i < noOfPairs; i++ ){
        newCard = new Card(config.cardContent[i],config.cardContent[i]+config.imageFormat);
        deck.push(newCard);
        deck.push(newCard);
    }
}

//Function to shuffle the deck
function shuffleDeck(set){ //v1.0
    for(var j, x, i = set.length; i; j = Math.floor(Math.random() * i), x = set[--i], set[i] = set[j], set[j] = x);
    return set;
};


//Function to compare two chosen cards
function compareCards(firstCard, secondCard){
    return firstCard === secondCard ? true : false;
};

function formatCards(card){
    //need to remove last two characters from string to get matching id names
    
};


//Function to deal out the cards into the DOM
function dealCards(deck){
    
    var mod = document.getElementById("firstrow"), fragment = document.createDocumentFragment();
    
    for (var i = 0; i < deck.length; i++){   
        mod = document.getElementById("firstrow");
        
        var contain = document.createElement('section');
        contain.className = "col-md-2 cardContainer";
        contain.innerHTML = '<div class="card"><div class="front"></div><div class="back"><h1 class="card__title">'+config.arr[i].name+'</h1><img class="card__img" src="img/'+config.arr[i].name+config.imageFormat+'"/></div></div>';
        
        fragment.appendChild(contain);
    }
    
    mod.appendChild(fragment);
}


function resetGame(){
 //empty array
 //reset counters and timers
}

var startGame = function(array, pairs){
        createCards(array, pairs);
        shuffleDeck(array);
        dealCards(array);
        applyLinks();
    //enable cards and timers/counters
};


//compareCards(config.arr[0].name, config.arr[1].name);


//console.log(config.arr);

//start_btn.attachEvent('onclick', startGame);
start_btn.addEventListener('click', function() {startGame(config.arr, config.noOfPairs());} , false);


  
  function applyLinks(){
      //var cardLink = document.getElementsByClassName('card');
      for(var i = 0; i < cardLink.length; i++){
          (function(i) {
              cardLink[i].addEventListener('click', function() {addLink(i);}, false);
        }(i));
       }  
  }

//function to add/remove the flipped class as required
function addLink(i){
    if(!cardLink[i].classList.contains("flipped")){
        cardLink[i].className += " flipped";
    }
    else{
        cardLink[i].className = "card";
    }
};*/


(function(){

    var startBtn = document.getElementById('js-game_selector'),
        gridContainer = document.getElementById('grid_container'),

        config = {

            levels: {
                "easy": {
                    "total": 8,
                    "time": 3
                },
                "medium": {
                    "total": 16,
                    "time": 5
                },
                "difficult": {
                    "total": 32,
                    "time": 6

                }
            },
            noOfPairs: {
                "total": null,
                "left": null
            },
            timer: 0,
            cardDesign: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"],
            deck: []
        };

    startBtn.addEventListener('click', initGame, false);

    function initGame(event){
        event.preventDefault();

        if( event.target.id == "js-start_game"){

            var selectedLevel = startBtn.elements["js-game_level"].value;

            config.noOfPairs.total = ( config.levels[selectedLevel].total ) / 2;

            createCards( config.deck, config.noOfPairs.total);


            startGame( config.levels[selectedLevel].time );

        }
    }


    //Function to use as template for card objects created
    function Card(name, design, id) {
        this.name = name;
        this.design = design;
        this.uniqueId = id;
    }




    function createCards(deck, noOfPairs){
        var newCard,
            i;

        for ( i = 0; i < noOfPairs; i++ ){
            newCard = new Card( config.cardDesign[i], config.cardDesign[i], config.cardDesign[i] );
            deck.push(newCard);
            deck.push(newCard);
        }
    }


    function startGame(selectedTime){

        //Disable start button
        //add Reset / restart button
        //Add timer, scoring etc.


        config.timer = selectedTime;

        console.log(config.deck);
    }


    function endGame(){}



})();

