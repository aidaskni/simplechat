/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 37);
/******/ })
/************************************************************************/
/******/ ({

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),

/***/ 7:
/***/ (function(module, exports) {

$(document).ready(function () {

    $("#hide").click(function () {
        $("#chat-start-form-container").hide();
        $("#show").show();
    });

    $("#show").click(function (event) {
        event.preventDefault();
        $(this).hide();
        $("#chat-start-form-container").show();
    });

    $('#chat-start-form').submit(function (event) {
        event.preventDefault();

        var formData = {
            'name': $('input[name=name]').val(),
            'email': $('input[name=email]').val(),
            'user_message': $('textarea[name=user_message]').val()
        };

        $.ajax({
            type: 'POST',
            url: '/simplechat/conversations/create',
            data: formData,
            dataType: 'json',
            encode: true,
            success: function success(data) {

                $("#chat-start-form-window").hide();
                var message = {
                    'user': {
                        'name': "You"
                    },
                    'message_body': formData['user_message']
                };
                id = data.id;

                appendMessage(message);
                connectToChannel(id);

                $('#chat-window').show();
                scrollToEnd();
            },
            complete: function complete() {
                // not used now
            },
            error: function error(xhr, status, _error) {
                $(".errora").remove();
                if (xhr.responseJSON.name) {
                    console.error(xhr.responseJSON.name[0]);
                    $('#name').parent().addClass('has-error');
                    $('#name').parent().append("<p style='color: red' class='errora'>" + xhr.responseJSON.name[0] + "</p>");
                }
                if (xhr.responseJSON.email) {
                    $('#email').parent().addClass('has-error');
                    $('#email').parent().append("<p style='color: red' class='errora'>" + xhr.responseJSON.email[0] + "</p>");
                }
            }
        });
    });
});

/**
 * Send on click "Send"
 */
$(".send").click(function () {
    sendMessage(id);
});

/**
 * Send on Enter key
 */
$(document).keypress(function (e) {
    if (e.which == 13) {
        sendMessage(id);
    }
});

/**
 * Load messages
 */
$(".chat-log").ready(function () {
    if (id) {
        axios.get('/simplechat/messages/' + id + '/get').then(function (response) {
            $.each(response.data, function (item, value) {
                appendMessage(value);
            });
            scrollToEnd();
        }).catch(function (error) {
            console.log(error);
        });
    }
});

/**
 * Connect to chanel
 */
$(document).ready(function () {
    if (id) {
        connectToChannel(id);
    }
});

/**
 * Connect and listen channel events
 * @param ids
 */
function connectToChannel(ids) {
    Echo.channel('simple-chat-' + ids).listen('.Aidaskni\\Simplechat\\Events\\ClearMessageEvent', function (e) {
        clearMessages();
    }).listen('.Aidaskni\\Simplechat\\Events\\SendMessageEvent', function (e) {
        appendMessage2(e);
        scrollToEnd();
    });
}

/**
 *
 * @param id
 */
function sendMessage(id) {
    var text = $("input[name=textMessage]");
    var message = {
        'user': {
            'name': "You"
        },
        'message_body': text.val()
    };
    appendMessage(message);
    scrollToEnd();
    text.val('');
    axios.post('/simplechat/messages/' + id, message);
}

/**
 * Scroll to end on messages window
 */
function scrollToEnd() {
    var cont = $(".chat-log");
    cont[0].scrollTop = cont[0].scrollHeight;
}

/**
 * Append messages
 * @param message
 */
function appendMessage(message) {

    if (message.user == null) {
        $(".chat-log").append($('<div/>').addClass("chat-message").append($('<p>').addClass('triangle-isosceles-left').text(message.message_body)).append($('<small/>').addClass('user-left').text("Client")));
    } else {
        $(".chat-log").append($('<div/>').addClass("chat-message").append($('<p>').addClass('triangle-isosceles-right').text(message.message_body)).append($('<small/>').addClass('user-right').text(message.user.name)));
    }
}

/**
 * Clear child elements - chat messages
 */
function clearMessages() {
    $(".chat-message").remove();
}

/**
 * Append messages from channel
 * @param message
 */
function appendMessage2(message) {
    if (message.user == null) {
        $(".chat-log").append($('<div/>').addClass("chat-message").append($('<p>').addClass('triangle-isosceles-left').text(message.message.message_body)).append($('<small/>').addClass('user-left').text("Client")));
    } else {
        $(".chat-log").append($('<div/>').addClass("chat-message").append($('<p>').addClass('triangle-isosceles-right').text(message.message.message_body)).append($('<small/>').addClass('user-right').text(message.user.name)));
    }
}

/***/ })

/******/ });