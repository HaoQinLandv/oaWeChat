$(function(){
    var userId = sessionStorage.getItem('userId',userId);//获取userId
    $("#userId").val(userId);
    var guideListType = new Array();
    //获取case信息
    $.ajax({
        url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!queryAllGuideIfo.action',
        dataType:'json',
        type:'get',
        data:{'userId':userId},
        success:function(data){
            console.log(data);
            var tempData = data;
            console.log(tempData);
            $('.repairClass').html(data.guideList[0].code);//默认显示维护大类为第一个
            console.log(data.guideList[0].code);
            $("#heading").val(data.guideList[0].code);
            $('.guideMsg-text').html(tempData.guideList[0].descript);//默认显示第一个维护大类的引导信息
            for(var i = 0;i<data.guideList.length;i++){
                guideListType.push(data.guideList[i].code);
            }
            console.log(guideListType);
            var mobileSelect1 = new MobileSelect({
                trigger: '#trigger1', 
                ensureBtnText:'完成',
                wheels: [
                            {data: guideListType}
                        ],
                // position:[1], //初始化定位 打开时默认选中的哪个 如果不填默认为0
                transitionEnd:function(indexArr, data){
                    console.log(data[0]);
                    $("#heading").val(data[0]);
                },
                callback:function(indexArr, data){
                    console.log(tempData.guideList[indexArr].descript);
                    $('.guideMsg-text').html(tempData.guideList[indexArr].descript);
                }
            });
        },
        error:function(msg){
            alert(msg);
        }
    })
    //选择报修酒店跳转到酒店列表页面
    $('#chooseHotel').click(function(){
        window.location.href = 'choseRepairHotel.html?home=0';
    })
    //酒店选择后新建报修页面显示选中的酒店名称
    var getHotelName = window.location.search;
    var getHotelId = window.location.search;
    console.log(getHotelName.substr(1).split('&')[0].split('=')[1])//hotelName
    var HotelName = getHotelName.substr(1).split('&')[0].split('=')[1];
    // var HotelId = getHotelName.substr(1).split('&')[1].split('=')[1];
    if( HotelName){
        getHotelName = decodeURI(getHotelName.substr(1).split('=')[1]);
        getHotelId =decodeURI(getHotelId.substr(1).split('&')[1].split('=')[1])
        getHotelName = decodeURI(getHotelName.substr(0).split('&')[0]);
        $('.getHotelName').html(getHotelName);
        $("#hotelId").val(getHotelId);
    }else{
        $('.getHotelName').html('请选择报修酒店');
    }

    //报修类别选择
    var type = '咨询';//默认显示为咨询
    $('.repairType').on('click', function(event) {
        console.log($(this).children('span').html());
        type = $(this).children('span').html();
        $('.repairType').children('label').removeClass('typeSelect');
        $(this).children('label').addClass('typeSelect').siblings().removeClass('typeSelect');
        $("#type").val(type);
    });
    console.log($("#type").val(type));
    //textarea字数实时统计
    var text ='';//客户详细描述
    countText = function(){
    	//trim去掉首尾的空格
        text = $.trim($('#textarea').val());
    	$('#textNum').text(text.length);
    }
    //提交新建维修信息
    // $('.container-botm').click(function(){
    //     console.log(fileList);
    //     console.log(userId);
    //     console.log(toString.call(fileList) );
    //     if(!HotelName){
    //         alert('请选择报修酒店')
    //     }else{
    //         var heading = $('.repairClass').html();//获取当前选择的维护大类
    //         var tempfileList = new FormData();
    //         console.log(fileList);
    //         for(var i=0;i<fileList.length;i++){
    //             tempfileList.append('upload',fileList[i]);
    //         }
    //         // tempfileList.append('userId',userId);
    //         // tempfileList.append('hotelId',getHotelId);
    //         // tempfileList.append('type',type);
    //         // tempfileList.append('heading',heading);
    //         // tempfileList.append('content',text);
    //         // console.log(tempfileList);
    //         // 
    //        //  // 
    //        // $.ajax({
    //        //      url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!addMaintainCaseForOA.action',
    //        //     // dataType:'json',
    //        //      type:'post',
    //        //      processData:false,
    //        //      contentType : false,
    //        //      cache:false,
    //        //      //data:{'userId':userId,'hotelId':getHotelId,'type':type,'heading':heading,'content':text,'upload':tempfileList},
    //        //      // data:tempfileList,
    //        //      data:$('#theFrom').serialize(),
    //        //      success:function(data){
    //        //          alert(data.msg);
    //        //      },
    //        //      error:function(msg){
    //        //          alert(msg);
    //        //      }
    //        //  }) 
         
    //     }
        
    // })
     checkForm = function(form){
        console.log(form);
         if(!form.hotelId.value){
            alert('请选择报修酒店');
            return false;
        }else{      
            alert('提交成功');
            window.location.href = 'index.html';
            return true;
        }
    }
    //input file实现多次上传不覆盖上次文件 尝试1
    // $('.file').on('click',function(e){
    //     var newFileInput = "<input id='uploaderInput' style='display:none;' type='file' name='upload'  accept='image/jpg,image/jpeg,image/png,image/bmp' multiple/>";
    //     $(this).parent().append($(newFileInput));
    //     $("#uploaderInput").bind("change", function(e){
    //          //onFileUploaded(e);预览等操作
    //          $(this).removeAttr("id");
    //     });
    //     $("#uploaderInput").click();
    // })
    //form.js插件上传表单 尝试2
    //在表单中对要上传的图片进行格式处理
    //这个函数要添加到提交的html onclick里面
     ajaxSubmitForm = function(){
        var option = {
            url:'http://dev.foxhis.com:944/westsoftOA/common/warrantyInterface_action!addMaintainCaseForOA.action',
            headers:{"ClientCallMode" : "ajax"},
            type:'post',
            dataType:'json',
            // beforeSubmit:showRequest,
            success:function(data){
                console.log(data);
            },
            error:function(msg){
                console.log(msg);
            }
        };
        $('#theFrom').ajaxSubmit(option);
        return false;
    }
    function showRequest(formData,jqForm,options){
         //formData是数组，就是各个input的键值map数组
         //通过这个方法来进行处理出来拼凑出来字符串。
         //formData：拼凑出来的form字符串，比如name=hera&password，
         //其实就是各个表单中的input的键值对，
         //如果加上method=XXXX，那也就是相当于ajax内的data。
         console.log(formData);
         // var queryString = $.param(formData);
         // alert(queryString+"======"+formData.length);
         // for (var i=0; i < formData.length; i++) {
         // alert(formData[i].value+"==============="+formData[i].name);
         // }
         // //jqForm，jquery form对象
         // var formElement = jqForm[0];
         // alert($(formElement).attr("method"));
         // alert($(jqForm[0].name).attr("maxlength"));
         //非常重要，返回true则说明在提交ajax之前你验证
         //成功，则提交ajax form
         //如果验证不成功，则返回非true，不提交
         // return true;
    }
})