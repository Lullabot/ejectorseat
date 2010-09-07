Drupal.behaviors.ejectorseat = function() {
  Drupal.ejectorWindowFocus = true;
  Drupal.ejectorOverdue = false;
  var ejectorInterval = Drupal.settings.ejectorInterval ? Drupal.settings.ejectorInterval * 1000 : 60000;
  var intervalId;
  $(window)
    .blur(function(){
      Drupal.ejectorWindowFocus = false;
    })
    .focus(function(){
      Drupal.ejectorWindowFocus = true;
      if (Drupal.ejectorOverdue) {
        Drupal.ejectorOverdue = false;
        ejectorCheck();
        restartTimer();
      }
    });
    
  function ejectorCheck() {
    if (Drupal.ejectorWindowFocus) {
      // do the ajax test
      $.get(Drupal.settings.ejectorUrl, function(data){
        // if data of 0 is returned
        if (data === '0') {
          window.location.reload(true);
        }
      });
    }
    else {
      Drupal.ejectorOverdue = true;
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