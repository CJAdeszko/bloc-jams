var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

      var $row = $(template);


      var clickHandler = function() {
      	var songNumber = parseInt($(this).attr('data-song-number'));

      	if (currentlyPlayingSongNumber !== null) {
      		// Revert to song number for currently playing song because user started playing new song.
      		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      		currentlyPlayingCell.html(currentlyPlayingSongNumber);
      	}
      	if (currentlyPlayingSongNumber !== songNumber) {
      		// Switch from Play -> Pause button to indicate new song is playing.
      		$(this).html(pauseButtonTemplate);
      		setSong(songNumber);
          currentSoundFile.play();
          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
          updatePlayerBarSong();
      	} else if (currentlyPlayingSongNumber === songNumber) {
            //Conditional to check whether currentSoundFile is paused
            if(currentSoundFile.isPaused()){
              $(this).html(pauseButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPauseButton);
              currentSoundFile.play();
            }else{
              $(this).html(playButtonTemplate);
              $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.pause();
            }
      	}
      };

      var onHover = function(event) {
           var songNumberCell = $(this).find('.song-item-number');
           var songNumber = parseInt(songNumberCell.attr('data-song-number'));

           if (songNumber !== currentlyPlayingSongNumber) {
               songNumberCell.html(playButtonTemplate);
           }
       };

       var offHover = function(event) {
           var songNumberCell = $(this).find('.song-item-number');
           var songNumber = parseInt(songNumberCell.attr('data-song-number'));

           if (songNumber !== currentlyPlayingSongNumber) {
               songNumberCell.html(songNumber);
           }

       };

      // #1
      $row.find('.song-item-number').click(clickHandler);
      // #2
      $row.hover(onHover, offHover);
      // #3
      return $row;
 };

 var setCurrentAlbum = function(album) {
    currentAlbum = album;

    // #1
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    // #2
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    // #3
    $albumSongList.empty();

    // #4
    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);    }
};


var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


var nextSong = function(){

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if(currentSongIndex >= currentAlbum.songs.length){
    currentSongIndex = 0;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};


var previousSong = function(){

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if(currentSongIndex < 0){
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};


var togglePlayFromPlayerBar = function(){
  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

//Conditional statement to check if song is paused and the play button is clicked in the player bar
if (currentSoundFile.isPaused() && $playBarSelector.data("clicked", true)){

  //Change the song number cell from a play button to a pause button
  currentlyPlayingCell.html(pauseButtonTemplate);

  //Change the HTML of the player bar's play button to a pause button
  $('.main-controls .play-pause').html(playerBarPauseButton);

  //PLay the song
  currentSoundFile.play();
}else{

  //Change the song number cell from a pause button to a play button
  currentlyPlayingCell.html(playButtonTemplate);

  //Change the HTML of the player bar's pause button to a play button
  $('.main-controls .play-pause').html(playerBarPlayButton);

  //pause the song
  currentSoundFile.pause();
}

};


var updatePlayerBarSong = function(){

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);

};


var setSong = function(songNumber){
  if (currentSoundFile) {
      currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    // #2
    formats: [ 'mp3' ],
    preload: true
});

     setVolume(currentVolume);
};


var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };


var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// #1
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playBarSelector = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playBarSelector.click(togglePlayFromPlayerBar);
});
