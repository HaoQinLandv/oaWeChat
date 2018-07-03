$(function(){
	//判断是否已注册
    var openId = 'o2bmQuHy-rZyK_qjrA7nYu7SKGSI';//openId写死了这里
    $.ajax({
        url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!checkHotelUser.action', 
        dataType:'json',
        type:'get',
        data:{"openId":openId},
        success:function(data){
            console.log(data);
            if(data.result){
                sessionStorage.setItem('openId',openId);//保存openId
                sessionStorage.setItem('userId',data.userId);//保存openId
                //如果已经注册过，保存用户信息
                if( data.ifRegister === false){
                    sessionStorage.setItem('role',data.role);
                    // sessionStorage.setItem('openId',openId);
                }else{//没有注册过，跳转到注册页面
                	window.location.href = 'login.html';
                    // sessionStorage.setItem('openId',openId);
                }
            }else{};
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