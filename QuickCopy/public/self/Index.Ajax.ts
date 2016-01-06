

function ShowQR(data) {
    jQuery('#qrcodeCanvas').empty();
    jQuery('#qrcodeCanvas').qrcode({
        label:"QR",
        text: data
    	}); 

  // alert(data);
}

