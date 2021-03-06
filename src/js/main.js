var userName, myTidyName;
var noteColor = [
    "mdui-color-amber-100",
    "mdui-color-blue-100",
    "mdui-color-red-100",
    "mdui-color-purple-100"
];
$(document).ready(function () {
    $("#userName").html(getDataFromURL());
    if (userName == undefined) {
        alert("非法访问！");
        window.location.href = "/";
        return;
    }
    else if (userName == "undefined") {
        alert("你的手速太快了，请重新登录！");
        window.location.href = "/";
        return;
    }
    getMessConfess();
});
function getDataFromURL() {
    userName = window.location.search.split("=")[1]; //从 URL 获取 用户名
    return userName
}
function getMessConfess() {
    $.ajax({
        type: "GET",
        url: "http://81.69.253.122:1234/main",
        data: "user=" + userName,
        success: function (data) {
            var ele0 = $(".note");
            var ele1 = $(".sheet");
            var ele2 = $(".object");
            var ele3 = $(".check");
            var ele4 = $(".writer");
            myTidyName = data.myTidyName;
            // TODO writer 匿名 Anon
            for (var i = 1; i <= data.content.length - 1; i++) { //用户自己发表的表白要 pin 在墙头
                ele0[i - 1].className = "mdui-card note " + noteColor[Number(data.color[i])];
                ele1[i - 1].innerHTML = data.content[i];
                ele2[i - 1].innerHTML = "To " + data.tidyName[i];
                ele3[i - 1].innerHTML = "No." + data.id[i];
                if (data.anonymous[i] == "n") ele4[i - 1].innerHTML = "—— " + data.username[i];
                else ele4[i - 1].innerHTML = "—— Anon";
            }
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    });
}
function comment(num) {
    // 评论区初始化
    $("#cover").css("display", "block");
    $("#container").css("display", "block");
    $("#preview-note").attr("class", "mdui-card " + $(".note")[num].className.split(" ")[2]);
    $("#preview-writer").html($(".writer")[num].innerHTML);
    $("#preview-sheet").html($(".sheet")[num].innerHTML);
    $("#preview-check").html($(".check")[num].innerHTML);
    $("#preview-object").html($(".object")[num].innerHTML);
    $("#commentContent").val("");
    $("#submitInfo span")[0].innerHTML = "用户名：" + userName;
    $("#submitInfo span")[1].innerHTML = "你姓名的英文缩写：" + myTidyName;
    var confessid = $(".check")[num].innerHTML.split(".")[1];
    $.ajax({
        type: "GET",
        url: "http://81.69.253.122:1234/manage_comment",
        data: "confessid=" + confessid, // GET请求发送字符串
        success: function (data) {
            var ele = $("#publicContainer");
            ele.html("");
            if (data.content.length != 0) $("#counter").html(String(data.content.length) + "条评论");
            else $("#counter").html("·还没有评论呢，快来抢沙发吧！");
            for (var i = 1; i <= data.content.length; i++) {
                ele.prepend("<div class='each_comment'><div class='commtentInfo'><span class='commentTidyName'>" + data.tidyName[i - 1] + "</span><span><a>" + String(i) + "楼</a><a>回复</a></span></div><div class='content'><p>" + data.content[i - 1] + "</p></div></div>");
            }
            console.log(data.content + " " + data.tidyName);
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    });
}
function submitComment() {
    var content = $("#commentContent").val();
    var id = $("#preview-check").html().split(".")[1];
    var data = {};
    data.tidyName = myTidyName;
    data.content = content;
    data.userName = userName;
    data.uid = id;
    $.ajax({
        type: "POST",
        url: "http://81.69.253.122:1234/send_comment",
        data: JSON.stringify(data),
        success: function (data) {
            if (data.back = "succeed") alert("发送成功！"), location.reload();
            else alert("发送失败！");
        },
        error: function (jqXHR) { console.log("Error:" + jqXHR.status); }
    })
}
function toAdd() {
    window.location.href = "/userManager/add/?user=" + $("#userName").html();
}
function quit() {
    window.location.href = "/";
}
function closeComment() {
    $("#cover").css("display", "none");
    $("#container").css("display", "none");
}