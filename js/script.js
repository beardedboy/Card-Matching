"use strict";

(function(){

    var doc = document,
        startBtn = doc.getElementById('js-start_game'),
        gridContainer = doc.getElementById('js-grid_container'),
        titleScreen = doc.getElementById('js-title_screen'),

        gameTimer = {
            timer: null,
            container: doc.getElementById('js-timer'),
            totalTime: 60,
            minuteContainer: undefined,
            secondContainer: undefined
        },

        gameScore = {
            container: doc.getElementById('js-score'),
            total: 0
        },

        config = {
            currentLevel: 1,
            noOfPairs: {
                "total": 0,
                "left": null
            },
            cardDesign: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"],
            deck: []
        };

    var currentSelection = [];

    //Global Controls
    startBtn.addEventListener( 'click', initGame, false );


    function initGame(event){
        event.preventDefault();

        //Setting up deck of cards
        setNoOfPairs();
        createCards( config.deck, config.noOfPairs.total );
        shuffleDeck( config.deck );

        //initialise timer and score
        createTimer();
        setScore();

        //Deal the cards
        dealCards( config.deck, config.noOfPairs.total, gridContainer );

        //Removes title screen from view
        clearWelcomeScreen();

    }

    function resetGame(event){
        event.preventDefault();
        console.log('reset');
    }


    function initNewLevel(){

        //show intermission screen
        //Clear cards from screen and from config.noOfPairs

        clearDeck( gridContainer );
        pauseTimer( gameTimer.timer );

        config.currentLevel++;

        setNoOfPairs();
        createCards( config.deck, config.noOfPairs.total );
        shuffleDeck( config.deck );

        showLevelUpScreen();

        //Deal the cards
        dealCards( config.deck, config.noOfPairs.total, gridContainer );

    }

    function startNewLevel(){


        var items = document.querySelectorAll(".card");

        for(var i = 0; i < items.length; i++ ) {
            items[i].addEventListener('click', cardSelect, false);
        }

        gridContainer.removeEventListener( 'click', blocker, true );

        gameTimer.timer = startTimer();
    }


    //*****************************************************************************************************************
    //
    // Level screens
    //
    //*****************************************************************************************************************

    function clearWelcomeScreen(){
        var welcomeScreen = doc.getElementById("js-welcome_screen");
        //animate welcome screen going
        welcomeScreen.classList.add('welcome_screen-hidden');
        //clearScreen();
        setTimeout(function(){
            showReadyScreen(3, true, null, function(){
                titleScreen.removeChild(welcomeScreen);
                clearScreen();
                startGame();
            });
        }, 2000);
    }

    function showReadyScreen(count, start, el, callback){

        var readyScreen = el;
        //Add ready screen
        if( start ){
            var fragment = doc.createDocumentFragment(),
                ready = doc.createElement('div');

            ready.className = "ready_screen";
            ready.id = "js-ready_screen";
            fragment.appendChild( ready );
            titleScreen.appendChild( fragment );

            readyScreen = doc.getElementById("js-ready_screen");

        }

        setTimeout(function(){

            if( count > 0 ){
                readyScreen.innerHTML = count;
                showReadyScreen(count - 1, false, readyScreen, callback);
            } else if( count === 0 ){
                readyScreen.innerHTML = 'Go';
                showReadyScreen(count - 1, false, readyScreen, callback);
            } else{
                callback();
            }

        }, 1000);

    }




    function showLevelUpScreen(){
        showScreen();

        var fragment = doc.createDocumentFragment(),
            levelUp = doc.createElement('div');

        levelUp.className = "level_up_screen";
        levelUp.id = "js-levelup_screen";
        levelUp.innerHTML = "Level Up!";
        fragment.appendChild( levelUp );
        titleScreen.appendChild( fragment );

        setTimeout(function(){
            //Start the game!
            clearScreen();
            hideScreen();
            startNewLevel();
        }, 3000);

    }


    function showGameOverScreen(){
        showScreen();

        var fragment = doc.createDocumentFragment(),
            gameOver = doc.createElement('div');

        gameOver.className = "game_over_screen";
        gameOver.id = "js-game_over_screen";

        gameOver.innerHTML = "Game Over";

        gameOver.innerHTML += "You made it to level " + config.currentLevel;
        gameOver.innerHTML += "With a score of " + gameScore.total;


        fragment.appendChild( gameOver );
        titleScreen.appendChild( fragment );

    }

    function clearScreen(){
        titleScreen.innerHTML = "";
    }

    function hideScreen(){
        titleScreen.classList.add('title_screen-hidden');
    }

    function showScreen(){
        titleScreen.classList.remove('title_screen-hidden');
    }


    //*****************************************************************************************************************
    //
    // Deck creation
    //
    //*****************************************************************************************************************


    function setNoOfPairs(){
        config.noOfPairs.total = config.noOfPairs.left =  ( ( config.currentLevel * 2 ) + 2 ) / 2;
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


    function clearDeck( gridContainer ){
        config.deck = [];
        gridContainer.innerHTML = "";
    }


    //Function to deal out the cards into the DOM
    function dealCards(deck, totalPairs, gridContainer ){

        var grid = gridContainer,
            i = 0,
            deckLength = deck.length,
            fragment = doc.createDocumentFragment();

        for ( ; i < deckLength; i++ ){

            var newCard = doc.createElement('div');
            newCard.dataset.value = deck[i].id;

            newCard.className = "card";

            newCard.innerHTML += '<div class="front"></div>';
            newCard.innerHTML += '<div class="back '+deck[i].name+'"><h1 class="card__title">'+deck[i].name+'</h1></div>';

            newCard.addEventListener('click', cardSelect, false);

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
        var fragment = doc.createDocumentFragment(),
            time = setTimer( gameTimer.totalTime );

        gameTimer.currentMinute = time.minutes;
        gameTimer.currentSecond = time.seconds;

        //Create minutes
        var minutes = doc.createElement('span');

        minutes.className = "minutes";
        minutes.id = "js-minutes";
        minutes.innerText = gameTimer.currentMinute;

        //Create divider
        var divider = doc.createElement('span');

        divider.className = "divider";
        divider.innerText = ":";

        //Create seconds
        var seconds = doc.createElement('span');

        seconds.className = "seconds";
        seconds.id = "js-seconds";
        seconds.innerText = gameTimer.currentSecond < 10 ? "0" + gameTimer.currentSecond : gameTimer.currentSecond;


        fragment.appendChild( minutes );
        fragment.appendChild( divider );
        fragment.appendChild( seconds );

        gameTimer.container.appendChild( fragment );

        //Set global variables with newly created elements to be used later
        gameTimer.minuteContainer = minutes;
        gameTimer.secondContainer = seconds;

    }


    function setTimer( duration ){

        var seconds =  duration % 60,
            minutes = ( duration - seconds ) / 60;

        return {
            seconds: seconds,
            minutes: minutes
        }

    }

    function startTimer(){
        return setInterval( timerCountdown, 1000 );
    }

    function timerCountdown() {

        if (gameTimer.totalTime > 0) {

            gameTimer.totalTime--;
            var newTimes = setTimer( gameTimer.totalTime );

            gameTimer.minuteContainer.innerText = newTimes.minutes;
            gameTimer.secondContainer.innerText = newTimes.seconds < 10 ? "0" + newTimes.seconds : newTimes.seconds;

        } else {
            pauseTimer(gameTimer.timer);
            endGame();
        }

    }


    function pauseTimer(func){
        return clearInterval(func);
    }

    function addTime(value){
        gameTimer.totalTime = gameTimer.totalTime + value;
    }


    //*****************************************************************************************************************
    //
    // Score Functions
    //
    //*****************************************************************************************************************


    function setScore(){
        gameScore.container.innerText = formatScore( gameScore.total );
    }

    function formatScore(value){
       if( value < 10 ) {
           return '0000' + value
       } else if( value < 100 ) {
           return '000' + value
       } else if( value < 1000 ) {
           return '00' + value
       } else if( value < 10000 ) {
           return '0' + value
       } else{ return value }
    }

    function addScore(value){
        gameScore.total = gameScore.total + value;
        setScore();
    }

    function removeScore(value){
        gameScore.total = gameScore.total - value;
        setScore();
    }




    //*****************************************************************************************************************
    //
    // Gameplay
    //
    //*****************************************************************************************************************


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

            addScore(10);
            addTime(10);


            if( config.noOfPairs.left === 0 ){
                //END LEVEL
                initNewLevel();
                console.log("LEVEL COMPLETE");
            } else{
                gridContainer.removeEventListener( 'click', blocker, true );
            }

        } else{
            currentSelection = [];
            selection[0].classList.remove( "card-selected" );
            selection[1].classList.remove( "card-selected" );
            gridContainer.removeEventListener( 'click', blocker, true );
        }

    }


    function blocker(event){
        event.preventDefault();
        event.stopPropagation();
    }



    function startGame(){

        hideScreen();
        //start timer
        gameTimer.timer = startTimer();

    }


    function endGame(){
        //Remove event listener for cards
        gridContainer.addEventListener( 'click', blocker, true );
        showGameOverScreen();
    }



})();

