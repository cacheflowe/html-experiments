_catchy.PageManager = function() {

  var _activePage = null,
      _pages;

  var init = function() {
    _pages = document.querySelectorAll('.page')
  };

  var setPageActive = function(pageObj) {
    if (_activePage === pageObj) return;
    var pageActivated = false;
    var nextPageSet = false;
    for (var i = 0; i < _pages.length; i++) {
      page = _pages[i];
      if (page.classList.contains('active')) {
        setPageDeactivated(_activePage);
      } else if (page === pageObj.el) {
        setPageActivated(pageObj);
      }
    }
    return _activePage = pageObj;
  };

  var setPageActivated = function(pageObj) {
    var page;
    pageObj.setActive(true);
    page = pageObj.el;
    page.classList.remove('hidden');
    page.classList.remove('done');
    setTimeout(function() {
      page.classList.add('active');
    }, 100);
  };

  var setPageDeactivated = function(pageObj) {
    var page;
    pageObj.setActive(false);
    page = pageObj.el;
    setTimeout(function() {
      page.classList.add('done');
      page.classList.remove('active');
    }, 100);
    setTimeout(function() {
      page.classList.add('hidden');
      page.classList.remove('done');
    }, 1000);
  };

  init();
  return {
    setPageActive: setPageActive
  };
};
