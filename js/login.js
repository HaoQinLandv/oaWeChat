$(function(){
     var openId = sessionStorage.getItem('openId',openId);//获取openId
     // alert(openId);
    //唤起键盘时取消定位
    var windheight = $(window).height();  /*未唤起键盘时当前窗口高度*/
    $(window).resize(function(){
       var docheight = $(window).height();  /*唤起键盘时当前窗口高度*/       
       if(docheight < windheight){            /*当唤起键盘高度小于未唤起键盘高度时执行*/
          $(".logoName").css("position","static");
          // $(".logoName").css('margin-top','7.5rem');
       }else{
          $(".logoName").css("position","absolute");
          // $(".logoName").css('margin-top','0');
       }           
    });
    //输入服务号和密码，判断酒店名并显示
    var serverName = '';
    var password = '';
    $('#serverName ').change('input propertychange', function() {  
        serverName = $(this).val();
        getServerHotelName();
    }); 
    $('#password').change('input propertychange', function() {  
        password = $(this).val();
        getServerHotelName();
    });
    //获取酒店名函数
    function getServerHotelName(){
        //当输入服务号和密码长度大于0时开始发送获取酒店名称请求
        if(password.length > 0 && serverName.length > 0){
            $.ajax({
                url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!checkUserLawful.action', 
                dataType:'json',
                type:'get',
                data:{'account':serverName,'password':password},
                success:function(data){
                    if(data.result){
                        $('.showServerHotelName').html(data.hotelName); 
                    }else{
                        alert(data.msg);

                    }                        
                },
                error:function(msg){
                    alert(msg);
                }
            })
        }    
    }
    //验证手机号
    $('#phoneNum').change('input propertychange', function() {  
        var phoneNum = $(this).val();
        if( !phoneNum.match(/^1(3|4|5|7|8)\d{9}$/)){
            alert('请输入正确的11位手机号码')
        }
    })
    //获取验证码
    var identifyingCode = '';//保存验证码
    //点击获取验证码，生成验证码并开始倒计时
    $('.getConfimBtn').click(function(){
        var userPhone = $('#phoneNum').val();
        var checkCode = $('#checkCode').val();
        console.log(userPhone);
        $.ajax({
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!sendIdentifyingCode.action',
            dataType:'json',
            type:'get',
            data:{'userPhone':userPhone},
            success:function(data){
                console.log(data);
                //如果发送成功
                if(data.result){
                    alert(data.msg);
                    identifyingCode = data.identifyingCode;
                    $('.getConfimBtn').attr('disabled',true);//禁止点击获取验证按钮
                    $('.getConfimBtn').css('background-color','#f3f3f3');//按钮背景颜色改变
                    //开始倒计时60S
                    countdown();
                }else{
                    alert(data.msg);
                }                        
            },
            error:function(msg){
                alert(msg);
            }
        })
    })
    //开始倒计时函数
    var timer = 60;//验证码倒计时时间
    function countdown(){
        if(timer >= 1){
            timer -= 1;
            $('.getConfimBtn').html(timer+'s');
            setTimeout(function(){
                countdown();
             },1000);
        }else{
            $('.getConfimBtn').attr('disabled',false);//点击获取验证按钮
            $('.getConfimBtn').css('background-color','#fff');//按钮背景颜色改变
            $('.getConfimBtn').text('重新发送');//更改按钮文字
            identifyingCode = '';//清空当前验证码
        }
    }
    //校验验证 函数    
    function validate() {  
        console.log($('#checkCode').val());
        console.log(identifyingCode);
        var inputCode = $('#checkCode').val().toUpperCase(); //取得输入的验证码并转化为大写           
        if(inputCode.length <= 0) { //若输入的验证码长度为0     
            alert("请输入验证码！"); //则弹出请输入验证码  
            return false;   
        } else if(inputCode != identifyingCode) { //若输入的验证码与产生的验证码不一致时     
            alert("验证码输入错误！请重新获取"); //则弹出验证码输入错误  
            return false;     
        } else {     
            return true;
        }  
    } 
    //注册按钮
    $('.signBtn').click(function(){
        validate();//校验验证码
        if(validate()){
            var openId = sessionStorage.getItem('openId',openId);//获取openId
            var account = $('#serverName').val();
            var password = $('#password').val();
            var userName = $('#userName').val();
            var userPhone = $('#phoneNum').val();
            $.ajax({
                url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!addHotelUser.action',
                dataType:'json',
                type:'post',
                data:{'openId':openId,'account':account,'password':password,'userName':userName,'userPhone':userPhone},
                success:function(data){
                    alert(data.msg);
                    sessionStorage.setItem('userId',userId);//保存userId
                    window.location.href = 'index.html';//注册成功，进入首页
                },
                error:function(msg){
                    alert(msg);
                }
            })
        }
        
    })   
})
