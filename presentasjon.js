let state = {
    currentSlideNumber: 1,
    currentSlide: document.getElementById("slide_1"),
    allwaysTrue: true,
}

let handleKeyDown = (event) => {
    switch(event.keyCode){
        case 39:
            jumpSlides(1);
            return;
        case 37:
            jumpSlides(-1);
            return;
    }
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
    console.log(element.classList);
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
}
function triggerAnimation(element){
    var animated = element.querySelector(".animated");
    if(!animated){
        return;
    }
    console.log(animated);
    animated.src = `${animated.src}?${new Date().getTime()}`;
    animated.classList.add("animated--triggered");
}
function startLightCycle(element, includeExtraOrange){
    const continueIndicator =`keepCycle${element.id}`;
    state[continueIndicator] = true;
    let lights = element.querySelectorAll(".trafficLight-light");
    setRed(lights, continueIndicator, includeExtraOrange);
}
function setRed(lights, continueIndicator, includeExtraOrange, interval){
    lights[0].classList.add("trafficLight-light--active");
    lights[1].classList.remove("trafficLight-light--active");
    lights[2].classList.remove("trafficLight-light--active");
    if(state[continueIndicator]){
        if(includeExtraOrange){
            setTimeout(() => setOrangeRed(lights, continueIndicator, includeExtraOrange, interval), interval || 2000);
        } else {
            setTimeout(() => setGreen(lights, continueIndicator, includeExtraOrange, interval), interval || 2000);
        }
    }
}
function setOrangeRed(lights, continueIndicator, includeExtraOrange, interval){
    lights[0].classList.add("trafficLight-light--active");
    lights[1].classList.add("trafficLight-light--active");
    lights[2].classList.remove("trafficLight-light--active");
    if(state[continueIndicator]){
        setTimeout(() => setGreen(lights, continueIndicator, includeExtraOrange, interval), 1000);
    }
}
function setOrange(lights, continueIndicator, includeExtraOrange, interval){
    lights[0].classList.remove("trafficLight-light--active");
    lights[1].classList.add("trafficLight-light--active");
    lights[2].classList.remove("trafficLight-light--active");
    if(state[continueIndicator]){
        setTimeout(() => setRed(lights, continueIndicator, includeExtraOrange, interval), 1000);
    }
}
function setGreen(lights, continueIndicator, includeExtraOrange, interval){
    lights[0].classList.remove("trafficLight-light--active");
    lights[1].classList.remove("trafficLight-light--active");
    lights[2].classList.add("trafficLight-light--active");
    if(state[continueIndicator]){
        setTimeout(() => setOrange(lights, continueIndicator, includeExtraOrange, interval), interval || 2000);
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
    const indicator = document.getElementById("crossOverRevealIndicator");
    indicator.classList.add("crossOverBox-indicator--active");
    const trafficLights = document.querySelectorAll(".trafficLight.crossoverAll");
    
    trafficLights.forEach((trafficLight) => rollToGreen(trafficLight.querySelectorAll(".trafficLight-light")), this);
}
function rollToGreen(lights){
    window.setTimeout(()=> setOrangeRed(lights, "allwaysTrue", true, 10000), 6000)
}
(function init(){
    window.addEventListener("keydown", handleKeyDown);
    document.getElementById("crossOverRevealAction").addEventListener("click", revealCrossover)
    document.getElementById("crossOverAllLights").addEventListener("click", crossOverAllLights)
})()