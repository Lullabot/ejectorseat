Drupal.behaviors.ejectorseat = function() {
  Drupal.ejectorSeat = {
    windowFocus: true,
    overdue: false
  };
  var ejectorInterval = Drupal.settings.ejectorSeat.interval ? Drupal.settings.ejectorSeat.interval * 1000 : 60000;
  var intervalId;
  $(window)
    .blur(function(){
      Drupal.ejectorSeat.windowFocus = false;
    })
    .focus(function(){
      Drupal.ejectorSeat.windowFocus = true;
      if (Drupal.ejectorSeat.overdue) {
        Drupal.ejectorSeat.overdue = false;
        ejectorCheck();
        restartTimer();
      }
    });
    
  function ejectorCheck() {
    var ignoreFocus = typeof Drupal.settings.ejectorSeat.ignoreFocus == 'null' ? false : Drupal.settings.ejectorSeat.ignoreFocus;
    if (Drupal.ejectorSeat.windowFocus || ignoreFocus) {
      // do the ajax test
      $.get(Drupal.settings.ejectorSeat.url, function(data){
        // if data of 0 is returned
        if (data === '0') {
          window.location.reload(true);
        }
      });
    }
    else {
      Drupal.ejectorSeat.overdue = true;
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