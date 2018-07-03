$(function(){
    var userIdSession=sessionStorage.getItem("userId");
    var roleSession=sessionStorage.getItem("role");
    getData.queryBannerUser(userIdSession,roleSession);
    //仿安卓按钮
    $("#userList").on("click",".userService-right .appleswitch",function(){
        var that=$(this);
        var className=that.attr("class");
        var newClassName;
        if (className.indexOf('switch-on') > 0 ) {
            $(this).find(".switch-button").animate({left:'0'},'fast');
            $(this).find(".switch-bg").animate({width:'0'},'fast');
            newClassName = className.replace(/switch-on/,'switch-off');
            getData.changeHotelUserHalt(userIdSession,"Y");
        }else{
            $(this).find(".switch-button").animate({left:1.6+'rem'},'fast');
            $(this).find(".switch-bg").animate({width:3.6+'rem'},'fast');
            if (className.indexOf('switch-off') < 0) {
                newClassName = className+" switch-on";
            }else{
                newClassName =  className.replace(/switch-off/,'switch-on')
            }
            getData.changeHotelUserHalt(userIdSession,"N");
        }
        that.attr('class',newClassName)
    });
    //角色切换
    $("#userList").on("click",".userService .userService-role",function () {
        var hotelId=$("#userHotel").attr("data-hotelId");
        if(hotelId!="" && hotelId!=undefined){
            $(".layer-role").show();
            $(".layer").show();
        }else{
            alert("请先选择酒店！");
        }

    });
    $(".layer-role ul li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    });
    $(".layer-role .btn .btn1").click(function () {
        $(".layer-role").hide();
        $(".layer").hide();
    });
    $(".layer-role .btn .btn2").click(function () {
        var hotelId=$("#userHotel").attr("data-hotelId");
        var roleType=$("#roleType li.active").attr("data-role");
        getData.adjustHotelUser(userIdSession,hotelId,roleType);
        $(".layer-role").hide();
        $(".layer").hide();
    });
});
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
                    var userHotel=$("#userHotel").attr("data-name");
                    var userMap=data.userMap;
                    for(key in userMap){
                        for(var i=0;i<userMap[key].length;i++){
                            var userHTML="";
                            if(userHotel=="" || userHotel==undefined){
                                userHTML+="<div class='userService'>";
                                userHTML+="<div class='userService-left left'>";
                                userHTML+="<p class='hotel'>"+key+"</p>";
                                userHTML+="<p class='name'>"+userMap[key][i].userName+"<span>"+userMap[key][i].userPhone+"</span></p>";
                                userHTML+="<p class='level'>"+userMap[key][i].role+"</p>";
                                userHTML+="</div>";

                                userHTML+="<div class='userService-right right'>";
                                userHTML+="<div class='appleswitch switch-off' data-id='"+userMap[key][i].id+"'>";
                                userHTML+="<div class='switch-button' style='left: 0px;'></div>";
                                userHTML+="<div class='switch-bg' style='width: 0px;'></div>";
                                userHTML+="</div>";
                                if(role=="集团负责人"){
                                    if(userMap[key][i].role=="集团报修人" || userMap[key][i].role=="单店报修人"){
                                        userHTML+="<img src='images/role_switch@3x.png' class='userService-role' data-id='"+userMap[key][i].id+"'/>";
                                    }

                                }

                                userHTML+="</div>";
                                userHTML+="</div>";
                                $("#userList").append(userHTML);
                            }else if(key==userHotel){
                                userHTML+="<div class='userService'>";
                                userHTML+="<div class='userService-left left'>";
                                userHTML+="<p class='hotel'>"+key+"</p>";
                                userHTML+="<p class='name'>"+userMap[key][i].userName+"<span>"+userMap[key][i].userPhone+"</span></p>";
                                userHTML+="<p class='level'>"+userMap[key][i].role+"</p>";
                                userHTML+="</div>";
                                userHTML+="<div class='userService-right right'>";
                                userHTML+="<div class='appleswitch switch-off' data-id='"+userMap[key][i].id+"'>";
                                userHTML+="<div class='switch-button' style='left: 0px;'></div>";
                                userHTML+="<div class='switch-bg' style='width: 0px;'></div>";
                                userHTML+="</div>";
                                if(role=="集团负责人"){
                                    userHTML+="<img src='images/role_switch@3x.png' class='userService-role' data-id='"+userMap[key][i].id+"'/>";
                                }

                                userHTML+="</div>";
                                userHTML+="</div>";
                                $("#userList").append(userHTML);
                            }
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