//由于自定义变量较多，故采用匿名函数来封装
//参考socket.io 的example
$(function () {
    var FADE_TIME = 150; // ms
    var TYPING_TIMER_LENGTH = 400; // ms
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    var $window = $(window);
    var $usrInput = $('#usrInput'); // 用户名输入框
    var $messages = $('#msglist'); // 消息列表
    var $inputMessage = $('#textInput'); // 输入的文本框
    var $loginPage = $('.login.page'); // 登录页面
    var $chatPage = $('.chat.page'); // 交流页面
    var $userlist = $('#ulUI');//用户列表

    var username;
    var connected = false;
    var typing = false;
    var lastTypingTime;
    var $currentInput = $usrInput.focus();
    var userlist: Array<string> = new Array<string>();
   //
    $(document).ready(function () {
        var tmpname = Cookies.get('socketuser');
        if (tmpname != undefined) {
            $usrInput.val(tmpname);
            $usrInput.focus();
        }
    });


      //取得socket连接
    var socket = io();


    //提交聊天消息内容
    function sendMsg() {
        var content = $('#chatText').val();
        if (content != '') {
            //var obj = {
            //    userid: this.userid,
            //    username: this.username,
            //    content: content
            //};
            socket.emit('message', content);
            $('#chatText').val('');
        }
        return false;
    }
    /**
     * 将用户列表信息同步到UI上
     * @param username 用户名
     * @param option 操作
     */
    function syncUserList(username:string,option:string) {
        var ind = userlist.indexOf(username);
        switch (option) {
            case "add":
                if (ind < 0) {
                    userlist.push(username);
                    var $el = $('<li>').addClass("list-group-item").text(username);
                    $el.attr("id", username);
                    $userlist.append($el);
                }

                break;
            case "remove":
                if (ind != -1) {
                    userlist.splice(ind, 1);
                }
                $userlist.remove("li#username");
                break; 
        }
            

    }
    function syncUserListExist() {
        for (var i = 0; i < userlist.length; i++) {
            var $el = $('<li>').addClass("list-group-item").text(userlist[i]);
            $el.attr("id", userlist[i]);
            $userlist.append($el);
        }

    }


    /**
     * 添加参与者信息
     * @param data 传入的数据
     */
    function addParticipantsMessage(data) {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message);
    }

    // Sets the client's username
    function setUsername(tmpname) {
        

        // If the username is valid
        if (tmpname) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();
            username = tmpname;
            // Tell the server your username
            socket.emit('add user', username);
            Cookies.set('socketuser', username);
        }
       
    }

    // Sends a chat message
    function sendMessage() {
        var message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (message && connected) {
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('new message', message);
        }
    }

    // Log a message
    function log(message, options = null) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    // Adds the visual chat message to the message list
    function addChatMessage(data, options = null) {
        // Don't fade the message in if there is an 'X was typing'
        var $typingMessages = getTypingMessages(data);
        options = options || {};
        if ($typingMessages.length !== 0) {
            options.fade = false;
            $typingMessages.remove();
        }

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        var typingClass = data.typing ? 'typing' : '';
        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }

    // Adds the visual chat typing message
    function addChatTyping(data) {
        data.typing = true;
        data.message = 'is typing';
        addChatMessage(data);
    }

    // Removes the visual chat typing message
    function removeChatTyping(data) {
        getTypingMessages(data).fadeOut(function () {
            $(this).remove();
        });
    }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    function addMessageElement(el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    function cleanInput(input) {
        return $('<div/>').text(input).text();
    }

    // Updates the typing event
    function updateTyping() {
        if (connected) {
            if (!typing) {
                typing = true;
                socket.emit('typing');
            }
            lastTypingTime = (new Date()).getTime();

            setTimeout(function () {
                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket.emit('stop typing');
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH);
        }
    }

    // Gets the 'X is typing' messages of a user
    function getTypingMessages(data) {
        return $('.typing.message').filter(function (i) {
            return $(this).data('username') === data.username;
        });
    }

    // Gets the color of a username through our hash function
    function getUsernameColor(username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Keyboard events

    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
                socket.emit('stop typing');
                typing = false;
            } else {
                var tempname = cleanInput($usrInput.val().trim());
                socket.emit('check user', tempname);
                

            }
        }
    });

    $inputMessage.on('input', function () {
        updateTyping();
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(function () {
        $currentInput.focus();
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(function () {
        $inputMessage.focus();
    });


    // Socket events
    socket.on('connect', function () {
        $('#state').append($('<li>已连接！</li>'));
    });

    socket.on('disconnect', function () {
        $('#state').append('<li>失去连接</li>');
    });

    socket.on('user status', function (data) {
        if (data.status == "OK") {
            setUsername(data.username);
        }
        else {
            alert("名字重复，请重新输入！");
            $usrInput.focus();
        }
    });

    // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        var message = "Welcome to Socket.IO Chat – ";
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
        userlist = data.usersNow;

        syncUserListExist();
       var oldstr = $("p#welcome").text();
       $("p#welcome").text(oldstr + "," + username);
       
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
        log(data.username + ' joined');
        addParticipantsMessage(data);
        syncUserList(data.username, "add");
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
        log(data.username + ' left');
        addParticipantsMessage(data);
        removeChatTyping(data);
        syncUserList(data.username, "remove");
    });

    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', function (data) {
        addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', function (data) {
        removeChatTyping(data);
    });

});
