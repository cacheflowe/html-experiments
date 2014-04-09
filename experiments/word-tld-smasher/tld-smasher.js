(function(){
  function TLDSmasher(){
    var _tldList = null,
        _wordsList = null,
        _stepThroughIndex = 0,
        _stepIncrement = 50,
        _numWords = 0,
        _numTlds = 0,
        _container = document.getElementById('main');

    // load tld data --------------------------------
    var init = function() {
      loadTldData('./tld-db.json');
    };

    var loadTldData = function( tldJSON ) {
      $.ajax({
        dataType: "json",
        url: tldJSON,
        success: tldsLoaded
      });
    };

    var tldsLoaded = function( data ) {
      _tldList = data.tlds;
      _numTlds = _tldList.length;
      loadWordData('./word-db.json');
    };

    // load word data next --------------------------
    var loadWordData = function( wordJSON ) {
      $.ajax({
        dataType: "json",
        url: wordJSON,
        success: wordsLoaded
      });
    };

    var wordsLoaded = function( data ) {
      _wordsList = data.words;
      _numWords = _wordsList.length;

      startParsing();
    };

    // step through groups of dictionary words -----
    var parseNextWordSet = function() {
      var word, tld, tldMatch, successUrl, p;

      console.log('Working through '+_stepIncrement+' more words, at index: ',_stepThroughIndex);

      // loop through words in this group
      for (var i = _stepThroughIndex; i < _stepThroughIndex + _stepIncrement; i++) {
        if(i < _numWords) {
          word = _wordsList[i];
          // loop through tlds for each word
          for (var j = 0; j < _numTlds; j++) {
            tld = _tldList[j];
            tldMatch = word.substr(word.length - tld.length);
            // match the last x letters of the word with the tld
            if(tldMatch == tld) {
              // drop into the dom
              successUrl = word.substr(0, word.length - tld.length) + '.' + tld;

              // but keep it short
              if(successUrl.length < 12) {

                p = document.createElement('p');
                p.innerHTML = successUrl;
                _container.appendChild(p);

                // window.scroll(0,document.height);

              }
            }
          }
        }
      };

      // step to next group of words
      _stepThroughIndex += _stepIncrement;
    };

    var startParsing = function(){
      // group word parsing
      // setTimeout(function(){
      setInterval(function(){
        if( _stepThroughIndex < _numWords ) {
          parseNextWordSet();
        }
      },10);
    };

    // public interface ----------------------------
    return {
      init: init
    }

  }
  
  window.tldSmasher = new TLDSmasher();

})();
