/**
 * Created by naveen on 27/10/17.
 */

/*
 *   RGB GAME.
 *   A Game to improve you're RGB skills, in a fun way, obviously!
 *   - You'll be shown a color(rgb) combination
 *   - You are supposed to pick the correct color that matches the rgb combination.
 *   */

console.log('Copyright Naveen 28-10-2017');
console.log('Github: https://github.com/Naveen-S');
// Business logic of our game.
var colorController = (function () {
    var goalColor;

    var colorGenerator = function () {
        var rgb = [];
        for (var i = 0; i < 3; i++) {
            var band = Math.floor(Math.random() * 255) + 1;
            rgb.push(band);
        }
        return rgb;
    };

    var generateRGBString = function (rgb) {
        return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
    };

    var pickGoalColor = function (colors) {
        goalColor = colors[Math.floor(Math.random() * colors.length)];
    };
    return {

        getColors: function (num) {
            var rgbList = [];
            for (var i = 0; i < num; i++) {
                var color = colorGenerator();
                var colorString = generateRGBString(color);
                rgbList.push(colorString);
            }
            pickGoalColor(rgbList);
            return rgbList;
        },

        getGoalColor: function () {
            return goalColor;
        },

        checkAnswer: function (el) {
            if (el.target.style.backgroundColor == goalColor) {
                UIController.gameOver(goalColor);
            }
            else {
                UIController.wrongColorPicked(el.target)
            }
        }
    }

})();

// View of our game.
var UIController = (function () {
    var DOMSTRINGS = {
        square: '.square',
        container: '.squareContainer',
        heading: 'h1',
        banner: '.jumbotron',
        newGame: '#new',
        hardLevel: '.hard',
        easyLevel: '.easy',
        label: '#infoLabel',
        selected: 'selected'
    };

    var paintSquares = function (colors) {
        var sqaures = document.querySelectorAll(DOMSTRINGS.square);
        for (var i = 0; i < sqaures.length; i++) {
            if (colors[i]) {
                sqaures[i].style.display = 'block';
                sqaures[i].style.backgroundColor = colors[i];
            }
            else {
                sqaures[i].style.display = 'none';

            }
        }
    };

    var displayGoalColor = function (color) {
        document.querySelector(DOMSTRINGS.heading).textContent = color;
    };

    var changeColorGameOver = function (color) {
        document.querySelector(DOMSTRINGS.banner).style.backgroundColor = color;
        var sqaures = document.querySelectorAll(DOMSTRINGS.square);
        for (var i = 0; i < sqaures.length; i++) {
            sqaures[i].style.backgroundColor = color;
        }
    };

    return {
        renderColors: function (colors) {
            paintSquares(colors);
        },

        getDOMSTRINGS: function () {
            return DOMSTRINGS;
        },

        displayGoalColor: function (color) {
            displayGoalColor(color);
        },

        gameOver: function (color) {
            document.querySelector(DOMSTRINGS.newGame).textContent = 'New Game';
            document.querySelector(DOMSTRINGS.label).textContent = 'Correct!';
            document.querySelector(DOMSTRINGS.label).style.color = '#264F30';
            changeColorGameOver(color);
        },

        wrongColorPicked: function (el) {
            // Hacky way of checking if you have clicked on the square not elsewhere in the container.
            if (el.classList.contains('square')) {
                document.querySelector(DOMSTRINGS.label).textContent = 'Try again!';
                el.style.backgroundColor = '#e0e0e0';
            }
        },

        resetUI: function () {
            // Change banner color.
            document.querySelector(DOMSTRINGS.banner).style.backgroundColor = '#5D359D';
            //reset info text.
            document.querySelector(DOMSTRINGS.label).textContent = '';
            // Remove highlight Hard button
            document.querySelector(DOMSTRINGS.hardLevel).classList.remove(DOMSTRINGS.selected);
            document.querySelector(DOMSTRINGS.hardLevel).classList.add(DOMSTRINGS.selected);
            // Reomve highlight from easy button
            document.querySelector(DOMSTRINGS.easyLevel).classList.remove(DOMSTRINGS.selected);
            // Change colors
            document.querySelector(DOMSTRINGS.newGame).textContent = 'Change colors ?';

        },
        hardMode: function () {
            document.querySelector(DOMSTRINGS.hardLevel).classList.remove(DOMSTRINGS.selected);
            document.querySelector(DOMSTRINGS.hardLevel).classList.add(DOMSTRINGS.selected);
            document.querySelector(DOMSTRINGS.easyLevel).classList.remove(DOMSTRINGS.selected);
        },
        easyMode: function () {
            document.querySelector(DOMSTRINGS.easyLevel).classList.remove(DOMSTRINGS.selected);
            document.querySelector(DOMSTRINGS.easyLevel).classList.add(DOMSTRINGS.selected);
            document.querySelector(DOMSTRINGS.hardLevel).classList.remove(DOMSTRINGS.selected);

        }
    }
})();


// Main controller of our game.

var controller = (function () {
    var DOM = UIController.getDOMSTRINGS();

    var setupEventListeners = function () {
        document.querySelector(DOM.container).addEventListener('click', colorController.checkAnswer);
        document.querySelector(DOM.newGame).addEventListener('click', function () {
            newGame(6)
        });
        document.querySelector(DOM.hardLevel).addEventListener('click', function () {
            hardGame(6)
        });
        document.querySelector(DOM.easyLevel).addEventListener('click', function () {
            easyGame(3)
        });
    };

    var newGame = function (difficulty) {
        // Reset and get game to new state
        //Change the background color.
        UIController.resetUI();
        setup(difficulty);
    };
    var hardGame = function () {
        newGame(6);
        UIController.hardMode();
    };

    var easyGame = function () {
        newGame(3);
        UIController.easyMode();
    };

    var setup = function (mode) {
        var difficulty = mode ? mode : 6;
        // Display colors
        var c = colorController.getColors(difficulty);
        UIController.renderColors(c);

        // Display Goal color
        UIController.displayGoalColor(colorController.getGoalColor());
    };
    return {
        init: function () {
            // Set up Event Listeners
            setupEventListeners();
            setup();
        }
    }
})();

controller.init();
