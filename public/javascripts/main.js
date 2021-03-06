var socket = io.connect('http://localhost:3000');


/** visitor counter **/

function updateCounter(count) {
	$('#visitor-counter').text(count);
}

// YOUR COUNTER CODE GOES HERE


/** chat **/

function addChatMessage(message) {
	return $('<div />').text(message).appendTo('#chat .chat-history');
}

function sendChatMessage(message, callback) {
	// YOUR MESSAGE-SENDING CODE GOES HERE
}

$(document).ready(function () {
	$('#chat button').on('click', function () {
		// store the message and clear the text box
		var message = $('#chat input').val();
		$('#chat input').val('').focus();
		
		// add the message to the chat box (as 'pending')
		var $message = addChatMessage(message);
		$message.addClass('pending');
		
		// send the message and when the server acknowledges, remove the pending state
		sendChatMessage(message, function () {
			$message.removeClass('pending');
		});
	});
});
