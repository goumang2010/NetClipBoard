var note = $('#noteText');
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    }
    else {
        window.onload = function () {
            oldonload(null);
            func();
        };
    }
}
addLoadEvent(function () {
    showQR(location.href, false);
});
function retoSocket() {
    window.open("/websocket");
    return false;
}
function submitAjax() {
    $.ajax({
        url: 'addnote',
        data: {
            noteText: note.text(),
            keepkey: $('#keepkey').is(":checked"),
        },
        type: 'post',
        cache: false,
        // dataType: 'json',
        success: function (data) {
            showQR(data);
        },
        error: function () {
            alert("通信异常！");
        }
    });
}
function ajaxFetch() {
    $.ajax({
        url: 'ajaxfetch',
        data: {
            key: $('#key').val(),
        },
        type: 'post',
        cache: false,
        success: function (data) {
            fetchText(data);
        },
        error: function () {
            alert("通信异常！");
        }
    });
}
function showQR(data, toa) {
    if (toa === void 0) { toa = true; }
    var fetchurl = location.href;
    //去除参数及锚点
    var urlarray = fetchurl.split('/');
    var ltstr = urlarray.pop();
    if (ltstr != "") {
        fetchurl = fetchurl.replace(ltstr, "");
    }
    var display = data;
    if (display == "") {
        alert("出现错误，未能返回数据，请取消保持密码或清除cookie重试");
        return;
    }
    if (data != fetchurl) {
        fetchurl = fetchurl + "fetch?key=" + data;
    }
    //If data is an address,then get the key only.
    var dary = display.split("=");
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
    if (toa) {
        toaWin("请查看二维码及链接");
    }
    //返回至锚点，便于移动端浏览
    location.hash = "#anchor";
}
function toaWin(content) {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-bottom-center",
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
    };
    toastr["success"](content);
}
function fetchText(data) {
    if (data != "") {
        note.text(data);
    }
    function errHandle(err) {
        alert(err);
    }
}
//The toolbar 4button
function toLower() {
    var orgstr = $('#noteText').text();
    note.text(orgstr.toLowerCase());
}
function toUpper() {
    var orgstr = $('#noteText').text();
    note.text(orgstr.toUpperCase());
}
function copyToBoard() {
    note.focus();
    note.select();
    var txt = note.text();
    document.execCommand("copy");
}
//# sourceMappingURL=clientIndex.js.map