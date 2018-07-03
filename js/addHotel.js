$(function () {
    var userId = sessionStorage.getItem("userId");

    $('#addHotelBtn').click(function (e) {
        e.stopPropagation();
        var _serverName=$('#serverName').val();
        var _password=$('#password').val();
        if(_serverName != "" && _serverName !=undefined){
            if(_password != "" && _password !=undefined){

                var getHotelName=getHotelData.getServerHotelName(_serverName,_password);
                if(getHotelName==true){
                    getHotelData.newBoundHotel(userId,_serverName,_password)
                }
            }else{
                alert("密码不能为空!");
            }
        }else{
            alert("服务号不能为空!");
        }
    });
})
var getHotelData={
    getServerHotelName:function (serverName,password) {
        var bol=true;
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!checkUserLawful.action',
            dataType:'json',
            type:'post',
            async:false,
            data:{'account':serverName,'password':password},
            success:function(data){
                if(data.result){
                    bol=true
                }else{
                    alert(data.msg);
                    bol=false;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // 状态码
                console.log(XMLHttpRequest.status);
                // 状态
                console.log(XMLHttpRequest.readyState);
                // 错误信息
                console.log(textStatus);
                bol=false;
            }
        })
        return bol;
    },
    newBoundHotel:function (userId,account,password) {
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!addNewBoundHotel.action',
            dataType:'json',
            type:'post',
            data:{'userId':userId,'account':account,'password':password},
            success:function(data){
                if(data.result){
                    window.location.href = 'manageHotel.html';
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
