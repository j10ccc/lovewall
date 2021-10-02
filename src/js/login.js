var data = {};

function submit(check){
    if (check == 1)
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/sign_up", //
        data: JSON.stringify(data),
        success: function(data) {alert("注册成功！")}, //根据后端返回判断是否注册成功
        error: function(jqXHR) {console.log("Error:" + jqXHR.status);}
    })
    else if (check == 2){
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/sign_in", 
            data: JSON.stringify(data),
            success: function(data) {alert("登录成功！")}, //根据后端返回判断是否登录成功
            error: function(jqXHR) {console.log("Error:" + jqXHR.status);}
        })
    }
}

function sign_in(){ //登录
    var userName = $("#userName").val();
    var password = $("#pass").val();
    data = {};
    data.userName = userName;
    data.password = md5(password);
    submit(2);
}

function sign_up(){ //注册
    var userName = $("#userName").val();
    var tidyName = $("#tidyName").val();
    var password1 = $("#pass1").val();
    var password2 = $("#pass2").val();
        
    var patrn1 = /^(\w){1,20}$/; //用户名合法检测
    if (!patrn1.exec(userName)) $(".advice")[0].style.color = "red";
    else $(".advice")[0].style.color = "gray";

    var patrn2 = /^[A-Z]{1,5}$/; //缩写合法检测
    if (!patrn2.exec(tidyName)) $(".advice")[1].style.color = "red";
    else $(".advice")[1].style.color = "gray";

    if (password1.length >=8 && password1.length <= 14){ //密码合法检测
        $(".advice")[2].style.color = "gray";
        if (password1 == password2  && patrn1.exec(userName) && patrn2.exec(tidyName)){ //确认密码合法检测
            $(".advice")[3].style.color = "gray";
            data = {};
            data.userName = userName;
            data.tidyName = tidyName;
            data.password = md5(password1); // 因为加密了，原密码格式不受限
            submit(1);
        }
        else {
            $(".advice")[3].style.color = "red";
        }
    }
    else {
        $(".advice")[2].style.color = "red";
    }
}