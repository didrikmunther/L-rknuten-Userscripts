// ==UserScript==
// @name         Reddit Top Comment Scroller
// @namespace    http://github.com/Malaxiz
// @version      0.3.5
// @description  Allows you to scroll through reddit fast
// @author       Didrik Munther
// @match        *://*.reddit.com/r/*/comments/*
// @grant        none
// ==/UserScript==

var margin = 15;

var topComments = [];

var parents = document.getElementsByClassName("parent");
for(var i = 0; i < parents.length; i++) {
    var parent = parents[i].parentNode;
    for(var j = 0; j < 5; j++) {
        parent = parent.parentNode;
    }
    if(parent.tagName == "HTML") {
        topComments.push(parents[i]);
    }
}

var buttonContainer = document.createElement("div");
buttonContainer.setAttribute("style","position:fixed;top:0;left:0;z-index:999;width:100%;height:23px;pointer-events:none;");

var buttonUp = document.createElement("button");
buttonUp.setAttribute("style","width:50px;height:50px;float:right;clear:both;margin-right:5px;margin-top:5px;background-color:gray;outline:0;pointer-events:auto;");
buttonUp.setAttribute("id","buttonup");
buttonContainer.appendChild(buttonUp);

var buttonDown = document.createElement("button");
buttonDown.setAttribute("style","width:50px;height:50px;float:right;clear:both;margin-right:5px;margin-top:5px;background-color:gray;outline:0;pointer-events:auto;");
buttonDown.setAttribute("id","buttondown");
buttonContainer.appendChild(buttonDown);

buttonUp.onclick = function() {
    scrollUp();
}
buttonDown.onclick = function() {
    scrollDown();
}

document.getElementsByTagName("body")[0].appendChild(buttonContainer);

document.getScroll = function(){
 if(window.pageYOffset!= undefined){
  return [pageXOffset, pageYOffset];
 }
 else{
  var sx, sy, d= document, r= d.documentElement, b= d.body;
  sx= r.scrollLeft || b.scrollLeft || 0;
  sy= r.scrollTop || b.scrollTop || 0;
  return [sx, sy];
 }
}

var getHeight = function(elem) {
    var offsetTop = 0;
    do {
      if ( !isNaN( elem.offsetTop ) )
      {
          offsetTop += elem.offsetTop;
      }
    } while( elem = elem.offsetParent );
    return offsetTop;
}

var checkClosestParent = function() {
    var closestNumber = 100000;
    var closestElementIndex = 0;
    var isZero = false;
    for(var i = 0; i < topComments.length; i++) {
        //console.log(getHeight(topComments[i]) - document.getScroll()[1])
        if(Math.abs(getHeight(topComments[i]) - document.getScroll()[1]) < closestNumber) {
            closestNumber = Math.abs(getHeight(topComments[i]) - document.getScroll()[1]);
            closestElementIndex = i;
            isZero = closestNumber === margin;
            //console.log(Math.abs(getHeight(topComments[i]) - document.getScroll()[1]), i)
        }
    }
    //console.log(closestNumber)
    return [closestElementIndex, isZero];
}

var scrollUp = function() {
    if(checkClosestParent()[0] === 0) {
        window.scrollTo(0, 0);
        return;
    }
    var closest = checkClosestParent();
    if(closest[1])
        var element = topComments[closest[0] - 1];
    else
        var element = topComments[closest[0]];
    window.scrollTo(0, getHeight(element) - margin);
}

var scrollDown = function() {
    var closest = checkClosestParent();
    if(closest[1])
        var element = topComments[closest[0] + 1];
    else
        var element = topComments[closest[0]];
    window.scrollTo(0, getHeight(element) - margin);
}

window.onload = function() {     
    buttonUp.onclick = function() {
        scrollUp();
    }
    buttonDown.onclick = function() {
        scrollDown();
    }
}
