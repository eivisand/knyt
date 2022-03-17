var wheely = document.getElementById('colorwheel');

var hasClicked = false;

var spin = function() {
  if (hasClicked){
    wheely.classList.remove('colorwheel--coolio');
  }
  else{
    wheely.classList.add('colorwheel--coolio');
  }
  hasClicked = !hasClicked;
}
