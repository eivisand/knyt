

function blendMultiply() {
  const blendMultiply = document.querySelector('#blendMultiply')
  const form = blendMultiply.querySelector('form');
  const {blenderValue, blendeeValue} = Object.values(form).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})
  const blenderNode = blendMultiply.querySelector("#blenderMultiply");
  const blendeeNode = blendMultiply.querySelector("#blendeeMultiply");
  blenderNode.setAttribute("style", `background-color: ${blenderValue}`);
  blendeeNode.setAttribute("style", `background-color: ${blendeeValue}`);
  const outputColor = multiplyRaw(blenderValue, blendeeValue);
    const output = blendMultiply.querySelector("output#multiplyOut");
    output.innerText = outputColor;
    output.setAttribute("style", `color: ${outputColor}`)
  return false;
}

function multiplyRaw(rawColor1, rawColor2) {
  const color1 = divyup(rawColor1);
  const color2 = divyup(rawColor2);
  return multiplyParsed(color1, color2);
}

function multiply(color1, color2) {
  return {
    red: multiplySingle(color1.red, color2.red),
    green: multiplySingle(color1.green, color2.green),
    blue: multiplySingle(color1.blue, color2.blue),
  };
}
function multiplyParsed(color1, color2) {
  return parseColor(multiply(color1, color2));
}

function multiplySingle(brightness1, brightness2) {
  return Math.round((brightness1/255)*(brightness2/255)*255)
}


function divyup(color) {
  const colorNumbers = color.replace("#", "");
  return {
    red: parseInt(colorNumbers.substr(0,2), 16),
    green: parseInt(colorNumbers.substr(2,2), 16),
    blue: parseInt(colorNumbers.substr(4,2), 16),
  }
}

function parseColor(diviedColor) {
  return `rgb(${diviedColor.red}, ${diviedColor.green}, ${diviedColor.blue})`
}

function hexToRgb(hex){
  return parseColor(divyup(hex))
}

function setVisibleOut(value, selector) {
  const outputNode = document.querySelector(selector);
  if(!outputNode) return;
  outputNode.innerText = hexToRgb(value);
  outputNode.setAttribute("style", `color: ${value}`)
}

function inverseColor(color) {
  return {
    red: Math.abs(color.red - 255),
    green: Math.abs(color.green - 255),
    blue: Math.abs(color.blue - 255),
  }
}
function screen(rawColor1, rawColor2) {
  const inverse1 = inverseColor(divyup(rawColor1));
  const inverse2 = inverseColor(divyup(rawColor2));
  const multiplied = multiply(inverse1, inverse2);
  return parseColor(inverseColor(multiplied));
}

function blendScreen() {
  const blendScreen = document.querySelector('#blendScreen')
  const form = blendScreen.querySelector('form');
  const {blenderValue, blendeeValue} = Object.values(form).reduce((obj,field) => { obj[field.name] = field.value; return obj }, {})
  const blenderNode = blendScreen.querySelector("#blenderScreen");
  const blendeeNode = blendScreen.querySelector("#blendeeScreen");
  blenderNode.setAttribute("style", `background-color: ${blenderValue}`);
  blendeeNode.setAttribute("style", `background-color: ${blendeeValue}`);
  const outputColor = screen(blenderValue, blendeeValue);
    const output = blendScreen.querySelector("output#screenOut");
    output.innerText = outputColor;
    output.setAttribute("style", `color: ${outputColor}`)
  return false;
}

function setBlendMode(value, query) {
  const nodes = document.querySelectorAll(query);
  if(!nodes) return;
  nodes.forEach(node => node.setAttribute('style', `mix-blend-mode: ${value};`))
  
}