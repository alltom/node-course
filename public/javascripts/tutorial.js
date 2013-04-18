$(function () {

// give something the 'select-all' class to make it select all of its contents when the user clicks it
$('.select-all').on('click', function () {
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(this);
		range.select();
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(this);
		window.getSelection().addRange(range);
	}
});


// when an item has the 'slot' class, hovering over it will
// show the contents of the 'title' attribute in a popup that
// follows the mouse
var $popup = $('<div class="popup" />').appendTo(document.body).hide();
var popupOwner = undefined;

$(document.body).on('mouseover', 'span.slot', function (e) {
	$popup.html($(this).attr('data-description')).show();
	$popup.css({ left: e.pageX + 5, top: e.pageY + 5 });
	popupOwner = this;
});
$(document.body).on('mousemove', 'span.slot', function (e) {
	if (popupOwner === this) {
		$popup.css({ left: e.pageX + 5, top: e.pageY + 5 });
	}
});
$(document.body).on('mouseout', 'span.slot', function (e) {
	if (popupOwner === this) {
		$popup.hide();
	}
});

$('span.slot').each(function () {
	$(this).attr('data-description', $(this).attr('title'));
	$(this).attr('title', '');
});

});
