Drupal.behaviors.ejectorseat = function() {
  var windowFocus = true;
  var ejectorOverdue = false;
  var ejectorInterval = Drupal.settings.ejectorInterval ? Drupal.settings.ejectorInterval * 1000 : 60000;
  var intervalId;
  $(window)
    .blur(function(){
      windowFocus = false;
    })
    .focus(function(){
      windowFocus = true;
      if (ejectorOverdue) {
        ejectorOverdue = false;
        ejectorCheck();
        restartTimer();
      }
    });
  var ejectorCheck = function() {
    if (windowFocus) {
      // do the ajax test
      $.get(Drupal.settings.ejectorUrl, function(data){
        // if data of 0 is returned
        if (data === '0') {
          window.location.reload(true);
        }
      });
    }
    else {
      ejectorOverdue = true;
    }
  }
  function startTimer() {
    intervalId = setInterval(ejectorCheck, ejectorInterval);
  }
  function restartTimer() {
    clearInterval(intervalId);
    startTimer();
  }
  startTimer();
}