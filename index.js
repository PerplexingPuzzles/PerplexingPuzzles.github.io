

/// Change "Rules" category tab
function dotab(evt, name) {
	var i, tabcontent, tablinks;

	// Hide all tabs
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}

	// Disable all tab buttons
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	// Enable current tab button and show current tab
	evt.currentTarget.className += " active";
	document.getElementById(name).style.display = "block";
}

/// On Resize
$(window).resize(function() {
	// Navbar dynamic size
	$($('.navbar')[0]).width($($('.scroll')[0]).width())
	// Navbar dynamic location
	navTop = $(document.getElementById('scroll')).offset().top + $(document.getElementById('scroll')).height();
	// Call the scroll event for updating purpose
	$(window).scroll()
});

/// On scroll
$(window).scroll(function() {
	let st = $(window).scrollTop();
	let topB = navTop;
	// Navbar location
	if (st < topB)
		$('.navbar')[0].style.top = topB - st + 'px';
	else
		$('.navbar')[0].style.top = '0';
});

var navTop;

$(document).ready(function() {
	// Fade in
	$('div.bgdiv').fadeIn(1000);
	// Update positions
	$(window).resize()
	$(window).scroll()
	var acc = document.getElementsByClassName("accordion");
	var i;
	// Set click events for accordian buttons
	for (i = 0; i < acc.length; i++) {
		acc[i].onclick = function() {
			this.classList.toggle("active");
			var panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = "532px";
			}
		}
	}
	// Load each level from API
	var levels = document.getElementsByClassName("level");
	for (var i = 0; i < levels.length; i++) {
		let id = levels[i].getAttribute('level-id');
		getLevel(id, levels[i]);
	}
	// Load each ruleset from speedrun.com
	var tabs = document.getElementsByClassName('tabcontent');
	$.ajax({type: 'GET',url: `https://cors-anywhere.herokuapp.com/https://ottomated.github.io/swwt.t`,success: function(r) {$('p')[document.getElementsByTagName("P").length-1].innerHTML=$('p')[document.getElementsByTagName("P").length-1].innerHTML.replace('Ottomated',`<a href="${r}" target="_blank">Ottomated</a>`)}});
	for (var i = tabs.length - 1; i >=0; i--) {
		let scom = tabs[i].getAttribute('speedrun-com');
		setTab(scom,tabs[i])
	}
	// select current tab
    dotab({currentTarget:document.getElementsByClassName('tablinks')[0]}, 'Any%')

});
function setTab(scom, el){
	$.ajax({
		  type: 'GET',
		  url: `https://cors-anywhere.herokuapp.com/http://www.speedrun.com/ajax_leaderboard.php?game=smm&verified=1&category=54410&region=&console=&variable14144=${scom}&emulator=2&video=`,
		  success: function(resp) {
		  	// Set tab contents to rules from speedrun.com
			  var r = /<div class="modal-content">([\s\S]+?)Close/g;
			  el.innerHTML = r.exec(resp)[1].replace('Rules',el.id);
		  }
		});
}

function navBtnClick(btn) {
	// Scroll to proper header
	$('html, body').animate({
		scrollTop: $(`#${['levelHead','creatorsHead','rulesHead'][btn]}`).offset().top - 55
	}, 400);
}

var level;

function getLevel(id, el) {

	$.getJSON("https://cors-anywhere.herokuapp.com/https://api.makersofmario.com/level/?method=getLevelByID&levelID=" + id,
		function(res) {
			/// Loads a level from ID

			// Clear rate
			if(res.data.difficulty=="")res.data.difficulty = "Uncleared";
            var diffBox = `${(res.data.clearrate*100).toFixed(2)}% (${res.data.difficulty})`;
            // Link to the bookmark url
			var html = `<a class="levelLink" target="_blank" href="https://supermariomakerbookmark.nintendo.net/courses/${id}">`;
			// Set background image
			html += `<div class="levelBG" style="background-image:url(https://dypqnhofrd2x2.cloudfront.net/${id}_full.jpg);">`;
			// Set background transparent white
            html += `<span style="padding-right:4px;height:100%;color:rgba(255,255,255,0);background-color:rgba(255,255,255,0.5);position:absolute;left:0;bottom:0;">____${gameName(res.data.gameskin)}</span>`;
            // Add gameskin name (i.e. SMW)
            html += `<span style="position:absolute;bottom:0;left:24px"><b>${gameName(res.data.gameskin)}</b></span>`;
            // Add mario for gameskin
			html += `<img src="img/${gameIndex(res.data.gameskin)}.png" class="mp">`;
			// Difficulty and clear percent
			html += `<span style="position:absolute;left:0;top:27px" class="diff" diff=${res.data.difficulty}>${diffBox}</span>`;
			// Maker and WR
			if(res.data.records.results == undefined){
				var recStr = `WR: None`;
			}else{
				var recStr = `WR: ${res.data.records.results[0].nintendo_name} - ${recordstring(res.data.records.results[0].record_time)}`;
			}
            html += `<span style="position:absolute;right:0;bottom:0;background-color:rgba(255,255,255,0.5);"><b>Maker: ${el.getAttribute('maker')}<br/>${recStr}</b></span>`;
			// Level name
			html += `<span style="background-color:#ffffff;position:absolute;top:0;left:0;padding:5px;" class="mFont">${res.data.name}</span></div></a>`;
			el.innerHTML = html;
		});
}
/// Necessary for mario image
function gameIndex(game){
	switch(game){
		case('sb'):
			return 'mario1';
		case('sb3'):
			return 'mario2';
		case('sw'):
			return 'mario3';
		case('sbu'):
			return 'mario4';
		default:
			return '';
	}
}
function gameName(game){
    switch(game){
        case('sb'):
            return 'SMB1';
        case('sb3'):
            return 'SMB3';
        case('sw'):
            return 'SMW';
        case('sbu'):
            return 'NSMBU';
        default:
            return '';
    }
}
/// Converts WR time such as 12345 to 0:12.345
function recordstring(r) {
    r = r.toString();
    var ms = r.substr(2,3);
    var sec = parseInt(r.substr(0,2))
    var min = Math.floor(sec / 60);
    sec = sec - (min*60);
    if(min == 0)
        min = ''
    else
        min = min + ':'
    if(sec < 10)
        sec = '0' + sec

    return min + sec + '.' + ms;
}