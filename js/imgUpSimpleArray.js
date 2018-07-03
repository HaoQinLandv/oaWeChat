var fileList = new Array();
$(function(){
	var delParent;
	var defaults = {
		fileType         : ["jpg","png","bmp","jpeg"],   // 上传文件的类型
		fileSize         : 1024 * 1024 * 10                  // 上传文件的大小 10M
	};
	var imgArr = [];
	var tempSize  = 0;//保存图片大小
		/*点击图片的文本框*/
	$(".file").live('change',function(){	
		console.log($("input[name = 'file']"))  
		var idFile = $(this).attr("id");
		var file = document.getElementById(idFile);
		var imgContainer = $(this).parents(".z_photo"); //存放图片的父亲元素
		fileList = file.files ; //获取的图片文件
		// tempFileList = file.files ; //获取的图片文件
		// 
		// for(var i=0;i<tempFileList.length;i++){
		// 	fileList.push(tempFileList[i]);
		// }
		var input = $(this).parent();//文本框的父亲元素
		//点击图片，图片提示消失
		$('.up-tip').remove();
		//遍历得到的图片文件
		var numUp = imgContainer.find(".up-section").length;
		var totalNum = numUp + fileList.length;  //总的数量
		if(fileList.length > 5){
			alert("上传图片数目不可以超过5个，请重新选择");  //一次选择上传超过5个或者是已经上传和这次上传的到的总数也不可以超过5个
		}
		else if(numUp < 5){
			console.log(fileList);
			console.log($("input[name = 'file']"))  
			$('.up-section').remove();
			fileList = validateUp(fileList);
			for(var i = 0 ;i<fileList.length;i++){
				var tempList = fileList[i];
				tempSize += tempList.size;
				if(tempSize > defaults.fileSize){
					alert('图片大小不可超过5M');
				}
				else{
					 var imgUrl = window.URL.createObjectURL(fileList[i]);
					     imgArr.push(imgUrl);
					     console.log(imgUrl);
					 var $section =  $("<section class='up-section fl loading' id='img"+[i]+"'>");
					     imgContainer.prepend($section);
					 var $span = $("<span class='up-span'>");
					     $span.appendTo($section);
					
				     var $img0 = $("<img class='close-upimg'>").on("click",function(event){
								    event.preventDefault();
									event.stopPropagation();
									delParent = $(this).parent();
									console.log(delParent.attr('id').split('img')[1]);
									delId = delParent.attr('id').split('img')[1];
									fileList.splice(delId,1);
									var numUp = delParent.siblings().length;
									if(numUp < 6){
										delParent.parent().find(".z_file").show();
									}
									var $input = $("<input id='del' name='taglocation' value='"+delId+"'type='hidden'>");
				         			$input.appendTo($('#img'+delId));
									delParent.remove();
									
								});   
						 $img0.attr("src","images/delete_picture@3x.png").appendTo($section);
				     var $img = $("<img class='up-img up-opcity'>");
				         $img.attr("src",imgArr[i]);
				         $img.appendTo($section);
				     var $p = $("<p class='img-name-p'>");
				         $p.html(fileList[i].name).appendTo($section);
		        }
		   }
		}
		setTimeout(function(){
             $(".up-section").removeClass("loading");
		 	 $(".up-img").removeClass("up-opcity");
		 },450);
		 numUp = imgContainer.find(".up-section").length;
		if(numUp >= 5){
			$(this).parent().hide();
		}
	});
	
	
   
    $(".z_photo").delegate(".close-upimg","click",function(){
     	  $(".works-mask").show();
     	  delParent = $(this).parent();
	});
		
		
		function validateUp(files){
			var arrFiles = [];//替换的文件数组
			for(var i = 0, file; file = files[i]; i++){
				//获取文件上传的后缀名
				var newStr = file.name.split("").reverse().join("");
				if(newStr.split(".")[0] != null){
						var type = newStr.split(".")[0].split("").reverse().join("");
						console.log(type+"===type===");
						if(jQuery.inArray(type, defaults.fileType) > -1){
							// 类型符合，可以上传
							if (file.size >= defaults.fileSize) {
								alert(file.size);
								alert('您这个"'+ file.name +'"文件大小过大');	
							} else {
								// 在这里需要判断当前所有文件中
								arrFiles.push(file);	
							}
						}else{
							alert('您这个"'+ file.name +'"上传类型不符合');	
						}
					}else{
						alert('您这个"'+ file.name +'"没有类型, 无法识别');	
					}
			}
			return arrFiles;
		}	
})
