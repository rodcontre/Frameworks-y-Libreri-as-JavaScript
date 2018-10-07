var countMoves = 0;
var clicks = 0;
var score = 0;

$('.btn-reinicio').click(function startTimer() {

  var timer = 120;
  var currentTime = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    $('#timer').text(minutes + ':' + seconds);

    if (--timer < 0) {
      $('body').trigger('finTiempo');
      clearcurrentTime(currentTime);
      $('.main-titulo').stop();
      finish();
    }
  }, 1000);

  changeTitleColor();
  startPlay();

});

function changeTitleColor() {
  $('.main-titulo').animate({
    fontSize: '3em',
  }, 500, function () {
    $('.main-titulo').css('color', 'white');

    $('.main-titulo').animate({
      fontSize: '3em',
    }, 500, function () {
      $('.main-titulo').css('color', 'yellow');
      $('.main-titulo').animate({
        fontSize: '3em',
      }, 500, changeTitleColor);
    });
  });
};

function startPlay() {
  clicks++;
  if (clicks == 1) {
    $('.btn-reinicio').text('Reiniciar');
    completeCube();
    startTimer();
    restartPlay();
  } else {
    location.reload();
  }
}

function completeCube() {
  var columna;
  for (var i = 1; i <= 7; i++) {
    columna = '.col-' + i;
    fillElemento($(columna), 7);
  }
}

function fillElemento(columna, espacios) {
  for (var i = 0; i < espacios; i++) {
    var elemento = document.createElement('img');
    $(elemento)
    .attr('src', randomImage())
    .addClass('elemento')
    .draggable({
      grid: [120, 90],
      revert: 'valid',
    })
    .droppable({
      accept: '.elemento',
      drop: function (event, ui) {
        var srcFrom = $(this).attr('src');
        var srcTo = $(ui.draggable).attr('src');
        $(ui.draggable).attr('src', srcFrom);
        $(this).attr('src', srcTo);
        window.setTimeout(restartPlay, 500);
        plusMoves();
      },
    });
    $(columna).prepend(elemento);
  }
}

function randomImage() {
  var images = ['./image/1.png', './image/2.png', './image/3.png', './image/4.png'];
  return images[getRandomIndex()];
}

function getRandomIndex() {
  return Math.floor(Math.random() * 4);
}

function restartPlay() {
  checkMatrix();
  window.setTimeout(deleteElements, 2100);
  window.setTimeout(completeMatrix, 2200);
}

function checkMatrix() {
  var compareSecond;
  var compareFirst;
  var matchLeft = false;
  var matchRight = false;
  var matchAbajo = false;
  var matchArriba = false;
  for (var col = 1; col <= 7; col++) {
    for (var row = 0; row < 7; row++) {
      matchArriba = matchAbajo = matchRight = matchLeft = false;
      compareFirst = $('.col-' + col).find('img')[row];

      //Verifica coincidencias hacia la izquierda
      if ($('.col-' + (col - 1)).length > 0) {
        compareSecond = $('.col-' + (col - 1)).find('img')[row];
        if (equalElements(compareFirst, compareSecond)) {
          matchLeft = true;
          if ($('.col-' + (col - 2)).length > 0) {
            compareSecond = $('.col-' + (col - 2)).find('img')[row];
            if (equalElements(compareFirst, compareSecond)) {
              counterPoints(compareFirst, $('.col-' + (col - 1)).find('img')[row], compareSecond);
            }
          }
        }
      }

      //Verifica coincidencias hacia la Derecha
      if ($('.col-' + (col + 1)).length > 0) {
        compareSecond = $('.col-' + (col + 1)).find('img')[row];
        if (equalElements(compareFirst, compareSecond)) {
          matchRight = true;
          if ($('.col-' + (col + 2)).length > 0) {
            compareSecond = $('.col-' + (col + 2)).find('img')[row];
            if (equalElements(compareFirst, compareSecond)) {
              counterPoints(compareFirst, $('.col-' + (col + 1)).find('img')[row], compareSecond);
            }
          }
        }
      }

      //Verifica coincidencias hacia izquierda y Derecha
      if (matchLeft == true && matchRight == true) {
        counterPoints(compareFirst, $('.col-' + (col - 1)).find('img')[row], $('.col-' + (col + 1)).find('img')[row]);
      }

      //Verifica coincidencias hacia arriba
      if ($('.col-' + col).find('img')[row - 1]) {
        compareSecond = $('.col-' + col).find('img')[row - 1];
        if (equalElements(compareFirst, compareSecond)) {
          matchArriba = true;
          if ($('.col-' + col).find('img')[row - 2]) {
            compareSecond = $('.col-' + col).find('img')[row - 2];
            if (equalElements(compareFirst, compareSecond)) {
              counterPoints(compareFirst, $('.col-' + col).find('img')[row - 1], compareSecond);
            }
          }
        }
      }

      //Verifica coincidencias hacia abajo
      if ($('.col-' + col).find('img')[row + 1]) {
        compareSecond = $('.col-' + col).find('img')[row + 1];
        if (equalElements(compareFirst, compareSecond)) {
          matchAbajo = true;
          if ($('.col-' + col).find('img')[row + 2]) {
            compareSecond = $('.col-' + col).find('img')[row + 2];
            if (equalElements(compareFirst, compareSecond)) {
              counterPoints(compareFirst, $('.col-' + col).find('img')[row + 1], compareSecond);

            }
          }
        }
      }

      //Verifica coincidencias hacia abajo y hacia arriba
      if (matchArriba == true && matchAbajo == true) {
        counterPoints(compareFirst, $('.col-' + col).find('img')[row + 1], $('.col-' + col).find('img')[row - 1]);
      }
    }
  }
}

function equalElements(param1, param2) {
  if ($(param1).attr('src') == $(param2).attr('src')) {
    return true;
  } else return false;
}

function counterPoints(param1, param2, param3) {
  score = score + 10;
  $('#score-text').text(score);
  $(param1).hide('pulsate', 2000);
  $(param2).hide('pulsate', 2000);
  $(param3).hide('pulsate', 2000);
}

function deleteElements() {
  $('img:hidden').each(function (index) {
    $(this).remove();
  });
}

function completeMatrix() {
  var elements = missing = 0;
  for (var i = 1; i <= 7; i++) {
    elements = $('.col-' + i).find('img').length;
    missing = 7 - elements;
    fillElemento($('.col-' + i), missing);
  }

  window.setTimeout(restartPlay, 500);
}

function plusMoves() {
  countMoves++;
  $('#countMoves-text').text(countMoves);
}

function finish() {
  $('.panel-tablero').hide(900);
  $('.panel-score')
  .animate({
    width: '100%',
  }, 1000, function () {
    $(this).prepend("<h2 class='titulo-over'>Juego Terminado</h2>");
  });

  $('.time').hide(500);
  $('#score-text').hide();
  $('.score').append("<span class='data-info' id='score-final'>" + score + '</span>');
}
