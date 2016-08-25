// ==UserScript==
// @name         Lärknuten Läxhjälpsborttagare
// @namespace    https://github.com/malaxiz
// @version      0.1
// @description  Ta bort läxhjälpslektionerna
// @author       Malaxiz Wayne
// @match        https://katrineholm.pingpong.se/*
// @grant        none
// ==/UserScript==

/*jshint sub:true*/
//'use strict';

items = document.querySelectorAll('.cal-day-item-inside, .table-view-cell-left-inside, .table-view-cell-inside');

for(var i = 0; i < items.length; i++) {
    items[i].remove();
}

document.getElementsByClassName('table-view-cell-left')[3].colSpan = 1;