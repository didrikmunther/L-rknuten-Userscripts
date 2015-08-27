// ==UserScript==
// @name         Lärknuten Calendar Enhancer Includer
// @namespace    http://github.com/Malaxiz
// @version      2.1
// @description  Enhances the calendar
// @icon		 https://i.imgur.com/Xa4Svs9.png
// @author       Didrik Munther KTC-TE14
// @match        https://katrineholm.pingpong.se/*
// @grant        none
// ==/UserScript==

var elem = document.createElement('script');
elem.setAttribute('src', 'https://cdn.rawgit.com/Malaxiz/L-rknuten-Userscripts/master/LKCalendar/L%C3%A4rknuten%20Calendar%20Enhancer.user.js');
elem.setAttribute('type', 'text/javascript');
document.getElementsByTagName('body')[0].appendChild(elem);

document.getElementsByTagName('body')[0].setAttribute('style', 'display:none;');