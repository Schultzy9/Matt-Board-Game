//SEED DATA FOR NOW
const chanceDATA = [
  {
    id: 1,
    penalty: 1,
    text: 'You are a loser.'
  },
  {
    id: 2,
    penalty: 0,
    text: 'Stick wit yo wife'
  },
  {
    id: 3,
    penalty: 2,
    text: 'You will find happiness with a new love'
  },
  {
    id: 4,
    penalty: 0,
    text: 'Sorry champ, you done goofed.'
  },
  {
    id: 5,
    penalty: 2,
    text: 'You can do it.'
  }
]

const chancePenalties = [
  {
    text: 'Go back 3 spaces.',
    position: -3
  },
  {
    text: 'Have a drink.',
    postion: 0
  },
  {
    text: 'Finish your drink!',
    position: 0
  }
]

const duelDATA = [
  "First to complete 10 pushups",
  "Drink the drink",
  "Paper, Scissors, Rock",
  "Steel cage death match"
]

const board = [
  'start', 'drink', 'chance', 'drink', 'duel', 'chance', 'drink', 'drink', 'drink', 'duel', 'chance', 'drink', 'chance', 'end'
];

//SET UP UNIVERSAL GAME VARIABLES
let numOfPlayers = 0;
let players = [];
let currentPlayer = [];

//FUNCTIONS FOR RECORDING STATS AND JAZZ

const createPlayer = (num) => {
  players.push({
    id: (num+1),
    name: '',
    position: 0,
    currentPlayer: false,
    drinks: 0,
    duels: 0,
    chances: 0,
  })
}

const updateStats = (player, space) => {
  if (space = 'drink') {
    player.drinks += 1;
  } else if (space = 'chance') {
    player.chance += 1;
  } else if (space = 'duel') {
    player.duel += 1;
  }
}

//ACTIONS ONCE THE DOCUMENT IS READY

$(document).ready(function() {
  // SET THE NUMBER OF PLAYERS
  $('#submitPlayerNumbers').on('click', function() {
    numOfPlayers = $('#playerNumbers').val();
    for (let i = 0; i <numOfPlayers; i++) {
      createPlayer(i);
      $('#playerNames').append(
          '<label> Player ' + (i+1) + ' Name: </label><input id="player' + (i+1) + 'Name"></input><br>'
      );
    }
    $('#start').show();
    $('#submitPlayerNumbers').css('display', 'none');
  });

  // SAVE PLAYER NAMES
  $('#start').on('click', function() {
    for (let i = 0; i <numOfPlayers; i++) {
      players[i].name = $(`#player${i+1}Name`).val();
    }
    //CLEAR SCREEN
    $('.setGame').hide();
    $('#start').hide();
    $('.gameStart').show();
    $('.diceTime').show();
    //CHOOSE FIRST PLAYER
    let num = _.random(0, numOfPlayers-1);
    currentPlayer = players[num]
    currentPlayer.currentPlayer = true;
    $('#currentPlayer').text(currentPlayer.name);
  });

  //NEXT PLAYER
  $('#nextPlayerButton').on('click', function() {
    currentPlayer.currentPlayer = false;
    if (currentPlayer.id === players.length) {
      players[0].currentPlayer = true;
      currentPlayer = players[0];
    } else {
      players[currentPlayer.id].currentPlayer = true;
      currentPlayer = players[currentPlayer.id];
    }
    $('#currentPlayer').text(currentPlayer.name);
    $('#showDice').text('');
    $('#showDiceText').text('');
    $('#showChance').text('');
    $('.chanceTime').hide();
    $('#showDuel').text('');
    $('#showDuelGame').text('');
    $('.duelTime').hide();
    $('#dice').show();
    $('.nextPlayer').hide();
  });

  // ROLL THE DICE
  $('#dice').on('click', function() {
    $('#dice').hide();
    let num = _.random(1, 6);
    for (let i = 0; i < players.length; i++) {
      if (players[i].currentPlayer === true) {
        players[i].position += num;
        updateStats(players[i], board[players[i].position]);
        if (board[players[i].position] === 'chance') {
          $('.chanceTime').show();
          $('#chance').show();
        } else if (board[players[i].position] === 'duel') {
          $('.duelTime').show();
          $('#duel').show();
        } else {
          $('.nextPlayer').show();
        }
        if (players[i].position >= board.length - 1) {
          $('#showDice').text(num + ' - ' + board[players[i].position] + ' - You win!');
        } else {
          $('#showDice').text(num + ' - ' + board[players[i].position]);
        }
      }
    }
  });

  // CHANCE BUTTON
  $('#chance').on('click', function() {
    let num = _.random(0, 2);
    let chanceSpace = chanceDATA[num];
    for (let i = 0; i < players.length; i++) {
      if (players[i].currentPlayer === true) {
        players[i].position += chancePenalties[chanceSpace.penalty].position
        if (players[i].position < 0) {
          players[i].position = 0;
        }
      }
    }
    $('#showChance').text(chanceSpace.text + ' ' + chancePenalties[chanceSpace.penalty].text);
    $('#chance').hide();
    $('.nextPlayer').show();
  });

  //FIND DUEL OPPONENT
  $('#duel').on('click', function() {
    let num = currentPlayer.id-1
    let duelOpponent = '';
    while (num+1 === currentPlayer.id) {
      num = _.random(0, players.length-1)
      duelOpponent = players[num].name
    }
    $('#showDuel').text(currentPlayer.name + ' VS ' + duelOpponent);
    num = _.random(0, duelDATA.length-1);
    $('#showDuelGame').text(duelDATA[num]);
    $('#duel').hide();
    $('.nextPlayer').show();
  });

});
