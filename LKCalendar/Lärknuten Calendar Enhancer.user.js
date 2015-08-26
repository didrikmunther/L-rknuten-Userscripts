// ==UserScript==
// @name         Lärknuten Calendar Enhancer
// @namespace    http://github.com/Malaxiz
// @version      2.0
// @description  Enhances the calendar
// @icon		 https://i.imgur.com/Xa4Svs9.png
// @author       Didrik Munther
// @match        https://katrineholm.pingpong.se/*
// @grant        none
// ==/UserScript==

/*jshint sub:true*/																			// Ignore W069 warning

var loopInterval = 1000*1;																	// Set the loop interval
var oldLessons = 3;																			// Set the flag for coloring old lessons
																							// Flag: 0=normal, 1=45dStriped, 2=180dStriped, 3=darken
var minuteAlarm = [5, 2, 1];

var lessonColors = {}; 																	    // Set all the lessons' colors
lessonColors["DEFAULT"] = 	"White";
lessonColors["OLDLESSON"] = "lightgray";
lessonColors["MAT"] = 		'orange';
lessonColors["KEM"] = 		'yellow';
lessonColors["ENG"] = 		'lightblue';
lessonColors["Men"] = 		'red';
lessonColors["IDH"] = 		'lightgreen';
lessonColors["SAM"] = 		'#9E9E9E';
lessonColors["SVE"] = 		'pink';
lessonColors["TEK"] = 		'White';
lessonColors["DEU"] = 		'Lavender';
lessonColors["FYS"] = 		'SlateGray';
lessonColors["Fri"] = 		'#82A1AB';
lessonColors["PRR"] =       'yellow';

var LESSONTYPES = {
    NORMAL_LESSON : 0,
    ACTIVE_LESSON : 1,
    OLD_LESSON : 2
}

updateLoop();
var interval = setInterval(updateLoop, loopInterval); // Run script at an interval at loopinterval/1000 seconds

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
    lessonType = lesson.getElementsByClassName('schema-event-title')[0].firstChild.innerHTML.substr(28,3); // Get lesson type. E.g Math = MAT, Fysik = FYS
    if(!(lessonType in lessonColors)) {														// Check if lesson type is a key in lessonColors,
    	lessonType = "DEFAULT";																// otherwise asign it the default color white.
    }
    
    var styleAttrib = "";
    switch(flag) {
        case(LESSONTYPES.NORMAL_LESSON):
            styleAttrib = "background-color:" + lessonColors[lessonType] + ";cursor:pointer;";
            break;
        case(LESSONTYPES.ACTIVE_LESSON):
            styleAttrib = "background-image:-webkit-linear-gradient(bottom, #0f0 " + percent + "%, " + lessonColors["OLDLESSON"] + " 0%);"
            break;
        case(LESSONTYPES.OLD_LESSON):
            styleAttrib = "background-color:" + lessonColors["OLDLESSON"] + ";";
            break;
    }
    
    lesson.setAttribute("style",styleAttrib);											// Set the attribute to the lesson box.
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

        colorLessons(calObjects[i], LESSONTYPES.NORMAL_LESSON, 0); 		// Color all the different lessons

        var lectionActive = "";
        if(today > lectionDate2) { 														// #### If lesson is past current date
            colorLessons(calObjects[i], LESSONTYPES.OLD_LESSON, 0);		// Manage old lessons
        }
        else if(today > lectionDate1 && today < lectionDate2) { 						// #### If current date is colliding with lesson's date, then the lesson is active
            var timeLeft = lectionDate2 - today; 										// Get the time left of lesson
            timeLeftTime = getTime(timeLeft); 											// Convert time left of lesson to hours, minutes and seconds
            lectionActive += "<b>" + timeLeftTime[0] + "h, " + timeLeftTime[1] + "m " + timeLeftTime[2] + "s kvar </b>"; // Display time left of lesson
            colorLessons(calObjects[i], LESSONTYPES.ACTIVE_LESSON, 100 - ((today - lectionDate1) / (lectionDate2 - lectionDate1) * 100));	// Color the active lesson
            console.log("today: " + (today - lectionDate1));
            console.log("lectionDate2: " + (lectionDate2 - lectionDate1));
        }
        else {																			// #### Else the lesson is coming up
            var timeLeft = today - lectionDate2;
            timeLeftTime = getTime(-timeLeft - diff);									// Time until lesson starts
            timeUntilEnd = getTime(-timeLeft);											// Time until lesson ends
            if(timeLeftTime[0] === 0 &&
               //(timeLeftTime[1] <= minuteAlarm) &&
               (minuteAlarm.indexOf(timeLeftTime[1] + 1)) >= 0 &&
               (calObjects[i].getElementsByClassName("isAlerted")[0].id) !== "alerted" + timeLeftTime[1]) {
                alert(timeLeftTime[1] + 1 + " Minute Varning");
                console.log("Warned");
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