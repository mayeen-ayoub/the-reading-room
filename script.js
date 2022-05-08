var database = []; //array of dict

//finding currently read and filling shelves
const findCurrentRead = () => {
  var currentURL = [];
  var recentURL = [];
  var unreadURL = [];
  
  var currents = document.getElementsByClassName("currentBook");
  var recents = document.getElementsByClassName("readBook");
  var unread = document.getElementsByClassName("toReadBook");
    
  var currentRead;
  for (let i = 0; i < database.length; i++) {
    if (database[i].Bookshelves == "currently-reading") {
      currentURL.push(database[i].img);
      if (currentRead == null) {
        currentRead = "'" + database[i].Title + "'";
      }
    }
    else if (database[i].Bookshelves == "") {
      recentURL.push(database[i].img);
    }
    else if (database[i].Bookshelves == "to-read") {
      unreadURL.push(database[i].img);
    }
  }
  if (currentURL.length > 0) {
    if (currentURL.length < 5) {
      for (let i = 0; i < currentURL.length; i++) {
        currents[i].src = currentURL[i];
      }
    }
    else {
      for (let i = 0; i < 5; i++) {
        currents[i].src = currentURL[i];
      }
    }
    document.getElementById("currentlyReading").innerHTML = "Are you enjoying " + currentRead + "?";
  }
  else {
    document.getElementById("currentlyReading").innerHTML = "Ready to start reading?";
    document.getElementById("noBook").innerHTML = "What will be your next adventure?";
  }
  if (recentURL.length < 5) {
      for (let i = 0; i < recentURL.length; i++) {
        recents[i].src = recentURL[i];
      }
    }
    else {
      for (let i = 0; i < 5; i++) {
        recents[i].src = recentURL[i];
      }
    }
  if (unreadURL.length < 5) {
      for (let i = 0; i < unreadURL.length; i++) {
        unread[i].src = unreadURL[i];
      }
    }
    else {
      for (let i = 0; i < 5; i++) {
        unread[i].src = unreadURL[i];
      }
    }
}

//stats
function getStats() {
	let curReading = 0;
	let toRead = 0;
	let read = 0;
	let averageRating = 0;
	
	for (let book of database) {
		if (book.Bookshelves === "currently-reading") {
			curReading++;
		} else if (book.Bookshelves === "to-read") {
			toRead++;
		} else if (book.Bookshelves === "") {
			read++;
		}

		averageRating += parseFloat(book["Average Rating"]);
	}

	averageRating /= database.length;

	const ctx = document.getElementById('myChart');
	const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
		  labels: [
		    'Currently Reading',
		    'To Read',
		    'Read'
		  ],
		  datasets: [{
		    label: 'Reading Status',
		    data: [curReading, toRead, read],
		    backgroundColor: [
					'#eb8e38',
					'#6a6f5e',
					'#72574d',
		    ],
		    hoverOffset: 4
		  }]
		},
	});
}


/* + TIMER + */
const TIME_OPTION = {
	minute: '2-digit',
	second: '2-digit'
};
var interval = null;
var date = "";
var startTime = "";

const setTime = (time) => {
	date = (time === 60 ? new Date(`May 7, 2022 00:59:59`) : new Date(`May 7, 2022 00:${time}:00`));
	startTime = (time === 60 ? new Date(`May 7, 2022 00:59:59`) : new Date(`May 7, 2022 00:${time}:00`));
	document.getElementById("choose-time").classList.add("hidden");
	document.getElementById("cbtn").classList.remove("hidden");
	document.getElementById("timer").innerHTML = startTime.toLocaleTimeString('en-US', TIME_OPTION);
};

function countDown() {
	if (interval === null) {
		const timer = document.getElementById("timer");
		document.getElementById("timer-and-btns").classList.remove("hidden");
		timer.classList.remove("hidden");
		const countDownBtn = document.getElementById("count-down");
		countDownBtn.innerHTML = "Stop";
		
		interval = setInterval(() => {
			let seconds = date.getSeconds();
			date.setSeconds(seconds - 1);
			timer.innerHTML = date.toLocaleTimeString('en-US', TIME_OPTION);
		}, 1000);	
	} else {
		stopTimer();
	}
}

const stopTimer = () => {
	clearInterval(interval);
	interval = null;
	const countDownBtn = document.getElementById("count-down");
	countDownBtn.innerHTML = "Count Down";
}

const resetTimer = () => {
	stopTimer();
	const timer = document.getElementById("timer");
	timer.classList.add("hidden");
	timer.innerHTML = startTime.toLocaleTimeString('en-US', TIME_OPTION);
	date = startTime;
}
/* - TIMER - */

/* + SEARCH + */
//search for book
var results = {};
var query = "";

function searchBook() {
  event.preventDefault();
	query = document.getElementById("search").value;
  var covers = document.getElementsByClassName("coverImg");
  var titles = document.getElementsByClassName("title");
  var authors = document.getElementsByClassName("author");

  for (let i = 0; i < 10; i++) {
    covers[i].src = "";
    titles[i].innerHTML = "";
    authors[i].innerHTML = "";
  }
  
  if (query != null && query != "") { //query must not be empty
    document.getElementById("index-page").classList.add("hidden");
    document.getElementById("searchResults").classList.remove("hidden");
    document.getElementById("query").innerHTML = query;
    query = query.trim();
    query = query.replace(" ", "+");
		fetch("https://openlibrary.org/search.json?q=" + query)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        results = data;
        if (results.numFound == 0) {
          for (let i = 0; i < 10; i++) {
            covers[i].src = "";
          }
        }
        else if (results.numFound <= 10) {
          for (let i = 0; i < results.numFound; i++) {
            if (results.docs[i].isbn == null) {
              covers[i].src = 'https://www.uoduckstore.com/TDS%20Product%20Images/Barchart%20Microeconomics_1.jpg?resizeid=3&resizeh=195&resizew=195';
            }
            else {
							covers[i].src = "https://covers.openlibrary.org/b/isbn/" + results.docs[i].isbn[0] + "-L.jpg"; 	
            }
            titles[i].innerHTML = results.docs[i].title;
            authors[i].innerHTML = results.docs[i].author_name;
          }
        }
        else {
          for (let i = 0; i < 10; i++) {
            if (results.docs[i].isbn == null) {
              covers[i].src = 'https://www.uoduckstore.com/TDS%20Product%20Images/Barchart%20Microeconomics_1.jpg?resizeid=3&resizeh=195&resizew=195';
            }
            else {
             covers[i].src = "https://covers.openlibrary.org/b/isbn/" + results.docs[i].isbn[0] + "-L.jpg"; 
            }
            titles[i].innerHTML = results.docs[i].title;
            authors[i].innerHTML = results.docs[i].author_name;
          }
        }
      });
  }
}

/* - SEARCH - */

//still createElemento implement an upload file function to change file url
window.onload = function(){
	if (database.length === 0) {
		var csvFile = new XMLHttpRequest();
	  csvFile.open("GET", "./library/goodreads_library_export.csv", false);
	  csvFile.onreadystatechange = function () {
	    if(csvFile.readyState === 4) {
	      if(csvFile.status === 200 || csvFile.status == 0) {
	        var allText = csvFile.responseText;
	        var lines = allText.split("\n");
	        var categories = lines[0].split(",");
	        
	        for (var i = 1; i < lines.length - 1; i++) {
	          const info = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
	          
	          var dict = {};
	          for (var j = 0; j < categories.length; j++) {
	           	if (categories[j] === "ISBN") {
								var numberPattern = /\d+/g;
								const isbn = info[j].match(numberPattern);
								if (isbn != null) {
									dict[categories[j]] = isbn[0];
								} else {
									dict[categories[j]] = null;
								}
							} else {
								dict[categories[j]] = info[j];	
							}
	          }
						if (dict.ISBN === null || dict.ISBN.length < 10) {
							dict.img = 'https://www.uoduckstore.com/TDS%20Product%20Images/Barchart%20Microeconomics_1.jpg?resizeid=3&resizeh=195&resizew=195';
						} else {
							dict.img = `https://covers.openlibrary.org/b/isbn/${dict.ISBN}-L.jpg`;	
						}
	          database.push(dict);
	        }
          
					const pageId = document.getElementsByTagName("body")[0].id;
					if (pageId === "index") {
						findCurrentRead();
						const searchBtn = document.getElementById("search-btn");	
						searchBtn.onclick = searchBook;
						getStats();
					} else if (pageId === "reading-timer") {
						let time = 0;
						document.getElementById("15").onclick = () => setTime(15);
						document.getElementById("30").onclick = () => setTime(30);
						document.getElementById("60").onclick = () => setTime(60);
						
						document.getElementById("count-down").onclick = countDown;
						
						
						document.getElementById("reset").onclick = resetTimer;
						document.getElementById("back").onclick = () => {
							resetTimer();
							document.getElementById("choose-time").classList.remove("hidden");
							document.getElementById("timer-and-btns").classList.add("hidden");
							document.getElementById("cbtn").classList.add("hidden");
						};
					}
	      }
	    }
	  }
		csvFile.send(null);
	}
}

