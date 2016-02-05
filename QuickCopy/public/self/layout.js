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
    function replaceClass(pp, oldcls, newcls) {
        var cln = pp.className;
        cln = cln.replace(oldcls, "");
        if (cln.indexOf(newcls) == -1) {
            cln += " " + newcls;
        }
        pp.className = cln;
    }
    //对注册登录输入输出进行校验
    var options = {
        showErrors: function (errorMap, errorList) {
            errorList.forEach(function (p) {
                replaceClass(p.element.parentElement, "has-success", "has-error");
            });
            this.defaultShowErrors();
        },
        success: function (label) {
            var fg = label.parent(".form-group");
            fg.removeClass("has-error").addClass("has-success");
        },
        rules: {
            name: "required",
            password: {
                required: true,
                minlength: 5
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            name: "请输入姓名",
            email: {
                required: "请输入Email地址",
                email: "请输入正确的email地址"
            },
            password: {
                required: "请输入密码",
                minlength: "密码不能小于5个字符"
            }
        }
    };
    $("form").validate(options);
});
//# sourceMappingURL=layout.js.map