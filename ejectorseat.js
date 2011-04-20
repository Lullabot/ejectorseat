/**
 * @file
 * Ejector seat Javascript functions.
 *
 * Poll a Drupal site via AJAX at a specified interval to determine if the user
 * currently accessing the site still has an active session and reload the page
 * if they don not. Effectively logging the user out of the site.
 */
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
    var ignoreFocus = Drupal.settings.ejectorSeat.ignoreFocus;
        
    if (Drupal.ejectorSeat.windowFocus || ignoreFocus) {
      // Do the AJAX test.
      $.get(Drupal.settings.ejectorSeat.url, function(data){
        // If the test returns 0 the user's session has ended so refresh the
        // page.
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
