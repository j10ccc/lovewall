var data = {};
var display = new Vue ({
    el: "#workArea",
    data: {
        content: '',
        object: ''
    },
    methods: {
        writeContent:function(e){
            this.content = e.target.value
        },
        writeObject:function(e){
            this.object = "—— " + e.target.value
        }
    }
})
function submit() {
    var content = $("#content").val();
    var tidyName = $("#tidyName").val();
    var userName = $("")
    var patrn = /^[A-Z]{1,5}$/; //缩写合法检测
    if (!patrn.exec(tidyName)) $(".advice")[1].style.color = "red";
    else $(".advice")[1].style.color = "gray";
     
    if (content == "") $(".advice")[0].style.color = "red";
    else $(".advice")[0].style.color = "gray";

    if (patrn.exec(tidyName) && content != "") {
        $(".advice")[1].style.color = "gray";
        content = content.replace(/\ +/g,""); //删除空格
        content = content.replace(/[\r\n]/g,""); //删除回车
        
        data.content = content;
        data.tidyName = tidyName;
        $.ajax({
            type: "POST",
            url: "http://localhost:8080/send_confess", //
            data: JSON.stringify(data),
            success: function(data) {alert("成功！")}, //根据后端返回判断是否注册成功
            error: function(jqXHR) {console.log("Error:" + jqXHR.status);}
        })
    }
}