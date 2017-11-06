let state = {
    currentSlideNumber: 1,
    currentSlide: document.getElementById("slide_1"),
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
        setTimeout(() => setGreen(lights, continueIndicator, includeExtraOrange), 1000);
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

}
(function init(){
    window.addEventListener("keydown", handleKeyDown);
    document.getElementById("crossOverRevealAction").addEventListener("click", revealCrossover)
})()