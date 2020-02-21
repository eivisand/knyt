let state = {
    currentSlideNumber: 1,
    currentSlide: document.getElementById("slide_1"),
    allwaysTrue: true,
    drivingTime: 7000,
    isDriving: false,
    carPosX: 0,
    approachCrossingTimeout: null,
}

let handleKeyDown = (event) => {
    switch(event.keyCode){
        case 39:
            jumpSlides(1);
            return;
        case 37:
            jumpSlides(-1);
            return;
        case 87:
            startCar();
            return;
        case 83:
            reverseCar();
            return;
        case 65:
            startTurn(-1);
            return;
        case 68:
            startTurn(1);
            return;
    }
    console.log(event);
}
let handleKeyUp = (event) => {
    switch(event.keyCode){
        case 87:
            stopCar();
            return;
        case 83:
            stopCar();
            return;
        case 65:
            stopTurn();
            return;
        case 68:
            stopTurn();
            return;
    }
    //console.log(event);
}
function jumpSlides(jumpBy){
    console.log(`slide_${state.currentSlideNumber+jumpBy}`);
    var nextSlide = document.getElementById(`slide_${state.currentSlideNumber+jumpBy}`);
    if (!nextSlide){
        console.log("no more slides");
        return;
    }
    handleJumpedTo(nextSlide);
    nextSlide.scrollIntoView();
    state.currentSlide.classList.remove("slide--inFocus");
    handleJumpedFrom(state.currentSlide);
    nextSlide.classList.add("slide--inFocus");
    Object.assign(state, {currentSlideNumber: state.currentSlideNumber + jumpBy, currentSlide: nextSlide})
}
function handleJumpedTo(element){
    //console.log(element.classList);
    if(element.classList.contains("animate")){
        triggerAnimation(element);
    }
    if(element.classList.contains("cycleLight")){
        startLightCycle(element, true);
    }
    if(element.classList.contains("cycleRight")){
        startLightCycle(element, false);
    }
}
function handleJumpedFrom(element){
    if(element.classList.contains("cycleLight") || element.classList.contains("cycleRight")){
        breakCycle(element);
    }
    var animated = element.querySelector(".animated");
    if(!animated){
        return;
    }
    if(animated.dataset.idle){
        animated.src = `${animated.dataset.idle}`;
        animated.classList.remove("animated--triggered");
    }
}
function triggerAnimation(element){
    var animated = element.querySelector(".animated");
    if(!animated){
        return;
    }
    if(animated.dataset.active){
        animated.src = `${animated.dataset.active}`;
    }
    else{
        animated.src = `${animated.src}?${new Date().getTime()}`;
    }
    animated.classList.add("animated--triggered");
}
function startLightCycle(element, includeExtraOrange){
    const continueIndicator =`keepCycle${element.id}`;
    state[continueIndicator] = true;
    let lights = element.querySelectorAll(".trafficLight-light");
    setRed(lights, continueIndicator, includeExtraOrange);
}
function setRed(lights, continueIndicator, includeExtraOrange){
    lights[0].classList.add("trafficLight-light--active");
    lights[1].classList.remove("trafficLight-light--active");
    lights[2].classList.remove("trafficLight-light--active");
    if(state[continueIndicator]){
        if(includeExtraOrange){
            setTimeout(() => setOrangeRed(lights, continueIndicator, includeExtraOrange), 2000);
        } else {
            setTimeout(() => setGreen(lights, continueIndicator, includeExtraOrange), 2000);
        }
    }
}
function setOrangeRed(lights, continueIndicator, includeExtraOrange){
    lights[0].classList.add("trafficLight-light--active");
    lights[1].classList.add("trafficLight-light--active");
    lights[2].classList.remove("trafficLight-light--active");
    if(state[continueIndicator]){
        setTimeout(() => setGreen(lights, continueIndicator, includeExtraOrange ), 1000);
    }
}
function setOrange(lights, continueIndicator, includeExtraOrange){
    lights[0].classList.remove("trafficLight-light--active");
    lights[1].classList.add("trafficLight-light--active");
    lights[2].classList.remove("trafficLight-light--active");
    if(state[continueIndicator]){
        setTimeout(() => setRed(lights, continueIndicator, includeExtraOrange), 1000);
    }
}
function setGreen(lights, continueIndicator, includeExtraOrange){
    lights[0].classList.remove("trafficLight-light--active");
    lights[1].classList.remove("trafficLight-light--active");
    lights[2].classList.add("trafficLight-light--active");
    if(state[continueIndicator]){
        setTimeout(() => setOrange(lights, continueIndicator, includeExtraOrange), 2000);
    }
}

function breakCycle(element){
    state[`keepCycle${element.id}`] = false;
}
function revealCrossover(event){
    const indicator = document.getElementById("crossOverRevealIndicator");
    indicator.classList.add("crossOverBox-indicator--active");
    const light = document.getElementById("crossOverRevealLight");
    const lights = light.querySelectorAll(".trafficLight-light");

    window.setTimeout(() => lights[1].classList.add("trafficLight-light--active"), 5000)
    window.setTimeout(() => {
        lights[1].classList.remove("trafficLight-light--active");
        lights[2].classList.add("trafficLight-light--active");
        indicator.classList.remove("crossOverBox-indicator--active");
    }, 6000)
}
function crossOverAllLights(event){
    const indicator = document.getElementById("crossOverAllLightsIndicator");
    indicator.classList.add("crossOverBox-indicator--active");
    const trafficLights = document.querySelectorAll(".trafficLight.crossoverAll");

    trafficLights.forEach((trafficLight) =>
        rollToGreen(trafficLight.querySelectorAll(".trafficLight-light"), trafficLight.classList.contains("trafficLight--ped")
    )
    , this);
    window.setTimeout(() => indicator.classList.remove("crossOverBox-indicator--active"), 7000);
}
function rollToGreen(lights, isPed){
    window.setTimeout(() => setOrangeRed_Roll(lights, isPed, 3), 6000)
}
function setOrangeRed_Roll(lights,  isPed, iterations){
    if(!isPed){
        lights[0].classList.add("trafficLight-light--active");
        lights[1].classList.add("trafficLight-light--active");
        lights[2].classList.remove("trafficLight-light--active");
    }
    if(iterations < 1) return
    setTimeout(() => setGreen_Roll(lights, isPed, iterations-1), 1000);
}
function setGreen_Roll(lights,  isPed, iterations){
    lights[0].classList.remove("trafficLight-light--active");
    lights[1].classList.remove("trafficLight-light--active");
    lights[2].classList.add("trafficLight-light--active");
    if(isPed){
      startWalking(lights[2]);
    }
    if(iterations < 1) return
    setTimeout(() => {setOrange_Roll(
      lights, isPed, iterations-1);
      stopWalking(lights[2]);
    }, 10000);
}
function setOrange_Roll(lights,  isPed, iterations){
    if(isPed){
        lights[0].classList.add("trafficLight-light--active");
        lights[1].classList.add("trafficLight-light--active");
    } else{
        lights[0].classList.remove("trafficLight-light--active");
        lights[1].classList.add("trafficLight-light--active");
    }
    lights[2].classList.remove("trafficLight-light--active");
    if(iterations < 1) return
    setTimeout(() => setRed_Roll(lights, isPed, iterations-1), 1000);
}
function setRed_Roll(lights,  isPed, iterations){
    lights[0].classList.add("trafficLight-light--active");
    if(isPed){
        lights[1].classList.add("trafficLight-light--active");
    }else{
        lights[1].classList.remove("trafficLight-light--active");
    }
    lights[2].classList.remove("trafficLight-light--active");
    if(iterations < 1) return
    setTimeout(() => setOrangeRed_Roll(lights, isPed, iterations-1), 10000);
}
function startWalking(light){
  const dude = light.querySelector('img');
  dude.src = "resources/dudeWalking.svg";
}
function stopWalking(light){
  const dude = light.querySelector('img');
  dude.src = "resources/dude.svg";
}
function startCar(){
    if(state.endOfTheLine || (state.isDriving && !state.isReversing)){
        return
    }
    const delimeters = document.querySelectorAll(".roadDelimeter");
    delimeters.forEach(function(delimeter) {
        delimeter.classList.add("roadDelimeter--animated")
    }, this);
    const cars = document.querySelectorAll(".car");
    cars.forEach((car) => car.classList.add("car--driving"))
    state.isDriving = true;
    state.isReversing = false;
    state.startedDriving = Date.now();
    state.approachCrossingTimeout = window.setTimeout(() => approachCrossing(), state.drivingTime);
}
function reverseCar() {
  if(state.endOfTheLine || (state.isDriving && state.isReversing)){
      return
  }
  const delimeters = document.querySelectorAll(".roadDelimeter");
  delimeters.forEach(function(delimeter) {
      delimeter.classList.add("roadDelimeter--animatedRev")
  }, this);
  const cars = document.querySelectorAll(".car");
  cars.forEach((car) => car.classList.add("car--driving"))
  state.isDriving = true;
  state.isReversing = true;
  state.startedDriving = Date.now();
}
function stopCar(){
    if(state.endOfTheLine){
        return
    }
    window.clearTimeout(state.approachCrossingTimeout);
    const delimeters = document.querySelectorAll(".roadDelimeter");
    delimeters.forEach((delimeter) => {
      delimeter.classList.remove("roadDelimeter--animated");
      delimeter.classList.remove("roadDelimeter--animatedRev");
  });
    const cars = document.querySelectorAll(".car");
    cars.forEach((car) => car.classList.remove("car--driving"))
    const ts = Date.now();
    state.isDriving = false;
    direction = state.isReversing ? 1 : -1;
    state.drivingTime = state.drivingTime + direction * (ts - state.startedDriving);
    state.isReversing = false;
}
function approachCrossing(){
    if(!state.isDriving || state.isReversing){
        return;
    }
    stopCar();
    state.endOfTheLine = true;
    const cars = document.querySelectorAll(".car");
    cars.forEach((car) => {
        car.classList.add("car--driving");
        car.classList.add("car--drivingToHalt");
    })
    const foreground = document.querySelector(".foreground");
    foreground.classList.add("foreground--atCrossing");
    const smallify = document.querySelector(".smallify");
    smallify.classList.add("smallify--appear");
    const appearingLight = smallify.querySelector(".trafficLight");
    const lights = appearingLight.querySelectorAll(".trafficLight-light");
    window.setTimeout(() =>
        setOrangeRed_Roll(lights, false, 1)
    , 8000);
}
function startTurn(modifier) {
  if(state.currentTurnModifier === modifier) return;
  state.currentTurnModifier = modifier;
  const carBox = document.querySelector(".carContainer");
  turn(carBox, modifier);
}
function stopTurn() {
  state.currentTurnModifier = 0;
}
function turn(carBox, modifier) {
  if(state.currentTurnModifier !== modifier || !carBox) {
    return;
  }
  state.carPosX += modifier * 25;
  carBox.style.transform = `translate3d(${state.carPosX}px, 0, 0)`;
  window.setTimeout(() =>
      turn(carBox, modifier)
  , 150);
}
(function init(){
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
   // document.getElementById("crossOverRevealAction").addEventListener("click", revealCrossover)
    //document.getElementById("crossOverAllLights").addEventListener("click", crossOverAllLights)
})()
