$(function(){
    var userIdSession=sessionStorage.getItem("userId");
    var roleSession=sessionStorage.getItem("role");
    getData.queryBannerUser(userIdSession,roleSession);

    //选择的酒店名称
    var hotelName= GetQueryString("hotelName")==null ? $("#userHotel").text("选择报修酒店") : $("#userHotel").text(GetQueryString("hotelName"));
    //选择的酒店kdt
    var hotelKdt= GetQueryString("hotelKdt")==null ? $("#userHotel").attr("data-kdt","") : $("#userHotel").attr("data-kdt",GetQueryString("hotelKdt"));


    //仿安卓按钮
    $("#userList").on("click",".userService-right .appleswitch",function(){
        var that=$(this);
        var className=that.attr("class");
        var thisUserId=that.attr("data-id");
        var newClassName;
        if (className.indexOf('switch-on') > 0 ) {
            $(this).find(".switch-button").animate({left:'0'},'fast');
            $(this).find(".switch-bg").animate({width:'0'},'fast');
            newClassName = className.replace(/switch-on/,'switch-off');
            getData.changeHotelUserHalt(thisUserId,"N");
        }else{
            $(this).find(".switch-button").animate({left:1.6+'rem'},'fast');
            $(this).find(".switch-bg").animate({width:3.6+'rem'},'fast');
            if (className.indexOf('switch-off') < 0) {
                newClassName = className+" switch-on";
            }else{
                newClassName =  className.replace(/switch-off/,'switch-on')
            }
            getData.changeHotelUserHalt(thisUserId,"Y");
        }
        that.attr('class',newClassName)
    });
    //角色切换
    $("#userList").on("click",".userService .userService-role",function () {
        var thisRoleType=$(this).parents("li").find(".userService-left .name span").text();
        var thisUserId=$(this).attr("data-id");
        window.location.href = 'userChoseRepairHotel.html?hotelKdt='+$("#userHotel").attr("data-kdt")+'&hotelName='+$("#userHotel").text()+'&thisRoleType='+thisRoleType+'&thisUserId='+thisUserId;
    });

    //跳转到酒店选择
    $("#userHotel").click(function () {
        window.location.href = 'choseRepairHotel.html?home=2&hotelKdt='+$("#userHotel").attr("data-kdt")+'&hotelName='+$("#userHotel").text();
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
var getData={
    //获取用户权限下可管理的用户
    queryBannerUser:function (userId ,role) {
        $("#userList").html("");
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!queryBannerUser.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId},
            success:function(data){
                console.log(data)
                if(data.result){
                    var userHotel=$("#userHotel").attr("data-kdt");
                    var userMap=data.userMap;
                    for(key in userMap){
                        if(userHotel=='' || userHotel==undefined){
                            var usersHTML="";
                            usersHTML+="<div class='empty'></div>";
                            usersHTML+="<div class='userService'>";
                            usersHTML+="<p class='hotelName'>"+key+"</p>";
                            usersHTML+="<ul class='userService-box'>";
                            for(var i=0;i<userMap[key].length;i++){
                                var userHTML="";
                                userHTML+="<li>";
                                userHTML+="<div class='userService-left left'>";

                                userHTML+="<p class='name'>"+userMap[key][i].userName;
                                if(userMap[key][i].role=="集团负责人"){
                                    userHTML+="<span class='color1'>集团负责人</span>"
                                }else if(userMap[key][i].role=="集团报修人"){
                                    userHTML+="<span class='color2'>集团报修人</span>"
                                }else if(userMap[key][i].role=="单店负责人"){
                                    userHTML+="<span class='color3'>单店负责人</span>"
                                }else if(userMap[key][i].role=="单店报修人"){
                                    userHTML+="<span class='color4'>单店报修人</span>"
                                }
                                userHTML+="</p>";
                                userHTML+="<p class='tel'>"+userMap[key][i].userPhone+"</p>";
                                userHTML+="</div>";
                                userHTML+="<div class='userService-right right'>";
                                if(userMap[key][i].isHalt=="N"){
                                    userHTML+="<div class='appleswitch switch-off' data-id='"+userMap[key][i].id+"'>";
                                    userHTML+="<div class='switch-button' style='left: 0px;'></div>";
                                    userHTML+="<div class='switch-bg' style='width: 0px;'></div>";
                                    userHTML+="</div>";
                                }else{
                                    userHTML+="<div class='appleswitch switch-on' data-id='"+userMap[key][i].id+"'>";
                                    userHTML+="<div class='switch-button' style='left: 1.6rem;'></div>";
                                    userHTML+="<div class='switch-bg' style='width: 3.6rem;'></div>";
                                    userHTML+="</div>";
                                }

                                if(userMap[key][i].role=="集团报修人" || userMap[key][i].role=="单店报修人"){
                                    userHTML+="<img src='images/role_switch@3x.png' class='userService-role' data-id='"+userMap[key][i].id+"'/>";
                                }

                                userHTML+="</div>";
                                userHTML+="</li>";
                                usersHTML+=userHTML;
                            }
                            usersHTML+="</ul>";
                            usersHTML+="</div>";
                            $("#userList").append(usersHTML);
                        }else if(key==$("#userHotel").text()){
                            var usersHTML="";
                            usersHTML+="<div class='empty'></div>";
                            usersHTML+="<div class='userService'>";
                            usersHTML+="<p class='hotelName'>"+key+"</p>";
                            usersHTML+="<ul class='userService-box'>";
                            for(var i=0;i<userMap[key].length;i++){
                                var userHTML="";
                                userHTML+="<li>";
                                userHTML+="<div class='userService-left left'>";

                                userHTML+="<p class='name'>"+userMap[key][i].userName;
                                if(userMap[key][i].role=="集团负责人"){
                                    userHTML+="<span class='color1'>集团负责人</span>"
                                }else if(userMap[key][i].role=="集团报修人"){
                                    userHTML+="<span class='color2'>集团报修人</span>"
                                }else if(userMap[key][i].role=="单店负责人"){
                                    userHTML+="<span class='color3'>单店负责人</span>"
                                }else if(userMap[key][i].role=="单店报修人"){
                                    userHTML+="<span class='color4'>单店报修人</span>"
                                }
                                userHTML+="</p>";
                                userHTML+="<p class='tel'>"+userMap[key][i].userPhone+"</p>";
                                userHTML+="</div>";
                                userHTML+="<div class='userService-right right'>";
                                if(userMap[key][i].isHalt=="N"){
                                    userHTML+="<div class='appleswitch switch-off' data-id='"+userMap[key][i].id+"'>";
                                    userHTML+="<div class='switch-button' style='left: 0px;'></div>";
                                    userHTML+="<div class='switch-bg' style='width: 0px;'></div>";
                                    userHTML+="</div>";
                                }else{
                                    userHTML+="<div class='appleswitch switch-on' data-id='"+userMap[key][i].id+"'>";
                                    userHTML+="<div class='switch-button' style='left: 1.6rem;'></div>";
                                    userHTML+="<div class='switch-bg' style='width: 3.6rem;'></div>";
                                    userHTML+="</div>";
                                }

                                if(userMap[key][i].role=="集团报修人" || userMap[key][i].role=="单店报修人"){
                                    userHTML+="<img src='images/role_switch@3x.png' class='userService-role' data-id='"+userMap[key][i].id+"'/>";
                                }

                                userHTML+="</div>";
                                userHTML+="</li>";
                                usersHTML+=userHTML;
                            }
                            usersHTML+="</ul>";
                            usersHTML+="</div>";
                            $("#userList").append(usersHTML);
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
    //酒店用户的权限是否开启
    changeHotelUserHalt:function (userId,halt) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!changeHotelUserHalt.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,"halt":halt},
            success:function(data){
                console.log(data)
                if(data.result){
                    console.log(data.msg);
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
    //调整酒店用户的权限
    adjustHotelUser:function (userId,hotelId,role) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!adjustHotelUser.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,"hotelId":hotelId,"role":role},
            success:function(data){
                console.log(data)
                if(data.result){
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