$(function(){
    var userId = sessionStorage.getItem('userId',userId);//获取userId
	var thisRoleType=GetQueryString("thisRoleType");
	var thisUserId=GetQueryString("thisUserId");
    var hotelName = GetQueryString("hotelName");//酒店名
    var hotelKdt = GetQueryString("hotelKdt");//酒店服务号


	if(thisRoleType=="集团报修人"){
		$("#roleType li").eq(0).addClass("active").siblings().removeClass("active");
	}else{
        $("#roleType li").eq(1).addClass("active").siblings().removeClass("active");
	}

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


    
    //获取酒店名称列表
    function getHotelNameList(searchKey){
    	$.ajax({
		    url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!queryAllHotelByUser.action',
		    dataType:'json',
		    type:'get',
		    data:{'userId':userId,'serchKey':searchKey},
		    success:function(data){
		        console.log(data);
		        $('.listMsg li').remove();
		        if(data.hotelList.length <= 0 && searchKey!= ''){
		        	alert('未找到查询酒店');
		        }else{
		        	for(var i=0;i<data.hotelList.length;i++){
                        $('.listMsg').append("<li id='"+data.hotelList[i].id+"' kdt='"+data.hotelList[i].kdt+"'>"+data.hotelList[i].clientName+"</li>")
			        }
		        }
			    $('.listMsg li').click(function(){
			        hotelName = this.innerHTML;
			        hotelId = $(this).attr('id');
			        hotelKdt = $(this).attr('kdt');
			       $(this).siblings('li').removeClass('selected-hotel');
			       $(this).addClass('selected-hotel');
                    if(thisRoleType=="集团报修人"){
                        $("#roleType li").eq(0).addClass("active").siblings().removeClass("active");
                    }else{
                        $("#roleType li").eq(1).addClass("active").siblings().removeClass("active");
                    }
                    $(".layer-role").show();
                    $(".layer").show();
			    });
                $(".layer-role ul li").click(function () {
                    $(this).addClass("active").siblings().removeClass("active");
                });
                $(".layer-role .btn .btn1").click(function () {
                    $(".layer-role").hide();
                    $(".layer").hide();
                });
                $(".layer-role .btn .btn2").click(function () {
                    var hotelId=$(".listMsg li.selected-hotel").attr("id");
                    var roleType=$("#roleType li.active").attr("data-role");
                    adjustHotelUser(thisUserId,hotelId,roleType);

                });
		    },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
                console.log(textStatus);
            }
    	});
	};

    getHotelNameList();
    //返回上一页
	$('.backBtn').click(function(){
        // window.location.href = 'newRepair.html?hotelName='+hotelName+'&hotelId='+hotelId;
        window.history.go(-1);
    })
    //搜索酒店名    
    $('.searchBtn').click(function(){
        var serarchMsg = $('#searchMsg').val();
        getHotelNameList(serarchMsg);
    });
    //调整酒店用户的权限
    function adjustHotelUser(userId,hotelId,role) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!adjustHotelUser.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,"hotelId":hotelId,"role":role},
            success:function(data){
                console.log(data)
                if(data.result){
                    alert(data.msg);
                    $(".layer-role").hide();
                    $(".layer").hide();
                    window.location.href = 'userService2.html?hotelName='+hotelName+'&hotelKdt='+hotelKdt;
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
})
