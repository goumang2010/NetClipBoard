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
    ShowQR(location.href, false);
});
function ShowQR(data, toa) {
    if (toa === void 0) { toa = true; }
    var fetchurl = location.href;
    var display = data;
    if (data != fetchurl) {
        fetchurl = fetchurl + "fetch?key=" + data;
    }
    //If data is an address,then get the key only.
    var dary = display.split("=");
    if (dary.length > 1) {
        display = dary[dary.length - 1];
    }
    jQuery('#handCode').empty();
    jQuery('#handCode').append("<a href='" + fetchurl + "'>" + display + "</a>");
    jQuery('#qrcodeCanvas').empty();
    jQuery('#qrcodeCanvas').qrcode({
        label: "QR",
        text: fetchurl
    });
    if (toa) {
        toaWin("请查看二维码及链接");
    }
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
        jQuery('#noteText').text(data);
    }
    function errHandle(err) {
        alert(err);
    }
}
//The toolbar 4button
function toLower() {
    var orgstr = jQuery('#noteText').text();
    jQuery('#noteText').text(orgstr.toLowerCase());
}
function toUpper() {
    var orgstr = jQuery('#noteText').text();
    jQuery('#noteText').text(orgstr.toUpperCase());
}
function copyToBoard() {
    var textbox = jQuery('#noteText');
    textbox.focus();
    textbox.select();
    var txt = textbox.text();
    document.execCommand("copy");
}
//# sourceMappingURL=index.js.map