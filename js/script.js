"use strict";

(() => {
    const doc = document,
        startBtn = doc.getElementById('js-start_game'),
        gridContainer = doc.getElementById('js-grid_container'),
        titleScreen = doc.getElementById('js-title_screen'),

        gamePlay = {
          timesPlayed: 0
        },

        gameTimer = {
            timer: null,
            container: doc.getElementById('js-timer'),
            duration: 10,
            timeLeft: 0,
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

    let currentSelection = [];


    let initGame = event => {
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
        if( gamePlay.timesPlayed > 0 ){
            screenTransition( showReadyScreen, undefined, 0);
        } else{
            screenTransition( showReadyScreen, 'screen-hidden', 2000);
        }

    };



    function resetGame (event ){
        event.preventDefault();

        config.currentLevel = 1;
        clearDeck( gridContainer );
        resetScore();

        initGame( event );

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

        var items = document.querySelectorAll(".card"),
            len = items.length,
            i = 0;

        for( ; i < len; i++ ) {
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


    function showReadyScreen(){

        var fragment = doc.createDocumentFragment(),
            count = 3;

        fragment.appendChild( createNewElement( doc, undefined , 'js-ready_screen', undefined, 'ready_screen' ) );
        titleScreen.appendChild( fragment );

        var screen = titleScreen.firstElementChild,
            readyScreen = doc.getElementById("js-ready_screen");

        animationLoop(count, readyScreen, screenTransition(startGame, undefined, 5000) );

    }



    function animationLoop( loops, content, callback ){

        if( loops > 0 ){

            setTimeout(function() {
                content.innerHTML = loops;
                animationLoop(loops -= 1, content, callback );
            }, 1000);

        } else if ( loops == 0 ){
            setTimeout(function() {
                content.innerHTML = 'Go';
                animationLoop(loops -= 1, content, callback );
            }, 1000);
        } else {
            callback;
        }
    }



    function showLevelUpScreen(){
        showScreen();

        var fragment = doc.createDocumentFragment();

        fragment.appendChild( createNewElement( doc, 'div', "js-levelup_screen", 'Level Up!', 'level_up_screen' ) );

        titleScreen.appendChild( fragment );

        screenTransition([clearScreen, hideScreen, startNewLevel], undefined, 3000);

    }



    function showGameOverScreen(){
        showScreen();

        var fragment = doc.createDocumentFragment(),
            gameOverContainer = createNewElement( doc, undefined , 'js-game_over_screen', undefined, 'game_over_screen' ),
            resetButton = createNewElement( doc, 'button', 'js-reset_button', 'Play again', 'reset_button' );

        resetButton.addEventListener( 'click', resetGame, false );

        gameOverContainer.appendChild( createNewElement( doc, 'h1', undefined, 'Game Over', 'game_over_title' ));
        gameOverContainer.appendChild( createNewElement( doc, 'h2', undefined, "You made it to level " + config.currentLevel, 'game_over_final_level' ) );
        gameOverContainer.appendChild( createNewElement( doc, 'h2', undefined, "With a score of " + gameScore.total, 'game_over_final_score' ) );



        gameOverContainer.appendChild( resetButton );


        fragment.appendChild( gameOverContainer );
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



    function createNewElement( doc = document, element = 'div', js = undefined, content = undefined, ...classNames ){
        var newElement = doc.createElement( element );

        if( js ){
            newElement.id = js;
        }

        for( var i = 0; i < classNames.length; i++ ){
            newElement.className += classNames[i];
        }

        if( content ) {
            newElement.innerHTML = content;
        }

        return newElement;

    }


    function screenTransition( funcs = [], animateElement = undefined, timeDelay = 0 ){
        var screen = titleScreen.firstElementChild;

        //animate welcome screen going
        if( animateElement ) {
            screen.classList.add(animateElement);
        }


        setTimeout(function(){
            titleScreen.removeChild(screen);

            if( funcs.length > 1 ){

                for( let i = 0; i < funcs.length; i++ ){
                    funcs[i]();
                }

            } else{
                funcs();
            }

        }, timeDelay );

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
            i = 0;

        for ( ; i < noOfPairs; i += 1 ){
            newCard = new Card( config.cardDesign[i], config.cardDesign[i], config.cardDesign[i] );
            deck.push(newCard);
            deck.push(newCard);
        }
    }

    /**
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    function shuffleDeck( array ) {

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

        gameTimer.timeLeft = gameTimer.duration;
        var time = setTimer( gameTimer.timeLeft );

        if( gameTimer.container.children.length > 0 ) {
            gameTimer.container.children[0].innerText = time.minutes;
            gameTimer.container.children[2].innerText = time.seconds < 10 ? "0" + time.seconds : time.seconds;

        } else{
            //Create minutes
            var fragment = doc.createDocumentFragment(),
                minutes = doc.createElement('span');

            minutes.className = "minutes";
            minutes.id = "js-minutes";
            minutes.innerText = time.minutes;

            //Create divider
            var divider = doc.createElement('span');

            divider.className = "divider";
            divider.innerText = ":";

            //Create seconds
            var seconds = doc.createElement('span');

            seconds.className = "seconds";
            seconds.id = "js-seconds";
            seconds.innerText = time.seconds < 10 ? "0" + time.seconds : time.seconds;


            fragment.appendChild( minutes );
            fragment.appendChild( divider );
            fragment.appendChild( seconds );

            gameTimer.container.appendChild( fragment );

            //Set global variables with newly created elements to be used later
            gameTimer.minuteContainer = minutes;
            gameTimer.secondContainer = seconds;
        }

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
0
        if ( gameTimer.timeLeft > 0 ) {

            gameTimer.timeLeft--;
            var newTimes = setTimer( gameTimer.timeLeft );

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
        gameTimer.timeLeft = gameTimer.timeLeft + value;
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

    function resetScore(){
        gameScore.total = 0;
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
            addTime(5);


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
        gridContainer.removeEventListener( 'click', blocker, true );
        gamePlay.timesPlayed++;
        gameTimer.timer = startTimer();

    }


    function endGame(){
        //Remove event listener for cards
        gridContainer.addEventListener( 'click', blocker, true );
        showGameOverScreen();
    }


    //*****************************************************************************************************************
    //
    // Start the game
    //
    //*****************************************************************************************************************

    startBtn.addEventListener( 'click', initGame, false );

})();