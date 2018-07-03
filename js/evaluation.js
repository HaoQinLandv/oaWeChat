$(function(){
    var caseId=GetQueryString("caseId");
    var showGroup= GetQueryString("showGroup");
    var dateFrom= GetQueryString("dateFrom");
    var dateTo= GetQueryString("dateTo");
    var hotelKdt= GetQueryString("hotelKdt");
    var hotelName= GetQueryString("hotelName");
    $("#caseId").text(caseId);
  //是否解决
    $("#solve li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    //评星
    $("#starLevel li").click(function () {
        var that=$(this);

        that.addClass("active").prevAll().addClass("active");
        that.nextAll().removeClass("active");
        var level=$("#starLevel li.active").length;
        if(level==5){
            $("#feedback-text").text("我们哪些方面让您满意！");
            $("#feedback").html("<li>服务态度诚恳</li><li>回答及时</li><li>完美解决问题</li><li>有礼貌</li>");
        }else{
            $("#feedback-text").text("存在以下哪些问题？");
            $("#feedback").html("<li>服务态度差</li><li>回答不及时</li><li>没解决问题</li><li>不礼貌</li>");
        }
    });
    //其他建议
    $("#feedback").on('click','li',function () {
        $(this).addClass("active");
    });
    //文本框字数监控
    $("#otherText").keyup(function () {
        var num=$(this).val();
        $("#numWord").text(num.length);
    });

    //提交
    $(".evaluation-btn").click(function(){
        var param={};
        param.caseId=caseId;
        param.solved=$("#solve li.active").text();
        param.star=$("#starLevel li.active").length;
        var feedback=[];
        $("#feedback li.active").each(function () {
            feedback.push($(this).text());
        })
        param.feedback=feedback.join(",");
        param.comments=$("#otherText").val();
        $.ajax({
            type: "post",
            url: "http://dev.foxhis.com:944/westsoftOA/common/ttvncInterface_action!SaveTtvncEvaluate.action",
            data:param,
            dataType: "json",
            success:function (data) {
                if(data.result){
                    alert(data.msg);
                    window.location.href = 'myService.html?hotelName='+hotelName+'&hotelKdt='+hotelKdt+'&activeType=1&showGroup='+showGroup+'&dateFrom='+dateFrom+'&dateTo='+dateTo;
                }
                console.log(data)
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
            }
        });
    });

});
// 用正则表达式获取地址栏参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if(r!=null) {
        return  decodeURI(r[2]);
    } else {
        return null;
    }
}