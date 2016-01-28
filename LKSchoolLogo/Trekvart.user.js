// ==UserScript==
// @name         Trekvart
// @namespace    https://github.com/malaxiz
// @version      0.1
// @description  Weed
// @author       You
// @match        https://katrineholm.pingpong.se/*
// @grant        none
// ==/UserScript==

/* jshint -W097 */
'use strict';

var url = 'https://i.imgur.com/wyNSbUm.png';

var imgContainer = document.getElementById('portlet-GroupImages');
var img = imgContainer.firstChild;

img.src = url;