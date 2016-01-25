
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
    ShowQR(location.href);
});

function ShowQR(data) {
    var fetchurl: string = location.href;
    var display = (<string>data)
    if (data != fetchurl) {
        fetchurl = fetchurl+"fetch?key="+data
    }
    //If data is an address,then get the key only.
    var dary = display.split("=")
    if (dary.length > 1) {
        display = dary[dary.length - 1];
    }
    jQuery('#handCode').empty();
    jQuery('#handCode').append("<a href='"+fetchurl+"'>"+ display+"</a>");
    jQuery('#qrcodeCanvas').empty();
    jQuery('#qrcodeCanvas').qrcode({
        label:"QR",
        text: fetchurl
    }); 

  // alert(data);
}
function fetchText(data) {
    if (data != "") {
        jQuery('#noteText').text(data);
    // alert(data);
    }

    function errHandle(err: Error) {
        alert(err);

    }
}

//The toolbar 4button
function toLower() {
    var orgstr: string = jQuery('#noteText').text();
    jQuery('#noteText').text(orgstr.toLowerCase());

}
function toUpper() {
    var orgstr: string = jQuery('#noteText').text();
    jQuery('#noteText').text(orgstr.toUpperCase());

}
function copyToBoard() {
    var textbox = jQuery('#noteText');
    textbox.focus();
    textbox.select();
    var txt: string = textbox.text();
    document.execCommand("copy");
    //屏蔽类型检查
    //var windowfake = <any>window;
    //if (windowfake.clipboardData) {

    //    windowfake.clipboardData.clearData();

    //    windowfake.clipboardData.setData("Text", txt);

    //    alert("已经成功复制到剪帖板上");

    //}
    //else {
    //    alert("暂时无法复制到剪帖板上，已显示在上方，请自行复制，并在文件夹中打开！");
    //}
}


