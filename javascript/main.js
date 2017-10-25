// 1. Search

var UI = {};

UI.submitClick = function(){
	document.querySelector(".js-submit").addEventListener('click', function(){
		var artist = document.getElementsByClassName("js-search")[0].value;
		UI.refreshPage();
		SoundCloudAPI.getTrack(artist);
	});

};

UI.submitClick();

UI.enterPress = function(){
	document.querySelector(".js-search").addEventListener('keyup', function(e){
		var artist = document.getElementsByClassName("js-search")[0].value;

		// if the key ENTER is pressed......
		if (e.which === 13) {
			UI.refreshPage();
			SoundCloudAPI.getTrack(artist);
		};

	});
};

UI.enterPress();

//Refreshes the search results
UI.refreshPage = function(){
	document.querySelector(".js-search-results").innerHTML = "";
};

// Resets the playlist
UI.resetPlaylist = function(){
	document.querySelector(".reset-playlist").addEventListener('click', function(){
		document.querySelector(".js-playlist").innerHTML = "";
		localStorage.clear();
	});
};

UI.resetPlaylist();

//Clears the search results
UI.clearResults = function(){
	document.querySelector(".clear-results").addEventListener('click', function(){
		UI.refreshPage();
	});
};

UI.clearResults();


// 2. Query SounCloud API


var SoundCloudAPI = {};

SoundCloudAPI.init = function() {
	SC.initialize({
	  client_id: '195d273fb18f4a9a75ebda65c1aa2631'
	});
}

SoundCloudAPI.init();

SoundCloudAPI.getTrack = function(inputValue) {
	// find all sounds of buskers licensed under 'creative commons share alike'
	SC.get('/tracks', {
	  q: inputValue
	}).then(function(tracks) {
	  console.log(tracks);
	  SoundCloudAPI.renderTracks(tracks);
	});
}


// 3. Display the cards
SoundCloudAPI.renderTracks = function(tracks){

	tracks.forEach(function(track){

		//card
		var card = document.createElement('div');
		card.classList.add('card');

		//image
		var imageDiv = document.createElement('div');
		imageDiv.classList.add('image');

		var image_img = document.createElement('img');
		image_img.classList.add('image_img');
		image_img.src = track.artwork_url || 'http://lorempixel.com/output/nightlife-q-c-640-633-5.jpg';
		

		//content
		var content = document.createElement('div');
		content.classList.add("content");

		//header
		var header = document.createElement('div');
		header.classList.add('header');
		header.innerHTML = '<a href="' + track.permalink_url + '" target="_blank">' + track.title +  '</a>';


		//button
		var button = document.createElement('div');
		button.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');

		var icon = document.createElement('i');
		icon.classList.add('add', 'icon');

		var buttonText = document.createElement('span');
		buttonText.innerHTML = 'Add to playlist';


		//appendChild
		imageDiv.appendChild(image_img);

		content.appendChild(header);

		button.appendChild(icon);
		button.appendChild(buttonText);

		button.addEventListener('click',function(){
			SoundCloudAPI.getEmbed(track.permalink_url);
		});

		card.appendChild(imageDiv);
		card.appendChild(content);
		card.appendChild(button);
		
		var searchResults = document.querySelector(".js-search-results");
		searchResults.appendChild(card);

	});
	
}


// 4. Add to playlist and play

SoundCloudAPI.getEmbed = function(url){
	console.log("click");
	SC.oEmbed(url, {
  		auto_play: true
	}).then(function(embed){
  		console.log('oEmbed response: ', embed);

  		var sideBar = document.querySelector('.js-playlist');
  		
  		var box = document.createElement('div');
  		box.innerHTML = embed.html;

  		sideBar.insertBefore(box, sideBar.firstChild);
  		localStorage.setItem("key", sideBar.innerHTML);

});
};

var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = localStorage.getItem("key");



