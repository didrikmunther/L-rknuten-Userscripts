// ==UserScript==
// @name         Lärknuten Calendar Enhancer
// @namespace    http://github.com/Malaxiz
// @version      3.2.4
// @updateURL    https://github.com/Malaxiz/L-rknuten-Userscripts/raw/master/LKCalendar/L%C3%A4rknuten%20Calendar%20Enhancer.user.js
// @description  Enhances the calendar
// @icon		 https://i.imgur.com/Xa4Svs9.png
// @author       Didrik Munther KTC-TE14
// @match        https://katrineholm.pingpong.se/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==

/*jshint sub:true*/																			// Ignore W069 warning

var loopInterval = 1000*1;																	// Set the loop interval

var minuteAlarm = [5, 2, 1];

var lessonColors = {}; 																	    // Set all the lessons' colors
lessonColors["DEFAULT"] = 	"White";
lessonColors["OLDLESSON"] = "lightgray";

var styleWhenImage = 'color:white;background-size:100% 100%;background-repeat:no-repeat;text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;'

var LESSONTYPES = {
    NORMAL_LESSON : 0,
    ACTIVE_LESSON : 1,
    OLD_LESSON : 2
}

var cfg = JSON.parse('{}');
var cfgSavePath = 'lce-gmSave';

init();
updateLoop();
var interval = setInterval(updateLoop, loopInterval); // Run script at an interval at loopinterval/1000 seconds


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function updateCfg() {
    cfg = JSON.parse(GM_getValue(cfgSavePath));
}

function saveLessonSettings(lessonSettings) {
    var lessonName = lessonSettings.parentElement.getElementsByClassName('schema-event-title')[0].firstChild.innerHTML.substr(28,3);
    var settings = JSON.parse('{}');

    settings.background = JSON.parse('{}');
    settings.background.backgroundData = lessonSettings.getElementsByClassName('backgroundData')[0].value;
    settings.background.imageToggle = lessonSettings.getElementsByClassName('imageToggle')[0].checked == true ? 1 : 0;
    settings.font = JSON.parse('{}');
    settings.font.fontColor = lessonSettings.getElementsByClassName('fontColor')[0].value;
    
    var gsettingsString = GM_getValue(cfgSavePath);
    if(gsettingsString === undefined || gsettingsString === '') {
        gsettingsString = '{}';
    }
    var gsettings = JSON.parse(gsettingsString);
    gsettings[lessonName] = settings;
    GM_setValue(cfgSavePath, JSON.stringify(gsettings));
    
    updateCfg();
    
}

function loadGlobalSettings(settingsElem) {
    if(settingsElem.parentElement.getElementsByClassName('lesson-setting').length === 0) {
        var settings = document.createElement('div');
        settings.setAttribute('style', 'z-index:2;background-color:#f0f0f0;position:absolute;padding:5px;border:1px solid #aaa;');
        settings.setAttribute('class', 'lesson-setting');
        settings.innerHTML = '<u><h3 style="margin:0;">Global settings for Lärknuten Calendar Enhancer</h3></u><br>';
        
        var backupButton = document.createElement('button');
        backupButton.innerHTML = 'Backup settings';
        backupButton.onclick = function() {
            alert(JSON.stringify(cfg));
        }
        settings.appendChild(backupButton);
        
        var loadBackupButton = document.createElement('button');
        loadBackupButton.innerHTML = 'Load backup settings';
        loadBackupButton.onclick = function() {
            var backup = prompt('Put the backed up string in the box below.');
            if(IsJsonString(backup) && backup != null) {
                cfg = JSON.parse(backup);
                GM_setValue(cfgSavePath, JSON.stringify(cfg));
            } else {
                alert('Not a valid json string!');
            }
        }
        settings.appendChild(loadBackupButton);
        
        var clearCacheButton = document.createElement('button');
        clearCacheButton.setAttribute('style', 'color:red;');
        clearCacheButton.innerHTML = 'Clear settings';
        clearCacheButton.onclick = function() {
            if(confirm('Are you really, really, really sure?')) {
                //cfg = JSON.parse('{}');
                //GM_setValue(cfgSavePath, JSON.stringify(cfg));
                GM_deleteValue(cfgSavePath);
                location.reload();
            }
        }
        settings.appendChild(clearCacheButton);
        
        var aboutButton = document.createElement('button');
        aboutButton.innerHTML = 'About this script';
        aboutButton.onclick = function() {
            var aboutPage = document.createElement('div');
            aboutPage.setAttribute('style', 'text-align:center;border:1px solid #aaa;padding:1em;position:fixed;top:25%;left:0;right:0;margin:5% auto;background-color:#dcdcdc;');
            aboutPage.innerHTML = '<u><h3>About Lärknuten Calendar Enhancer</h3></u> <br> <h4>Created by: Didrik Munther<br>Script page: <a href="https://github.com/Malaxiz/L-rknuten-Userscripts" target="_blank">https://github.com/Malaxiz/L-rknuten-Userscripts</a></h4>';
            aboutPage.onclick = function() {
                this.remove();
            }
            settings.appendChild(aboutPage);
        }
        settings.appendChild(aboutButton);
        
        var saveButton = document.createElement('button');
        saveButton.innerHTML = 'Close';
        saveButton.setAttribute('style', 'float:right;clear:both;margin-top:20px;');
        saveButton.onclick = function() {
            
            this.parentElement.remove();
        }
        settings.appendChild(saveButton);
        
        settingsElem.parentElement.insertBefore(settings, settingsElem.parentElement.childNodes[1]);
    }
}

function loadLessonSettings(settingsElem) {
    if(settingsElem.parentElement.getElementsByClassName('lesson-setting').length === 0) {
        var lessonName = settingsElem.parentElement.getElementsByClassName('schema-event-title')[0].firstChild.innerHTML.substr(28,3);
        var lessonSettings = document.createElement('div');
        lessonSettings.setAttribute('style', 'z-index:1;text-shadow:none;color:black;background-color:#f0f0f0;position:absolute;padding:5px;border:1px solid #aaa;');
        lessonSettings.setAttribute('class', 'lesson-setting');

        lessonSettings.innerHTML = '<u><h3 style="margin:0;">Settings for ' + lessonName + '</h3></u><br>';

        var settingsString = GM_getValue(cfgSavePath);
        if(settingsString === undefined || settingsString === '') {
            var settingsString = '{}';
        }
        var gsettings = JSON.parse(settingsString);
        var settings = gsettings[lessonName];
        if(settings === undefined) {
            settings = JSON.parse('{}');
        }

        if(settings.background === undefined) {
            settings.background = JSON.parse('{"imageToggle": 0, "backgroundData": "white"}');
        }
        
        var backgroundData = document.createElement('input');
        backgroundData.setAttribute('class', 'backgroundData');
        backgroundData.setAttribute('style', 'width:100px;height:20px;');
        backgroundData.setAttribute('value', JSON.stringify(settings.background.backgroundData).substring(1).slice(0, -1));
        var imageToggle = document.createElement('input');
        imageToggle.setAttribute('class', 'imageToggle');
        imageToggle.setAttribute('type', 'checkbox');
        if(JSON.stringify(settings.background.imageToggle) == 1) {
            imageToggle.setAttribute('checked', true);
        }
        lessonSettings.innerHTML += 'Background: ';
        lessonSettings.appendChild(backgroundData);
        lessonSettings.innerHTML += ' Is image: ';
        lessonSettings.appendChild(imageToggle);
        lessonSettings.innerHTML += '<br>';
        
        if(settings.font === undefined) {
            settings.font = JSON.parse('{"fontColor":"black"}');
        }
        var fontColor = document.createElement('input');
        fontColor.setAttribute('class', 'fontColor');
        fontColor.setAttribute('style', 'width:100px;height:20px;');
        fontColor.setAttribute('value', JSON.stringify(settings.font.fontColor).substring(1).slice(0, -1));
        lessonSettings.innerHTML += 'Font-color: ';
        lessonSettings.appendChild(fontColor);
        lessonSettings.innerHTML += '<br>';
        
        
        
        var saveButton = document.createElement('button');
        saveButton.innerHTML = 'Save';
        saveButton.setAttribute('style', 'float:right;');
        saveButton.setAttribute('class', 'save-button');
        saveButton.onclick = function() {
            saveLessonSettings(lessonSettings);
            this.parentElement.remove();
        }
        lessonSettings.appendChild(saveButton);

        settingsElem.parentElement.insertBefore(lessonSettings, settingsElem.parentElement.childNodes[1]);
    }
}

function init() {
    
    if(GM_getValue(cfgSavePath) === undefined) {
        GM_setValue(cfgSavePath, '{}')
    }
    
    cfg = JSON.parse(GM_getValue(cfgSavePath));
    
    var calObjects = document.querySelectorAll('.cal-day-item, .cal-day-item-inside');
    
    for(var i = 0; i < calObjects.length; i++) {
        
        var lesson = calObjects[i];
        
        var tempElem = document.createElement('div');
        tempElem.setAttribute('style', 'opacity:0.2;width:30px;height:30px;background-size:100% 100%;background-image:url(\'https://i.imgur.com/qhPpqRZ.png\');position:absolute;');
        tempElem.onmouseover = function() {
            this.style.opacity = 1.0;
        }
        tempElem.onmouseout = function() {
            this.style.opacity = 0.2;
        }
        tempElem.onclick = function() {
            loadLessonSettings(this);
        }
        
        lesson.onclick = undefined;
        lesson.style.cursor = 'none';
        lesson.insertBefore(tempElem, lesson.firstChild);
        
        tempElem.click();
        lesson.getElementsByClassName('lesson-setting')[0].getElementsByClassName('save-button')[0].click();
        
    }
    
    var th = document.getElementsByClassName('table-view')[0].getElementsByTagName('thead')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[0];
    var settingsElem = document.createElement('div');
    settingsElem.setAttribute('style', 'opacity:0.3;width:38px;height:38px;background-size:100% 100%;background-image:url(\'https://i.imgur.com/qhPpqRZ.png\');position:absolute;');
    settingsElem.onmouseover = function() {
        this.style.opacity = 1.0;
    }
    settingsElem.onmouseout = function() {
        this.style.opacity = 0.3;
    }
    settingsElem.onclick = function() {
        loadGlobalSettings(this);
    }
    th.appendChild(settingsElem);
}

function getTime(msec) {
    var h = Math.floor(msec / 1000 / 60 / 60);
    msec -= h * 1000 * 60 * 60;
    var m = Math.floor(msec / 1000 / 60);
    msec -= m * 1000 * 60;
    var s = Math.floor(msec / 1000);
    msec -= s * 1000;
    
    arr = [h, m, s];
    
    return arr;
}

function getDate(year, month, day, hour, minute) {
    var date = new Date(year, month - 1, day, hour, minute); // Months are 0-based
    return(date);
}

function colorLessons(lesson, flag, percent) {
    var lessonName = lesson.getElementsByClassName('schema-event-title')[0].firstChild.innerHTML.substr(28,3); // Get lesson type. E.g Math = MAT, Fysik = FYS
    
    var lessonCfg = cfg[lessonName];
    if(lessonCfg === undefined) {
        return;
    }
    
    var styleAttrib = "";
    
    // Remember this one: .substring(1).slice(0, -1)
    
    switch(flag) {
        case(LESSONTYPES.NORMAL_LESSON):
            if(JSON.stringify(lessonCfg.background.imageToggle) == 1) {
                styleAttrib += "background-image:url(" + JSON.stringify(lessonCfg.background.backgroundData).substring(1).slice(0, -1) + ");";
                styleAttrib += styleWhenImage;
            } else {
                styleAttrib += "background-color:" + JSON.stringify(lessonCfg.background.backgroundData).substring(1).slice(0, -1) + ";";
            }
            styleAttrib += 'color:' + JSON.stringify(lessonCfg.font.fontColor).substring(1).slice(0, -1) + ';';
            break;
            
        case(LESSONTYPES.ACTIVE_LESSON):
            styleAttrib += "background-image:-webkit-linear-gradient(bottom, #0f0 " + percent + "%, " + lessonColors["OLDLESSON"] + " 0%);position:relative;padding:8px;"
            break;
        case(LESSONTYPES.OLD_LESSON):
            styleAttrib += "background-color:" + lessonColors["OLDLESSON"] + ";";
            break;
    }
    
    lesson.setAttribute("style", styleAttrib);	// Set the attribute to the lesson box.
    
}

function updateLoop() {																    // Main Loop
    
    var today = Date.now(); 														    // Get current date
    //var today = new Date("August 25, 2015 13:30:00"); 							    // Test script with a forced date
    var todayTime = getTime(today); 												    // Convert it to an array with [hours, minutes, seconds]

    var calObjects = document.querySelectorAll('.cal-day-item, .cal-day-item-inside');  // Get all lessons
    
    for(var i = 0; i < calObjects.length; i++) {										// Loop through all lessons
        var calObject = calObjects[i].getElementsByClassName('date')[0].innerHTML; 		// Get lesson time

        if(calObjects[i].getElementsByClassName("isAlerted").length < 1) {				// #### If there is not an object with the class name isAlerted
            var newElement = document.createElement("img");								// Create the object. For checking later if the player has been alerted.
            newElement.className = "isAlerted";
            newElement.id = "notAlerted";
            calObjects[i].appendChild(newElement);
        }

        var strHour1 = calObject.charAt(0) + calObject.charAt(1); 						// Get starting hour and minute
        var hour1 = parseInt(strHour1);
        var strMinute1 = calObject.charAt(3) + calObject.charAt(4);
        var minute1 = parseInt(strMinute1);

        var strHour2 = calObject.charAt(6) + calObject.charAt(7); 						// Get lesson's end hour and minute
        var hour2 = parseInt(strHour2);
        var strMinute2 = calObject.charAt(9) + calObject.charAt(10);
        var minute2 = parseInt(strMinute2);

        var onclickVar = calObjects[i].getAttribute("onclick"); 						// Get lesson's date
        var lectionDates = onclickVar.substr(111, 16);									// Find the date information in the onclick attribute
        var year = lectionDates.substr(0,4);
        var month = lectionDates.substr(5,2);
        var day = lectionDates.substr(8,2);
        var lectionDate1 = getDate(year, month, day, hour1, minute1); 					// Create date for the lessons
        var lectionDate2 = getDate(year, month, day, hour2, minute2);                   // lectionDate1 = starttime, lectionDate2 = endtime

        var diff = lectionDate2 - lectionDate1; 										// Get lesson's duration
        var diffTime = getTime(diff);

        colorLessons(calObjects[i], LESSONTYPES.NORMAL_LESSON, 0); 		                // Color all the different lessons

        var lectionActive = "";
        if(today > lectionDate2) { 														// #### If lesson is past current date
            colorLessons(calObjects[i], LESSONTYPES.OLD_LESSON, 0);		                // Manage old lessons
        }
        else if(today > lectionDate1 && today < lectionDate2) { 						// #### If current date is colliding with lesson's date, then the lesson is active
            var timeLeft = lectionDate2 - today; 										// Get the time left of lesson
            timeLeftTime = getTime(timeLeft); 											// Convert time left of lesson to hours, minutes and seconds
            lectionActive += "<b>" + timeLeftTime[0] + "h, " + timeLeftTime[1] + "m " + timeLeftTime[2] + "s kvar </b>"; // Display time left of lesson
            colorLessons(calObjects[i], LESSONTYPES.ACTIVE_LESSON, 100 - ((today - lectionDate1) / (lectionDate2 - lectionDate1) * 100));	// Color the active lesson
        }
        else {																			// #### Else the lesson is coming up
            var timeLeft = today - lectionDate2;
            timeLeftTime = getTime(-timeLeft - diff);									// Time until lesson starts
            timeUntilEnd = getTime(-timeLeft);											// Time until lesson ends
            if(timeLeftTime[0] === 0 &&
               (minuteAlarm.indexOf(timeLeftTime[1] + 1)) >= 0 &&
               (calObjects[i].getElementsByClassName("isAlerted")[0].id) !== "alerted" + timeLeftTime[1]) {
                alert(timeLeftTime[1] + 1 + " Minute Varning");
                calObjects[i].getElementsByClassName("isAlerted")[0].id = "alerted" + timeLeftTime[1];
            }
            lectionActive += "<font size=\"1\"><i> Om " + timeLeftTime[0] + "h, " + timeLeftTime[1] + "m " + timeLeftTime[2] + "s <span style=\"opacity: 0.5\">- " + timeUntilEnd[0] + "h, " + timeUntilEnd[1] + "m " + timeUntilEnd[2] + "s </span></i></font>"; // Display the time until lesson start
        }

        var showTime = strHour1 + "." + strMinute1 + "-" + strHour2 + "." + strMinute2; // Create string for lesson date
        var stringDate = " (" + diffTime[0] + "h, " + diffTime[1] + "m)"; 				// Create user-friendly string for displaying how long lesson is
        var toShow = showTime + stringDate; 											// Concatenate the two strings
        calObjects[i].getElementsByClassName('date')[0].innerHTML = toShow; 			// Show the time information

        var temp = calObjects[i].getElementsByClassName('schema-event-location-and-bookings')[0].firstChild; // Save the lesson room information
        calObjects[i].getElementsByClassName('schema-event-location-and-bookings')[0].innerHTML = temp.outerHTML + "<br>" + lectionActive; // Remove the technical name for the room and replace it with lesson time left
    }
}