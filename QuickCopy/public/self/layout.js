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
    function signupop() {
        options.submitHandler = function (form) {
            $.ajax({
                url: "/user/signup",
                data: {
                    name: $("#signupName").val(),
                    password: $("#signupPassword").val(),
                    email: $("#signupEmail").val()
                },
                type: 'post',
                cache: false,
                success: function (data) {
                    if (data == "success") {
                        $('#signupModal').modal('hide');
                        toaWin("注册成功！请尝试新的内容");
                    }
                    else {
                        toaWin("注册失败！" + data, "error");
                    }
                },
                error: function (err) {
                    errHandle(err);
                }
            });
        };
        return options;
    }
    function signinop() {
        options.submitHandler = function (form) {
            $.ajax({
                url: "/user/signin",
                data: {
                    name: $("#signinName").val(),
                    password: $("#signinPassword").val()
                },
                type: 'post',
                cache: false,
                success: function (data) {
                    if (data == "success") {
                        $('#signinModal').modal('hide');
                        toaWin("登录成功！请尝试新的内容");
                    }
                    else {
                        toaWin("注册失败！" + data, "error");
                    }
                },
                error: function (err) {
                    errHandle(err);
                }
            });
        };
        return options;
    }
    $("#signupForm").validate(signupop());
    $("#signinForm").validate(signinop());
});
function errHandle(err) {
    alert("似乎是通信异常！请查看错误信息：" + err);
}
function toaWin(content, state) {
    if (state === void 0) { state = "success"; }
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
    };
    toastr[state](content);
}
//# sourceMappingURL=layout.js.map