$(function () {
    var userId=sessionStorage.getItem("userId");
    getData.queryAllHotelByUser(userId,"");

    //左右滑出删除按钮
    $("#manageHotel-list").on("touchstart", function(e) {
        // 判断默认行为是否可以被禁用
        if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }
        startX = e.originalEvent.changedTouches[0].pageX,
            startY = e.originalEvent.changedTouches[0].pageY;
    });
    $("#manageHotel-list").on("touchend",'li', function(e) {
        // 判断默认行为是否可以被禁用
        if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }
        moveEndX = e.originalEvent.changedTouches[0].pageX,
            moveEndY = e.originalEvent.changedTouches[0].pageY,
            X = moveEndX - startX,
            Y = moveEndY - startY;
        //右滑
        if ( X > 0 ) {
            console.log('右滑');
            $(this).find(".delete").animate({
                right: "-6.5rem"
            }, 500);
        }
        //左滑
        else if ( X < 0 ) {
            console.log('左滑');
            $(this).siblings().find(".delete").animate({
                right: "-6.5rem"
            },500);
            $(this).find(".delete").animate({
                right: "0"
            }, 500);
        }
        //下滑
        else if ( Y > 0) {
            console.log('下滑');
        }
        //上滑
        else if ( Y < 0 ) {
            alconsole.logert('上滑');
        }
        //单击
        else{
            console.log('单击');
        }
    });
    
    //全选
    $("#allSelect").click(function () {
        var className=$(this).attr("class");
        if(className.indexOf("active")>0){
            $(this).removeClass("active");
            $("#manageHotel-list li").removeClass("active");
        }else{
            $(this).addClass("active");
            $("#manageHotel-list li").addClass("active");
        }
    });
    //选中某酒店
    $("#manageHotel-list").on("touchend click","li .check",function (e) {
        e.stopPropagation();
        $(this).parent().toggleClass("active");
    });
    //删除
    $("#deleteSelect").click(function(){
        var checkArr=$("#manageHotel-list li.active");
        var txtArr=[];
        if(checkArr.length>0){
            for( var i=0;i<checkArr.length;i++){
                txtArr.push(checkArr[i].dataset.kdt);
            }
            var delsuccess=getData.delBoundHotel(userId,txtArr.join(","));
            if(delsuccess==true){
                $("#manageHotel-list li.active").remove();
            }

        }else{
            alert("请选择要删除的酒店");
        }
    });
    $("#manageHotel-list").on("touchend click","li .delete",function (e) {
        e.stopPropagation();
        var kdtId=$(this).attr("data-kdt");
        var delsuccess=getData.delBoundHotel(userId,kdtId);
        if(delsuccess==true){
            $(this).parent().remove();
        }
    });
    //添加
    $('.manageHotel-add').click(function(){
        window.location.href = 'addHotel.html';
    });
});
var getData={
    //查询已绑定的酒店
    queryAllHotelByUser:function (userId,serchKey) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!queryAllHotelByUser.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,'serchKey':serchKey},
            success:function(data){
                if(data.result){
                    var hotelList=data.hotelList;
                    if(hotelList<=0){
                        $(".manageHotel-blank").show();
                        $(".manageHotel-list").hide();
                    }else{
                        $(".manageHotel-blank").hide();
                        $(".manageHotel-list").show();
                        for(var i=0;i<hotelList.length;i++){
                            var strHTML="";
                            strHTML+="<li data-kdt='"+hotelList[i].kdt+"'>";
                            strHTML+="<div class='check'></div>";
                            strHTML+="<span>"+hotelList[i].clientName+"</span>";
                            strHTML+="<input class='delete' type='button' value='删除' data-kdt='"+hotelList[i].kdt+"' />";
                            strHTML+="</li>";
                            $("#manageHotel-list ul").append(strHTML);
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
    //删除已绑定的酒店
    delBoundHotel:function (userId,kdt) {
        var delType=true;
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!delBoundHotel.action',
            dataType:'json',
            type:'post',
            async:false,
            data:{'userId':userId,'kdt':kdt},
            success:function(data){
                if(data.result){
                    if($("#manageHotel-list li").lenth<=0){
                        $(".manageHotel-blank").show();
                        $(".manageHotel-list").hide();
                    }else {
                        $(".manageHotel-blank").hide();
                        $(".manageHotel-list").show();
                    }
                    alert(data.msg);
                }else{
                    delType=false
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
                console.log(textStatus);
                delType=false;
            }
        })
        return delType
    }
}