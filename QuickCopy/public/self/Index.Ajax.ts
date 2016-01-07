

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

