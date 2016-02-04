    var $note = $('#noteText');
    var keycode;
    var sch = $(document).height() - $(window).height();
    function addLoadEvent(func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function () {
                oldonload(null);
                func();
            }
        }
    }
    addLoadEvent(function () {
        showQR(location.href, false);
        $note.focus();
    });
    function retoSocket() {
        window.open("/websocket");
        return false;
    }

    //Ajax提交与取回

    /**
     * Ajax提交
     */
    function submitAjax() {
        var notetext = $note.val();
        if (notetext == "") {
            toaWin("你没有输入任何东西", "warning");
            $note.focus;
            return;
        }
        $.ajax({
            url: 'addnote',// 跳转到 action  
            data: {
                //需使用val才能在一些移动端取得输入的文本，不能使用text
                noteText: notetext,
                keepkey: $('#keepkey').is(":checked"),
            },
            type: 'post',
            cache: false,
            // dataType: 'json',
            success: function (data) {
                showQR(data);
            },
            error: function (err) {
                errHandle(err);
            }
        });
    }
    function ajaxFetch() {
        var keytext: string = $('#key').val()
        if (keytext.length != 6) {
            toaWin("请输入6位密码", "warning");
            $('#key').focus();
            return;
        }
        $.ajax({
            url: 'ajaxfetch',
            data: {
                key: keytext,
            },
            type: 'post',
            cache: false,
            success: function (data) {
                fetchText(data);
            },
            error: function (err) {
                errHandle(err);
            }
        });
    }
    function showQR(data, toa: boolean = true) {

        var display = (<string>data)
        if (display == "") {
            alert("出现错误，未能返回数据，请取消保持密码或清除cookie重试")
            return;
        }
        //对比密码是否改变，若未改变，则不再重复生成网址及二维码
        if (keycode != data) {
            var fetchurl: string = location.href;
            //如果是6位密码，则补全
            if (display.length == 6) {
                //去除参数及锚点
                var urlarray = fetchurl.split('/');
                var ltstr = urlarray.pop();
                if (ltstr != "") {
                    fetchurl = fetchurl.replace(ltstr, "");
                }
                fetchurl = fetchurl + "fetch?key=" + data
            }
            //If data is an address,then get the key only.
            var dary = display.split("=")
            if (dary.length > 1) {
                display = dary[dary.length - 1];
            }
            $('#handCode').empty();
            $('#handCode').append("<a href='" + fetchurl + "'>" + display + "</a>");
            $('#qrcodeCanvas').empty();
            $('#qrcodeCanvas').qrcode({
                label: "QR",
                text: fetchurl
            }); 
            //保存密码到全局变量
            keycode = data;
        }
        if (toa) {
            toaWin("请查看二维码及链接")
        }
        //返回至锚点，便于移动端浏览，location.hash在一些移动端会失效
        //location.hash = "#"; 
        var t = $("#anchor").offset().top;
        $(window).scrollTop(t);

    }
    function toaWin(content: string, state: string = "success") {
        toastr.options = {
            closeButton: false,
            debug: false,
            newestOnTop: false,
            progressBar: false,
            positionClass: "toast-top-center",
            preventDuplicates: false,
            onclick: null,
            showDuration: 300,
            hideDuration: 1000,
            timeOut: 5000,
            extendedTimeOut: 1000,
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        }
        toastr[state](content)
    }
    function fetchText(data) {
        if (data != "") {
            $note.val(data);
            toaWin("请查看取回的内容")
            //返回至锚点，便于移动端浏览
            location.hash = "#noteText";
        }
        else {
            toaWin("没有找到对应的内容，请核查后重试", "error");
            $('#key').focus();
        }

    }
    function errHandle(err) {
        alert("似乎是通信异常！请查看错误信息：" + err);
    }

    //监视滚动，适时隐藏导航栏
    $(window).scroll(function () {
        var tval = $(document).scrollTop();
        if (tval >= sch) {
            $(".navbar").fadeOut();
        }
        else {
            $(".navbar").show();
        }
    });

    //三个按钮
    function toLower() {
        var orgstr: string = $note.text();
        $note.text(orgstr.toLowerCase());
    }
    function toUpper() {
        var orgstr: string = $note.text();
        $note.text(orgstr.toUpperCase());
    }
    function copyToBoard() {
        $note.focus();
        $note.select();
        document.execCommand("copy");
    }