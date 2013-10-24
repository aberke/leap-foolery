
var applauseAudio = document.getElementById('applause-audio');
var rimshotAudio = document.getElementById('rimshot-audio');


var windowWidth = $(window).width();
var slides = $('.slide');
var slidesTransitioning = false;
var current_slide = 0;


var setupSlides = function() {
  slides.css('display', 'none');
  slides.eq(0).css({display: 'block', left:'0px'});
}
setupSlides();



var nextSlide = function(){
  if (current_slide >= (slides.length-1)) {
    return;
  }
  slidesTransitioning = true;

  var next = slides.eq(current_slide + 1);
  next.css({left: windowWidth + 'px', display: 'block'});

  next.animate({left: '0px'}, 800, function(){

  });
  slides.eq(current_slide).animate({left: '-' + windowWidth + 'px'}, 1000, function() {
    console.log($(this));
    $(this).css('display', 'none');
    slidesTransitioning = false;
  });

  current_slide = current_slide + 1;
  console.log('current_slide: ' + current_slide);
}
var previousSlide = function(){
  if(current_slide == 0) {
    return;
  }
  console.log('previousSlide');
  console.log('windowWidth:' + windowWidth);
  slidesTransitioning = true;

  var previous = slides.eq(current_slide -1);
  previous.css({left: '-' + windowWidth + 'px', display: 'block'});

  previous.animate({left: '0px'}, 800);

  slides.eq(current_slide).animate({left: windowWidth + 'px'}, 1000, function() {
    console.log($(this));
    $(this).css('display', 'none');
    slidesTransitioning = false;
  });

  current_slide = current_slide - 1;
  console.log('current_slide: ' + current_slide);
}

var applausePlay = function(){
  applauseAudio.play();
}
var rimshotPlay = function(){
  rimshotAudio.play();
}

var zoomInImage = function(){
  var zoomable = slides.eq(current_slide).children('img.zoomable');
  zoomable.width(zoomable.width()*1.5);
}
var zoomOutImage = function() {
  var zoomable = slides.eq(current_slide).children('img.zoomable');
  zoomable.width(zoomable.width()*0.75);
}

  // Display Gesture object data
var direction = document.getElementById("direction");
var gestureString;

var gesture_leftRight = function(gesture) {
  if (slidesTransitioning) { 
    return;
  }

  if (gesture.direction[0] < 0) {
    nextSlide();
  } else {
    previousSlide();
  } 
}
var gesture_upDown = function(gesture) {
  if(gesture.direction[1] > 0) {
    applausePlay();
  } else {
    rimshotPlay();
  }  
}
var gesture_forwardBack = function(gesture) {
  if(gesture.direction[2] > 0) {
    zoomInImage()
  } else {
    zoomOutImage();
  }
}
var gesture_circle = function(gesture) {
  if (gesture.pointable.direction.angleTo(gesture.normal) <= PI/4) {
    /* clockwise */
    zoomInImage();
  } else {
    zoomOutImage();
  }
}


// Setup Leap loop with frame callback function
var controllerOptions = {enableGestures: true};

Leap.loop(controllerOptions, function(frame) {

  if (frame.gestures.length > 0) {

    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[i];

      if (gesture.type == "swipe") {

        if(Math.abs(gesture.direction[1]) > Math.abs(gesture.direction[0])) {
          /* it's an up-down motion */
          gesture_upDown(gesture);
        } else {
         gesture_leftRight(gesture);
        }
      }
      else if (gesture.type == "circle") {
        console.log("circle");
        gesture_circle(gesture);
      } else {
        console.log(gesture.type);
      }
    }
  }
});
