$(function () {
    
   var sch = $(document).height() - $(window).height();
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
});