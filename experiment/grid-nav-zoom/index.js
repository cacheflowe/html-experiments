/////////////////
// util
/////////////////
var closest = function(element, tagname) {
  tagname = tagname.toLowerCase();
  while (true) {
    if (element.nodeName.toLowerCase() === tagname) {
      return element;
    }
    if (!(element = element.parentNode)) {
      break;
    }
  }
  return null;
};

var remove = function(el) {
  if(el && el.parentNode) el.parentNode.removeChild(el);
}


/////////////////
// grid nav
/////////////////

var initialNav = document.querySelector('.nav-group.active');
var navStack = [initialNav];
var breadcrumb = document.querySelector('#breadcrumb');


var getActiveNavGroup = function() {
  return navStack[navStack.length - 1];
};

var getPreviousNavGroup = function() {
  if(navStack.length > 1)
    return navStack[navStack.length - 2];
  else
    return null;
};

var getNav = function(navId) {
  var navEl = document.querySelector('[data-nav-id="'+navId+'"]');
  return navEl;
};

var popBreadcrumb = function() {
  var curBreadcrumbArr = breadcrumb.innerHTML.split(' / ');
  curBreadcrumbArr.pop();
  breadcrumb.innerHTML = curBreadcrumbArr.join(' / ');
};

var addToBreadcrumb = function(title) {
  var curBreadcrumbArr = breadcrumb.innerHTML.split(' / ');
  curBreadcrumbArr.push(title);
  breadcrumb.innerHTML = curBreadcrumbArr.join(' / ');
};


var showNavFromClick = function(clickedEl, navToShow) {
  var activeNav = getActiveNavGroup();
  var activeNavRect = activeNav.getBoundingClientRect();
  var clickedRect = clickedEl.getBoundingClientRect();
  var positionStyle = '';
  positionStyle += 'left:' + Math.round(clickedRect.left - activeNavRect.left) + 'px; ';
  positionStyle += 'top:' + Math.round(clickedRect.top - activeNavRect.top) + 'px; ';
  positionStyle += 'width:' + Math.round(clickedRect.width) + 'px; ';
  navToShow.setAttribute('style', positionStyle);

  setTimeout(function(){
    navToShow.classList.add('animate');
    navToShow.classList.remove('hidden');
  }, 30);

  activeNav.classList.add('animate');
  setTimeout(function(){
    activeNav.classList.add('hiding-stacked');
    // var positionStyle = 'transform-origin: '+ (pointerPos.xPercent(activeNav) * 100) +'% '+ (pointerPos.yPercent(activeNav) * 100) +'%;';
    // var positionStyle = 'transform-origin: top left;';
    // positionStyle += 'left:' + Math.round(activeNavRect.left - clickedRect.left) + 'px; ';
    // positionStyle += 'top:' + Math.round(activeNavRect.top - clickedRect.top) + 'px; ';
    // activeNav.setAttribute('style', positionStyle);


    var positionStyle = '';
    positionStyle += 'left: 0px; ';
    positionStyle += 'top: 0px; ';
    positionStyle += 'width:' + activeNavRect.width + 'px; ';
    navToShow.setAttribute('style', positionStyle);
  }, 80);

  setTimeout(function(){
    navToShow.removeAttribute('style');
  }, 600);

};

document.querySelector('.container').addEventListener('click', function(e) {
  var clickedItem = closest(e.target, 'button');
  if(clickedItem) {
    var nextMenuId = clickedItem.getAttribute('data-submenu-id');
    if(nextMenuId) {
      var newNav = getNav(nextMenuId);
      if(newNav) {
        var newNavTitle = newNav.getAttribute('data-nav-title');
        addToBreadcrumb(newNavTitle);
        showNavFromClick(clickedItem, newNav);
        navStack.push(newNav);
      }
    }
  }
});

document.querySelector('#back').addEventListener('click', function(e) {
  var prevNav = getPreviousNavGroup()
  if(prevNav) {
    prevNav.classList.remove('hiding-stacked');

    var activeNav = getActiveNavGroup();
    activeNav.classList.add('hiding-removed');
    navStack.pop();
    popBreadcrumb();
    setTimeout(function(){
      activeNav.classList.remove('hiding-removed');
      activeNav.classList.remove('animate');
      activeNav.classList.add('hidden');
      activeNav.removeAttribute('style');
    }, 600);
  }
});
