// ==UserScript==
// @name         Lärknuten week displayer
// @namespace    http://github.com/Malaxiz
// @version      0.2
// @description  Gets the week and displays it in the header of Lärknuten
// @author       Didrik Munther KTC-TE14
// @match        https://katrineholm.pingpong.se/*
// @grant        none
// ==/UserScript==

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
}

var idArea = document.getElementById("identification-area");

var week = "Vecka: " + (new Date()).getWeekNumber();
var weekElem = document.createElement("h1");
weekElem.innerHTML = week;
weekElem.setAttribute("style","margin:25px;");

idArea.appendChild(weekElem);