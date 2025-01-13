import * as firbase from "./firbase.js";

function loadApp() {

 	$('#canvas').fadeIn(1000);

 	var flipbook = $('.magazine');

 	// Check if the CSS was already loaded
	
	if (flipbook.width()==0 || flipbook.height()==0) {
		setTimeout(loadApp, 10);
		return;
	}
	
	// Create the flipbook

	flipbook.turn({
			
			// Magazine width

			width: 922,

			// Magazine height

			height: 600,

			// Duration in millisecond

			duration: 1000,

			// Enables gradients

			gradients: true,
			
			// Auto center this flipbook

			autoCenter: true,

			// Elevation from the edge of the flipbook when turning a page

			elevation: 74,

			// The number of pages

			pages: 74,

			// Events

			when: {
				turning: function(event, page, view) {
					
					var book = $(this),
					currentPage = book.turn('page'),
					pages = book.turn('pages');
			
					// Update the current URI

					Hash.go('page/' + page).update();

					// Show and hide navigation buttons

					disableControls(page);

				},

				turned: function(event, page, view) {

					disableControls(page);

					$(this).turn('center');

					$('#slider').slider('value', getViewNumber($(this), page));

					if (page==1) { 
						$(this).turn('peel', 'br');
					}

				},

				missing: function (event, pages) {

					// Add pages that aren't in the magazine

					for (var i = 0; i < pages.length; i++)
						addPage(pages[i], $(this));

				}
			}

	});

	// Zoom.js

	$('.magazine-viewport').zoom({
		
		flipbook: $('.magazine'),

		max: function() { 
			
			return largeMagazineWidth()/$('.magazine').width();

		}, 

		when: {
			swipeLeft: function() {

				$(this).zoom('flipbook').turn('next');

			},

			swipeRight: function() {
				
				$(this).zoom('flipbook').turn('previous');

			},

			resize: function(event, scale, page, pageElement) {

				if (scale==1)
					loadSmallPage(page, pageElement);
				else
					loadLargePage(page, pageElement);

			},

			zoomIn: function () {
				document.querySelector(".close-icon").style.display = "none"
				$('#slider-bar').hide();
				$('.made').hide();
				$('.magazine').removeClass('animated').addClass('zoom-in');
				$('.zoom-icon').removeClass('zoom-icon-in').addClass('zoom-icon-out');
				
				if (!window.escTip && !$.isTouch) {
					escTip = true;

					$('<div />', {'class': 'exit-message'}).
						html('<div>Press ESC to exit</div>').
							appendTo($('body')).
							delay(2000).
							animate({opacity:0}, 500, function() {
								$(this).remove();
							});
				}
			},

			zoomOut: function () {
				document.querySelector(".close-icon").style.display = "block"
				$('#slider-bar').fadeIn();
				$('.exit-message').hide();
				$('.made').fadeIn();
				$('.zoom-icon').removeClass('zoom-icon-out').addClass('zoom-icon-in');

				setTimeout(function(){
					$('.magazine').addClass('animated').removeClass('zoom-in');
					resizeViewport();
				}, 0);

			}
		}
	});

	// Zoom event

	if ($.isTouch)
		$('.magazine-viewport').bind('zoom.doubleTap', zoomTo);
	else
		$('.magazine-viewport').bind('zoom.tap', zoomTo);


	// Using arrow keys to turn the page

	$(document).keydown(function(e){

		var previous = 37, next = 39, esc = 27;

		switch (e.keyCode) {
			case previous:

				// left arrow
				$('.magazine').turn('previous');
				e.preventDefault();

			break;
			case next:

				//right arrow
				$('.magazine').turn('next');
				e.preventDefault();

			break;
			case esc:
				
				$('.magazine-viewport').zoom('zoomOut');	
				e.preventDefault();

			break;
		}
	});

	// URIs - Format #/page/1 

	Hash.on('^page\/([0-9]*)$', {
		yep: function(path, parts) {
			var page = parts[1];

			if (page!==undefined) {
				if ($('.magazine').turn('is'))
					$('.magazine').turn('page', page);
			}

		},
		nop: function(path) {

			if ($('.magazine').turn('is'))
				$('.magazine').turn('page', 1);
		}
	});


	$(window).resize(function() {
		resizeViewport();
	}).bind('orientationchange', function() {
		resizeViewport();
	});

	// Regions

	// if ($.isTouch) {
	// 	$('.magazine').bind('touchstart', regionClick);
	// } else {
	// 	$('.magazine').click(regionClick);
	// }

	// Events for the next button

	$('.next-button').bind($.mouseEvents.over, function() {
		
		$(this).addClass('next-button-hover');

	}).bind($.mouseEvents.out, function() {
		
		$(this).removeClass('next-button-hover');

	}).bind($.mouseEvents.down, function() {
		
		$(this).addClass('next-button-down');

	}).bind($.mouseEvents.up, function() {
		
		$(this).removeClass('next-button-down');

	}).click(function() {
		
		$('.magazine').turn('next');

	});

	// Events for the next button
	
	$('.previous-button').bind($.mouseEvents.over, function() {
		
		$(this).addClass('previous-button-hover');

	}).bind($.mouseEvents.out, function() {
		
		$(this).removeClass('previous-button-hover');

	}).bind($.mouseEvents.down, function() {
		
		$(this).addClass('previous-button-down');

	}).bind($.mouseEvents.up, function() {
		
		$(this).removeClass('previous-button-down');

	}).click(function() {
		
		$('.magazine').turn('previous');

	});


	// Slider

	$( "#slider" ).slider({
		min: 1,
		max: numberOfViews(flipbook),

		start: function(event, ui) {

			if (!window._thumbPreview) {
				_thumbPreview = $('<div />', {'class': 'thumbnail'}).html('<div></div>');
				setPreview(ui.value);
				_thumbPreview.appendTo($(ui.handle));
			} else
				setPreview(ui.value);

			moveBar(false);

		},

		slide: function(event, ui) {

			setPreview(ui.value);

		},

		stop: function() {

			if (window._thumbPreview)
				_thumbPreview.removeClass('show');
			
			$('.magazine').turn('page', Math.max(1, $(this).slider('value')*2 - 2));

		}
	});

	resizeViewport();

	$('.magazine').addClass('animated');

}

// Zoom icon

 $('.zoom-icon').bind('mouseover', function() { 
 	
 	if ($(this).hasClass('zoom-icon-in'))
 		$(this).addClass('zoom-icon-in-hover');

 	if ($(this).hasClass('zoom-icon-out'))
 		$(this).addClass('zoom-icon-out-hover');
 
 }).bind('mouseout', function() { 
 	
 	 if ($(this).hasClass('zoom-icon-in'))
 		$(this).removeClass('zoom-icon-in-hover');
 	
 	if ($(this).hasClass('zoom-icon-out'))
 		$(this).removeClass('zoom-icon-out-hover');

 }).bind('click', function() {

 	if ($(this).hasClass('zoom-icon-in'))
 		$('.magazine-viewport').zoom('zoomIn');
 	else if ($(this).hasClass('zoom-icon-out'))	
		$('.magazine-viewport').zoom('zoomOut');

 });

 $('#canvas').hide();


// Load the HTML4 version if there's not CSS transform

document.querySelector(".yassin-book-showBtn").addEventListener("click",e=>
	{
		fireAlert("nfo", "wait until pages will be loaded",fire_time=9000)
		document.querySelector(".books").style.display = "none"
		document.querySelector(".accordion-waper").style.display = "none"
		document.querySelector(".zoom-icon-in").style.display = "block"
		document.querySelector(".close-icon").style.display = "block"
		yepnope({
			test : Modernizr.csstransforms,
			yep: ['../static/js/lib/turn.js'],
			nope: ['../static/js/lib/turn.html4.min.js', '../static/css/lib/jquery.ui.html4.css'],
			both: ['../static/js/lib/zoom.min.js', '../static/css/lib/jquery.ui.css', '../static/js/lib/magazine.js', '../static/css/lib/magazine.css'],
			complete: loadApp()
		});
	}
)
document.querySelector(".close-icon").addEventListener("click",e=>{
	document.querySelector(".books").style.display = "grid"
	document.querySelector(".close-icon").style.display = "none"
	document.querySelector(".zoom-icon-in").style.display = "none"
	document.querySelector(".accordion-waper").style.display = "block"

	$('.magazine').turn("destroy");
})

document.querySelector(".expire-btn").addEventListener("click",e=>{

})


document.querySelector(".book-copy-btn").addEventListener("click",e=>
	{
	var jsonFile = new XMLHttpRequest();
    jsonFile.open("GET","../static/files/expire24.txt",true);
    jsonFile.send();

    jsonFile.onreadystatechange = function() {
        if (jsonFile.readyState== 4 && jsonFile.status == 200) {
             let copyText = jsonFile.responseText;
			  // Copy the text inside the text field
			 navigator.clipboard.writeText(copyText);
		   
			 // Alert the copied text
			 fireAlert("success", "Copied the text")
        }
     }
	}
)
// yepnope({
// 	test: Modernizr.csstransforms,
// 	yep: ['../static/js/lib/turn.min.js'],
// 	nope: ['../static/js/lib/turn.html4.min.js', '../static/css/lib/jquery.ui.html4.css'],
// 	both: ['../static/css/lib/docs.css', '../static/js/lib/docs.js'],
// 	complete: loadApp
// });

async function getFileUrl(el,file_name){

	const storageRef = firbase.storage.ref("/files/cgp/"+file_name);
	try {
	  const downloadURL = await firbase.storageRef.getDownloadURL();
	  console.log("Download URL:", downloadURL);

	  // Display the URL or use it
	  const a_element = document.createElement("a");
	  a_element.setAttribute("href", downloadURL);
	  a_element.setAttribute("target", "_blank");
	  a_element.click();

	} catch (error) {
	  console.error("Error fetching download URL:", error);
	  alert("Failed to get download URL. Check the file path.");
	}}