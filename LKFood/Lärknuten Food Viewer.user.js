// ==UserScript==
// @name         Lärknuten Food Viewer
// @namespace    http://github.com/Malaxiz
// @version      2.0
// @description  Gets the food of the week and displays it on the scheme of Lärknuten
// @icon 		 https://i.imgur.com/0qsedYm.png
// @author       Didrik Munther
// @match        https://katrineholm.pingpong.se/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

myurl = "http://matsedel.katrineholm.se/default.aspx?restid=4";												// URL to download

GM_xmlhttpRequest ( {																						// Get the page, and then call function ParseHTML
    method:     'GET',
    url:        myurl,
    onload:     ParseHTML,
    onabort:    reportAJAX_Error,
    onerror:    reportAJAX_Error,
    ontimeout:  reportAJAX_Error
} );

function appendFoodToCalendar(foodList) {
    
    var weekName = document.getElementsByClassName('cal-month-name')[0].innerHTML;							// Name of the week we are viewing in the calendar
    var days = document.getElementsByClassName('cal-day');													// Get all the days of the week
    
    for (var i = 0; i < foodList.length; i++) {																// Loop through the list of meals to find if the week collide
        if (foodList[i].week.substring(0, 8) === weekName.substring(0, 8)) {								// If the current week and the week of the meals collide...
            for (var j = 0; j < days.length; j++) {															// Loop through all the days of the calendar
                food = foodList[i].food[j];																	// The current meals of the day
                for (var k = 0; k < food.length; k++) {														// Loop through all the meals of the day
                    food[k] = "<u>" + food[k].substring(0, 5) + "</u>" + food[k].substring(5, food[k].length); // Make underline at the beginning of the meal
                }
                days[j].innerHTML += "<font size=\"1\"><br><hr>" + food.join("<br>") + "</font><hr>";		// Append all the meals of this day to the calendar
            }
            break;
        }
    }
    
}

function ParseHTML(foodPage) {
    
    var el = document.createElement( 'div' );																// All this is for is to parse the text into a html element
    el.innerHTML = foodPage.responseText;
    var menuid = "";																			
    var allElements = el.getElementsByTagName("*");
    for (var i = 0, n = allElements.length; i < n; ++i) {
        var el2 = allElements[i];
        if (el2.id === "menu") { menuid = el2; break; }
    }
    
    var allFood = [];																						// List to hold all results
    var tableElements = menuid.getElementsByTagName("table");												// Get list of all weeks
    for (var table = 0, tableamount = tableElements.length; table < tableamount; ++table) {					// Loop through all weeks
        var week = tableElements[table].getElementsByTagName("h2")[1].innerHTML;							// Get the week
        
        var foodDayList = [];																				// List to hold all meals of the week
        var trElements = tableElements[table].getElementsByTagName("tr");						
        for (var tr = 1, trAmount = trElements.length; tr < trAmount; ++tr) {								// Loop through all meals. tr = 1 Because tr 1 holds the week
            //var date = trElements[tr].getElementsByTagName("td")[0].innerHTML.substring(0, 3);			// Get the day
            var meal = trElements[tr].getElementsByTagName("td")[1].innerHTML.split("<br>");				// Get the meal
            foodDayList.push(meal);																			// Push the meal into a list
        }
        
        var foodObject = {																					// Create an object that holds the meals of the week
            week:week,
            food:foodDayList
        };
        
        allFood.push(foodObject);																			// Push the food object into a bigger list
    }
    
    appendFoodToCalendar(allFood);																			// Call function to write the information to the calendar
}

function reportAJAX_Error (respObject) {																	// Incase something goes wrong when GETting the page
    alert("Error when GETting page: " + respObject);
}