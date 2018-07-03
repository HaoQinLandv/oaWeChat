$(function(){

    //用户userid
    var userId=sessionStorage.getItem("userId");
    //用户的权限
    var role=sessionStorage.getItem("role");
    //默认展现第一页
    var pageno=1;
    //选择的酒店名称
    var hotelName= GetQueryString("hotelName")==null ? $("#hotelName").text("选择报修酒店") : $("#hotelName").text(GetQueryString("hotelName"));
    //选择的酒店kdt
    var hotelKdt= GetQueryString("hotelKdt")==null ? $("#hotelName").attr("data-kdt","") : $("#hotelName").attr("data-kdt",GetQueryString("hotelKdt"));

    //历史报修时间
    if(GetQueryString("dateFrom")==null && GetQueryString("dateTo")==null){
        var date = new Date();
        var dateyes = new Date(new Date()-24*60*60*1000*30);
        var start=FormatDate(dateyes);//一个月前日期
        var end=FormatDate(date);//今天日期
        $("#dateFrom").text(start);
        $("#dateTo").text(end);
    }else{
        $("#dateFrom").text(GetQueryString("dateFrom"));
        $("#dateTo").text(GetQueryString("dateTo"));
    }
    //是否查看所有酒店
    var showGroup= GetQueryString("showGroup")==null ? $("#viewGroup").attr("data-type","N") : $("#viewGroup").attr("data-type",GetQueryString("showGroup"));
    if(GetQueryString("showGroup")=="N" || GetQueryString("showGroup")==null){
        $("#viewGroup").removeClass("active");
    }else{
        $("#viewGroup").addClass("active");
    }
    if(role=="集团负责人" || role=="集团报修人"){
        $("#viewGroup").text("查看本集团");
    }else if(role=="单店报修人"){
        $("#viewGroup").hide();
    }else if(role=="单店负责人"){
        $("#viewGroup").text("查看本酒店");
    }
    //选项卡
    $("#myService-tab li").click(function(){
        pageno=1;
        $("#caseList").html("");
        var that=$(this);
        var index=that.index();
        var dataType=$(this).attr("data-type");
        that.addClass("active").siblings().removeClass("active");
        if(dataType=="history"){
            $(".myService-bottom").css("padding-top","12.7rem");
            $(".myService-date").show();
            getDate.getMyService(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"),dataType,pageno,10,$("#dateFrom").text(),$("#dateTo").text());
        }else{
            $(".myService-bottom").css("padding-top","9.2rem");
            $(".myService-date").hide();
            getDate.getMyService(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"),dataType,pageno,10);
        }

        $(".myService-bottom ul").eq(index).show().siblings().hide();
    });
    //选择tab的活动页
    var activeType=GetQueryString("activeType");
    if(activeType==null){
        $("#myService-tab li").eq(0).click();
    }else{
        $("#myService-tab li[data-type="+activeType+"]").click();
    }
    //获取case总数
    getDate.queryAllCaseCountForOA(userId,$("#hotelName").attr("data-kdt") ,$("#viewGroup").attr("data-type"));

    //是否查看本集团
    $("#viewGroup").click(function () {
        if($(this).hasClass("active")){
            $(this).attr("data-type","N");
        }else{
            $(this).attr("data-type","Y");
        }
        $(this).toggleClass("active");
        $("#caseList").html("");
        getDate.queryAllCaseCountForOA(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"));
        if($("#myService-tab li.active").attr("data-type")=="history"){
            getDate.getMyService(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"),$("#myService-tab li.active").attr("data-type"),pageno,10,$("#dateFrom").text(),$("#dateTo").text());
        }else{
            getDate.getMyService(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"),$("#myService-tab li.active").attr("data-type"),pageno,10);
        }

    });

    //待处理 - 关闭case
    $("#caseList").on("click","li .close",function () {
        var that=$(this);
        getDate.closeUpTheCase(that.attr("data-id"),userId,that);

    });
    //待评价 - 投诉
    $("#caseList").on("click","li .complaints",function () {
        $(".layer-complaints").show();
        $(".layer").show();
    });
    $(".layer-complaints .btn1").click(function () {
        $(".layer-complaints").hide();
        $(".layer").hide();
    });
    //评价按钮
    $("#caseList").on("click",".evaluation",function () {
        window.location.href = 'evaluation.html?dateFrom='+$("#dateFrom").text()+'&dateTo='+$("#dateTo").text()+'&showGroup='+$("#viewGroup").attr("data-type")+'&hotelKdt='+$("#hotelName").attr("data-kdt")+'&hotelName='+$("#hotelName").text()+'&caseId='+$(this).attr("data-id");
    });
    //页面跳转日期选择
    $('.myService-date .span1').click(function(){
        window.location.href = 'checkDate.html?dateFrom='+$("#dateFrom").text()+'&dateTo='+$("#dateTo").text()+'&showGroup='+$("#viewGroup").attr("data-type")+'&hotelKdt='+$("#hotelName").attr("data-kdt")+'&hotelName='+$("#hotelName").text();
    })
    //页面跳转选择酒店页面
    $("#hotelName").click(function () {
        window.location.href = 'choseRepairHotel.html?home=1&activeType='+$("#myService-tab li.active").attr("data-type")+"&showGroup="+$("#viewGroup").attr("data-type")+'&dateFrom='+$("#dateFrom").text()+'&dateTo='+$("#dateTo").text();
    });
    //查看详情页面跳转
    $('#caseList').on("click",".showCase",function(){
        var caseId=$(this).attr("data-id");
        window.location.href = 'showService.html?caseId='+caseId+'&activeType='+$("#myService-tab li.active").attr("data-type")+"&showGroup="+$("#viewGroup").attr("data-type")+'&dateFrom='+$("#dateFrom").text()+'&dateTo='+$("#dateTo").text()+'&hotelKdt='+$("#hotelName").attr("data-kdt")+'&hotelName='+$("#hotelName").text();
    });
    //下拉加载更多
    $(window).bind("scroll",function (e) {
        var sum=$(document).height();
        if(sum==$(this).scrollTop()+$(this).height()){
            pageno++;
            if($("#myService-tab li.active").attr("data-type")=="history"){
                getDate.getMyService(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"),$("#myService-tab li.active").attr("data-type"),pageno,10,$("#dateFrom").text(),$("#dateTo").text());
            }else{
                getDate.getMyService(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"),$("#myService-tab li.active").attr("data-type"),pageno,10);
            }

        }
    })
});
function FormatDate(strTime){
    var date = new Date(strTime);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
};
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
var getDate={
    //查询帐号所管理的酒店case列表
    getMyService:function (userId,kdt,showGroup,status,current,pageSize,dateFrom,dateTo) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!queryCaseListForOA.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,'kdt':kdt,'showGroup':showGroup,'status':status,'current':current,'pageSize':pageSize,'dateFrom':dateFrom,'dateTo':dateTo},
            success:function(data){
                if(data.result){

                    var caseList=data.caseList;
                    if(status=="dispose"){
                        for(var i=0;i<caseList.length;i++){
                            var strHtml='';
                            strHtml+="<div class='empty'></div>";
                            strHtml+="<li>";
                            strHtml+="<p class='p1'>酒店名称："+caseList[i].clientName+"</p>";
                            strHtml+="<p class='p1'>case编号："+caseList[i].id+"</p>";
                            strHtml+="<p class='p2'><span>报修人："+caseList[i].reportMan+"</span><span class='time'>"+caseList[i].reportDate+"</span></p>";
                            strHtml+="<div class='content-box'>";
                            strHtml+="<p class='title'>报修内容:</p>";
                            strHtml+="<p class='content'>"+caseList[i].reportContent+"</p>";
                            strHtml+="</div>";
                            strHtml+="<div class='btn'>";
                            strHtml+="<input type='button' value='关闭CASE' class='btn1 close' data-id='"+caseList[i].id+"'>";
                            strHtml+="<input type='button' value='查看详情' class='btn2 showCase' data-id='"+caseList[i].id+"'>";
                            strHtml+="</div>";
                            strHtml+="</li>";
                            $("#caseList").append(strHtml);
                        }

                    }else if(status=="appraise"){
                        for(var i=0;i<caseList.length;i++){
                            var strHtml='';
                            strHtml+="<div class='empty'></div>";
                            strHtml+="<li>";
                            strHtml+="<p class='p1'>酒店名称："+caseList[i].clientName+"</p>";
                            strHtml+="<p class='p1'>case编号："+caseList[i].id+"</p>";
                            strHtml+="<p class='p2'><span>报修人："+caseList[i].reportMan+"</span><span class='time'>"+caseList[i].reportDate+"</span></p>";
                            strHtml+="<div class='content-box'>";
                            strHtml+="<p class='title'>报修内容:</p>";
                            strHtml+="<p class='content'>"+caseList[i].reportContent+"</p>";
                            strHtml+="<p class='deal'><span>处理人："+caseList[i].maintainMan+"</span><span class='time'>"+caseList[i].finishDate+"</span></p>"
                            strHtml+="</div>";
                            strHtml+="<div class='btn'>";
                            strHtml+="<input type='button' value='投诉' class='btn1 complaints'>";
                            strHtml+="<input type='button' value='查看详情' class='btn2 showCase' data-id='"+caseList[i].id+"'>";
                            strHtml+="<input type='button' value='评价' class='btn3 evaluation' data-id='"+caseList[i].id+"'>";
                            strHtml+="</div>";
                            strHtml+="</li>";
                            $("#caseList").append(strHtml);
                        }
                    }else{
                        for(var i=0;i<caseList.length;i++){
                            var strHtml='';
                            strHtml+="<div class='empty'></div>";
                            strHtml+="<li>";
                            strHtml+="<p class='p1'>酒店名称："+caseList[i].clientName+"</p>";
                            strHtml+="<p class='p1'>case编号："+caseList[i].id+"</p>";
                            strHtml+="<p class='p2'><span>报修人："+caseList[i].reportMan+"</span><span class='time'>"+caseList[i].reportDate+"</span></p>";
                            strHtml+="<div class='content-box'>";
                            strHtml+="<p class='title'>报修内容:</p>";
                            strHtml+="<p class='content'>"+caseList[i].reportContent+"</p>";
                            strHtml+="<p class='deal'><span>处理人："+caseList[i].maintainMan+"</span><span class='time'>"+caseList[i].finishDate+"</span></p>"
                            strHtml+="</div>";
                            strHtml+="<div class='btn'>";
                            strHtml+="<div class='stars'>";
                            strHtml+="<span>评价</span>";
                            strHtml+="<dl>";
                            for(var j=0;j<5;j++){
                                if(j<=caseList[i].CEY-1){
                                    strHtml+="<dd><img src='images/star_light@3x.png' /></dd>";
                                }else{
                                    strHtml+="<dd><img src='images/star_normal@3x.png' /></dd>";
                                }
                            }
                            strHtml+="</dl>";
                            strHtml+="</div>";
                            strHtml+="<input type='button' value='查看详情' class='btn2 showCase' data-id='"+caseList[i].id+"'>";
                            strHtml+="</div>";
                            strHtml+="</li>";
                            $("#caseList").append(strHtml);
                        }
                    }
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
    },
    //查询所有CASE数量的接口
    queryAllCaseCountForOA:function (userId,kdt,showGroup) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!queryAllCaseCountForOA.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,'kdt':kdt,'showGroup':showGroup},
            success:function(data){
                console.log(data)
                if(data.result){
                    $("#disposeCount").text(data.disposeCount);
                    $("#appraiseCount").text(data.appraiseCount);
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
    },
    //关闭case
    closeUpTheCase:function (caseId,userId,that) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!closeUpTheCase.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,'caseId':caseId},
            success:function(data){
                if(data.result){
                    alert(data.msg);
                    that.parents("li").prev().remove();
                    that.parents("li").remove();
                    getDate.queryAllCaseCountForOA(userId,$("#hotelName").attr("data-kdt"),$("#viewGroup").attr("data-type"));
                }else{
                    alert(data.msg);
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
    }
}