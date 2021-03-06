var data = {};
var userName, id, colornum = 0;
var flag = false;
var display = new Vue({
    el: "#workArea",
    data: {
        content: '',
        object: '',
        len: '0',
        writer: 'Anon',
        anon: []
    },
    mounted() {
        window.object = this.object;
    },
    methods: {
        inputContent: function () {
            this.len = this.content.length;
            this.object = object;
        },
        changeColor: function (num) {
            for (var i = 0; i < 4; i++) {
                if (i == num) $(".color")[i].className = "color mdui-btn mdui-btn-active";
                else $(".color")[i].className = "color mdui-btn";
            }
            let color = $(".mdui-icon")[num].className.split("mdui-text-color-")[1];
            $(".note")[0].className = "note mdui-card mdui-color-" + color;
            colornum = num;
        },
        changeAnon: function (anon) {
            this.writer = !anon.state ? "Anon" : userName;
            anon.state = !anon.state;
        }
    },
})

$(document).ready(function () {
    if (window.location.search.split("=")[1] == undefined) {
        alert("非法访问！");
        window.location.href = "/";
    }
    else if (window.location.search.split("=")[1] == "undefined") {
        alert("你的手速太快了，请重新登录！");
        window.location.href = "/";
    }
    else if (window.location.search.split("&")[1] == undefined) {
        flag = true; //添加模式
        userName = window.location.search.split("=")[1]; //从 URL 获取 用户名
        $("#userName").html(userName);
    }
    else { //编辑模式
        flag = false;
        userName = window.location.search.split("&")[0].split("=")[1];
        $("#userName").html(userName);
        $(".advice")[2].innerHTML = "编辑时禁止修改表白对象";
        $("#box2").remove();
        $("#tidyName").attr("disabled", "disabled"); //禁止修改表白对象
        id = window.location.search.split("&")[1].split("=")[1];
        editLaunch(id);
    }
});
function submit() {
    var content = $("#content").val();
    var tidyName = $("#tidyName").val();
    var patrn = /^[A-Z]{1,5}$/; //缩写合法检测
    if (!patrn.exec(tidyName)) $(".advice")[2].style.color = "red";
    else $(".advice")[2].style.color = "gray";

    if (content == "") $(".advice")[0].style.color = "red";
    else $(".advice")[0].style.color = "gray";

    if (patrn.exec(tidyName) && content != "") {
        $(".advice")[2].style.color = "gray";
        content = content.replace(/[\r\n]/g, ""); //删除回车

        if (flag == true) {
            data.userName = userName;
            data.content = content;
            data.tidyName = tidyName;
            data.anonymous = document.getElementById("anon").checked ? "y" : "n";
            data.color = String(colornum);
            console.log(data);
            // TODO
            $.ajax({
                type: "POST",
                url: "http://81.69.253.122:1234/send_confess",
                data: JSON.stringify(data),
                success: function (data) { alert("添加成功！"); location.reload(); }, //根据后端返回判断是否发送成功
                error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
            })
        }
        else {
            data.contentnew = content;
            data.id = id;
            $.ajax({
                type: "POST",
                url: "http://81.69.253.122:1234/edit_confess",
                data: JSON.stringify(data),
                success: function (data) { alert("编辑成功！"); toManage(); }, //根据后端返回判断是否发送成功
                error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
            })
        }
    }
}
function editLaunch(id) {  //加载编辑模式
    $.ajax({
        type: "GET",
        url: "http://81.69.253.122:1234/edit_confess",
        data: "id=" + id,
        success: function (data) {
            $("#content").val(data.content); //输入框 1
            $("#tidyName").val(data.tidyname); //输入框 2
            object = data.tidyname;
            $(".object")[0].innerHTML = "To " + data.tidyname;
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    });
}
function quit() {
    window.location.href = "/";
}
function toMain() {
    window.location.href = "/main/?user=" + userName;
}
function toManage() {
    window.location.href = "/userManager/manage/?user=" + userName;
}