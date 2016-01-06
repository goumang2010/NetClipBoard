function ShowQR(data) {
    var fetchurl = location.href;
    if (data != fetchurl) {
        fetchurl = fetchurl + "fetch?key=" + data;
    }
    jQuery('#handCode').empty();
    jQuery('#handCode').append("<a href='" + fetchurl + "'>" + data + "</a>");
    jQuery('#qrcodeCanvas').empty();
    jQuery('#qrcodeCanvas').qrcode({
        label: "QR",
        text: fetchurl
    });
    // alert(data);
}
//# sourceMappingURL=Index.Ajax.js.map