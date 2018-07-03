$(function () {
    var caseId=GetQueryString("caseId");
    var activeType= GetQueryString("activeType");
    var showGroup= GetQueryString("showGroup");
    var dateFrom= GetQueryString("dateFrom");
    var dateTo= GetQueryString("dateTo");
    var hotelKdt= GetQueryString("hotelKdt");
    var hotelName= GetQueryString("hotelName");
    if(activeType=="appraise"){
        $("#showService-btn").css("display","block");
    }
    $("#showService-btn").click(function () {
        window.location.href = 'evaluation.html?dateFrom='+dateFrom+'&dateTo='+dateTo+'&hotelKdt='+hotelKdt+'&hotelName='+hotelName+'&showGroup='+showGroup+'&caseId='+caseId;
    });
    $.ajax({
        url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!queryMaintainCaseIfo.action',
        dataType:'json',
        type:'post',
        data:{'caseId':caseId},
        success:function(data){
            console.log(data)
            if(data.result){
                $("#clientName").text(data.case.clientName);
                $("#clientName").attr("data-id",data.case.clientId);
                $("#caseId").text(data.case.id);
                $("#reportMan").text(data.case.reportMan);
                $("#reportDate").text(data.case.reportDate);
                $("#reportContent").text(data.case.reportContent);
                var caseDetalHTML="";
                for(var i=0;i<data.caseDetal.length;i++){
                    caseDetalHTML+="<li>"+data.caseDetal[i].maintainContent+"</li>"
                }
                $("#caseDetal").html(caseDetalHTML);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // 状态码
            console.log(XMLHttpRequest.status);
            // 状态
            console.log(XMLHttpRequest.readyState);
            // 错误信息
            console.log(textStatus);
        }
    })

})
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