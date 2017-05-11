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

        let formData = {
            'name': $('input[name=name]').val(),
            'email': $('input[name=email]').val(),
            'user_message': $('textarea[name=user_message]').val(),
        };

        $.ajax({
            type: 'POST',
            url: '/simplechat/conversations/create',
            data: formData,
            dataType: 'json',
            encode: true,
            success: function (data) {

                $("#chat-start-form-window").hide();
                let message = {
                    'user': {
                        'name': "You",
                    },
                    'message_body': formData['user_message'],
                };
                id = data.id;

                appendMessage(message);
                connectToChannel(id);

                $('#chat-window').show();
                scrollToEnd();
            },
            complete: function () {
                // not used now
            },
            error: function (xhr, status, error) {
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
        axios.get('/simplechat/messages/' + id + '/get')
            .then(function (response) {
                $.each(response.data, function (item, value) {
                    appendMessage(value);
                });
                scrollToEnd();
            })
            .catch(function (error) {
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
    Echo.channel('simple-chat-' + ids)
        .listen('.Aidaskni\\Simplechat\\Events\\ClearMessageEvent', (e) => {
            clearMessages();
        })
        .listen('.Aidaskni\\Simplechat\\Events\\SendMessageEvent', (e) => {
            appendMessage2(e);
            scrollToEnd();
        });
}

/**
 *
 * @param id
 */
function sendMessage(id) {
    let text = $("input[name=textMessage]");
    let message = {
        'user': {
            'name': "You",
        },
        'message_body': text.val(),
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
    let cont = $(".chat-log");
    cont[0].scrollTop = cont[0].scrollHeight;
}

/**
 * Append messages
 * @param message
 */
function appendMessage(message) {

    if (message.user == null) {
        $(".chat-log").append(
            $('<div/>')
                .addClass("chat-message")
                .append(
                    $('<p>').addClass('triangle-isosceles-left').text(message.message_body)
                )
                .append(
                    $('<small/>').addClass('user-left').text("Client")
                )
        );
    } else {
        $(".chat-log").append(
            $('<div/>')
                .addClass("chat-message")
                .append(
                    $('<p>').addClass('triangle-isosceles-right').text(message.message_body)
                )
                .append(
                    $('<small/>').addClass('user-right').text(message.user.name)
                )
        );
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
        $(".chat-log").append(
            $('<div/>')
                .addClass("chat-message")
                .append(
                    $('<p>').addClass('triangle-isosceles-left').text(message.message.message_body)
                )
                .append(
                    $('<small/>').addClass('user-left').text("Client")
                )
        );
    } else {
        $(".chat-log").append(
            $('<div/>')
                .addClass("chat-message")
                .append(
                    $('<p>').addClass('triangle-isosceles-right').text(message.message.message_body)
                )
                .append(
                    $('<small/>').addClass('user-right').text(message.user.name)
                )
        );
    }
}


