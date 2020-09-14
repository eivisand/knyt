let state = {
    currentSlideNumber: 1,
    currentSlide: document.querySelector(".slide"),
    slides: document.querySelectorAll(".slide"),
    allwaysTrue: true,
    drivingTime: 7000,
    isDriving: false,
    carPosX: 0,
    approachCrossingTimeout: null,
    currentSlideVideos: [],
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
    console.log(event);
}
let handleKeyUp = (event) => {
    switch(event.keyCode){
        default:
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
    //console.log(element.classList);
    if(element.classList.contains("animate")){
        triggerAnimation(element);
    }
    stopVideos(state.currentSlideVideos)
    state.currentSlideVideos = element.querySelectorAll("video");
    playVideos(state.currentSlideVideos)
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
function playVideos(videos){
    videos.forEach(video => video.play())
}
function stopVideos(videos){
    videos.forEach(video => video.pause())
}
function letterizeTitles(){
    const titles = document.querySelectorAll(".mainTitle");
    titles.forEach(title => {
        const spans = [...title.innerText].map(character => {
            const spanText = document.createElement("span", { textContent: character })
            spanText.textContent = character;
            return spanText;
        })
        title.textContent = "";
        spans.forEach(span => title.appendChild(span))
    })
}

(function init(){
    letterizeTitles();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
   // document.getElementById("crossOverRevealAction").addEventListener("click", revealCrossover)
    //document.getElementById("crossOverAllLights").addEventListener("click", crossOverAllLights)
})()
