(function(){

    var doc = document,
        startBtn = doc.getElementById('js-start_game'),
        gridContainer = doc.getElementById('js-grid_container'),
        titleScreen = doc.getElementById('js-title_screen'),
        timerContainer = doc.getElementById('js-timer'),

        config = {
            currentLevel: 1,
            noOfPairs: {
                "total": 0,
                "left": null
            },
            timer: 300,
            cardDesign: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"],
            deck: []
        },

        currentSelection = [];

    //Global Controls

    startBtn.addEventListener( 'click', initGame, false );


    function initGame(event){
        event.preventDefault();

            //Removes title screen from view
            titleScreen.classList.add('title_screen-active');

            setNoOfPairs();

            //createCards
            createCards( config.deck, config.noOfPairs.total );
            //shuffleDeck
            shuffleDeck( config.deck );
            //dealCards
            dealCards( config.deck, config.noOfPairs.total, gridContainer );
            //init timer
            createTimer();
            //init score



            //startGame

           // var selectedLevel = startBtn.elements["js-game_level"].value;
            //config.noOfPairs.total = config.noOfPairs.left = ( config.levels[selectedLevel].total ) / 2;


            /*console.log(config.noOfPairs.total);
            createCards( config.deck, config.noOfPairs.total );
            shuffleDeck( config.deck );
            dealCards( config.deck, config.noOfPairs.total, gridContainer );

            startGame( config.levels[selectedLevel].time );

            startBtn.removeEventListener('click', initGame, false);
            startBtn.addEventListener('click', resetGame, false);*/

    }

    function resetGame(event){
        event.preventDefault();
        console.log('reset');
    }


    function initNewLevel(){}



    //*****************************************************************************************************************
    //
    // Deck creation
    //
    //*****************************************************************************************************************


    function setNoOfPairs(){
        config.noOfPairs.total = config.currentLevel * 2;
    }


    //Function to use as template for card objects created
    function Card(name, design, id) {
        this.name = name;
        this.design = design;
        this.id = id;
    }


    //
    function createCards(deck, noOfPairs){
        var newCard,
            i;

        for ( i = 0; i < noOfPairs; i += 1 ){
            newCard = new Card( config.cardDesign[i], config.cardDesign[i], config.cardDesign[i] );
            deck.push(newCard);
            deck.push(newCard);
        }
    }

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    function shuffleDeck(array) {

        var i = array.length - 1,
            j,
            temp;

        for ( ; i > 0; i -= 1 ) {
            j = Math.floor( Math.random() * (i + 1) );
            temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }


    function clearDeck(){
        config.deck = [];
    }


    //*****************************************************************************************************************
    //
    // Setting up game grid
    //
    //*****************************************************************************************************************

    //Function to deal out the cards into the DOM
    function dealCards(deck, totalPairs, gridContainer ){

        var grid = gridContainer,
            i = 0,
            deckLength = deck.length,
            fragment = doc.createDocumentFragment();

        for ( ; i < deckLength; i++ ){

            var newCard = doc.createElement('div');
            newCard.dataset.value = deck[i].id;

            switch( totalPairs ){
                case 4:
                    newCard.className = "card card_width-1_4";
                    break;
                case 8:
                    newCard.className = "card card_width-1_4";
                    break;
                case 16:
                    newCard.className = "card card_width-1_8";
                    break;
                default:
                    newCard.className = "card";
            }

            newCard.innerHTML += '<div class="front"></div>';
            newCard.innerHTML += '<div class="back '+deck[i].name+'"><h1 class="card__title">'+deck[i].name+'</h1></div>';

            fragment.appendChild(newCard);

        } //End for loop

        grid.appendChild(fragment);
    }



    //*****************************************************************************************************************
    //
    // Timer Functions
    //
    //*****************************************************************************************************************

    function createTimer(){
        var fragment = document.createDocumentFragment(),
            timer = setTimer( config.timer );

        //Create minutes
        var minutes = doc.createElement('span');

        minutes.className = "minutes";
        minutes.id = "js-minutes";
        minutes.innerText = timer.minutes;

        //Create divider
        var divider = doc.createElement('span');

        divider.className = "divider";
        divider.innerText = ":";

        //Create seconds
        var seconds =  doc.createElement('span');

        seconds.className = "seconds";
        seconds.id = "js-seconds";
        seconds.innerText = timer.seconds < 10 ? "0" + timer.seconds : timer.seconds;



        fragment.appendChild( minutes );
        fragment.appendChild( divider );
        fragment.appendChild( seconds );

        timerContainer.appendChild( fragment );

    }


    function setTimer( duration ){

        var seconds =  duration % 60,
            minutes = ( duration - seconds ) / 60;

        return {
            seconds: seconds,
            minutes: minutes
        }
    }

    function startTimer(){}
    function stopTimer(){}

    function addTime(){}




    //Gameplay


    function cardSelect( event ){

        event.preventDefault();
        toggleSelection( event.currentTarget );

    }


    function toggleSelection( card ){

        card.classList.toggle( "card-selected" );

        if( currentSelection.indexOf(card) !== -1 ){
            currentSelection.pop();
        } else{
            currentSelection.push( card );
        }

        //possible time delay needed before comparing to give cards change to flip around
        if( currentSelection.length === 2 ){
            gridContainer.addEventListener( 'click', blocker, true );
            cardCompare( currentSelection );
        }

    }


    function cardCompare( selection ){

        if( selection[0].dataset.value === selection[1].dataset.value ){
            currentSelection = [];
            config.noOfPairs.left -= 1;

            selection[0].classList.remove( "card-selected" );
            selection[1].classList.remove( "card-selected" );
            selection[0].classList.add( "card-completed" );
            selection[1].classList.add( "card-completed" );

            selection[0].removeEventListener('click', cardSelect, false);
            selection[1].removeEventListener('click', cardSelect, false);


            if( config.noOfPairs.left === 0 ){
                //END LEVEL
                console.log("LEVEL COMPLETE");
            } else{
                gridContainer.removeEventListener( 'click', blocker, true );
            }

        } else{
            currentSelection = [];
            gridContainer.removeEventListener( 'click', blocker, true );
            selection[0].classList.remove( "card-selected" );
            selection[1].classList.remove( "card-selected" );
        }



        //flip card
        //toggleClass(event.currentTarget, "card-selected");

        //currentSelection.push(event.currentTarget);

        //console.log(currentSelection);

        /*  Add selected card to array for comparison

            Check if two entries:
                   Yes: Put temporary eventlistener at top level which blocks others firing below.
                        Check if two card values are equal
                        if yes:
                            mark as completed with class / remove event listeners from those 2 cards,
                            reduce from pairs left,
                            check if any pairs left:
                                 no:
                                    go to complete screen,
                                    display congrats screen with finishing time(?)
                                    display play again button ( same as reset button functionality )
                                    remove all event listeners from cards
                               yes:
                                    clear array of current selection
                                    remove the temp event listener at top level

                        if No:
                           remove the selected classes from both cards
                           remove the temp event listener at top level
                           clear array of current selection

                  No:


        */



        //if(event.target.classList[0] === 'card'){
           // console.log( event.target );
           //console.log( event.target );
            //console.log( event.currentTarget.dataset.value );
           // event.stopPropagation();
        //}

    }

    function blocker(event){
        event.preventDefault();
        event.stopPropagation();
    }



    function startGame( selectedTime ){

        //Disable start button
        //add Reset / restart button
        //Add timer, scoring etc.


        var items = document.querySelectorAll(".card");

        for(var i = 0; i < items.length; i++ ) {
            items[i].addEventListener('click', cardSelect, false);
        }

        config.timer = selectedTime;

        //console.log(config.deck);
    }


    function endGame(){}



})();



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

