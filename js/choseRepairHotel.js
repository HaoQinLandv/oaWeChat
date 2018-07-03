$(function(){
    var userId = sessionStorage.getItem('userId',userId);//获取userId
	//选择酒店
    var hotelName = '';//酒店名
    var hotelId = '';//酒店Id
    var hotelKdt = '';//酒店服务号
    // 用正则表达式获取地址栏参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);

        if(r!=null) {
            return  unescape(r[2]);
        } else {
            return null;
        }
    }

    //判断是从哪个页面跳转过来的，就返回到相应页面
    function toPrevPage(){
    	var whichPage = GetQueryString("home");
	    switch(whichPage){
	    	case '0' :{
	    		window.location.href = 'newRepair.html?hotelName='+hotelName+'&hotelId='+hotelId;
	    		break;
	    	};
	    	case '1' :{
	    		var activeType= GetQueryString("activeType");
	    		var showGroup= GetQueryString("showGroup");
                var dateFrom= GetQueryString("dateFrom");
                var dateTo= GetQueryString("dateTo");
	    		window.location.href = 'myService.html?hotelName='+hotelName+'&hotelId='+hotelId+'&hotelKdt='+hotelKdt+'&activeType='+activeType+'&showGroup='+showGroup+'&dateFrom='+dateFrom+'&dateTo='+dateTo;
	    		break;
	    	};
	    	case '2' :{
	    		window.location.href = 'userService2.html?hotelName='+hotelName+'&hotelId='+hotelId+'&hotelKdt='+hotelKdt;
	    		break;
	    	};
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
			        console.log(hotelId)
			       $(this).siblings('li').removeClass('selected-hotel');
			       $(this).addClass('selected-hotel');
			       toPrevPage();
			    });
		    },
		    error:function(msg){
		        alert(msg);
	    	}
    	});
	};

    getHotelNameList();
    //返回上一页
	$('.backBtn').click(function(){
        // window.location.href = 'newRepair.html?hotelName='+hotelName+'&hotelId='+hotelId;
        toPrevPage();
    })
    //搜索酒店名    
    $('.searchBtn').click(function(){
        var serarchMsg = $('#searchMsg').val();
        getHotelNameList(serarchMsg);
    })
})