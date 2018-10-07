function startTimer(duration, display) {
  var timer = duration;
  var minutes = 0;
  var seconds = 0;
  var currentTime = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    $(display).text(minutes + ':' + seconds);

    if (--timer < 0) {
      $('body').trigger('finTiempo');
      clearcurrentTime(currentTime);
    }
  }, 1000);
}
