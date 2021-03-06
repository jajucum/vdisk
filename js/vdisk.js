 /**
 * @vdisk app
 *
 * @version 1.0
 *
 * @author putaoshu@126.com
 *
 * @update 2011-7-30 21:31:39
 */

/*  Vdisk API  URL: http://vdisk.me/api
---------------------------------------------------------------------------------------*/
/**
* @URL
*/

var URL_GET_TOKEN =  'http://openapi.vdisk.me/?m=auth&a=get_token';
var URL_KEEP_TOKEN =  'http://openapi.vdisk.me/?m=user&a=keep_token';
var URL_UPLOAD_FILE =  'http://openapi.vdisk.me/?m=file&a=upload_file';
var URL_UPLOAD_SHARE_FILE =  'http://openapi.vdisk.me/?m=file&a=upload_share_file';
var URL_CREATE_DIR =  'http://openapi.vdisk.me/?m=dir&a=create_dir';
var URL_GET_LIST =  'http://openapi.vdisk.me/?m=dir&a=get_list';
var URL_GET_QUOTA =  'http://openapi.vdisk.me/?m=file&a=get_quota';
var URL_UPLOAD_WITH_SHA1 =  'http://openapi.vdisk.me/?m=file&a=upload_with_sha1';
var URL_GET_FILE_INFO =  'http://openapi.vdisk.me/?m=file&a=get_file_info';
var URL_DELETE_DIR =  'http://openapi.vdisk.me/?m=dir&a=delete_dir';
var URL_DELETE_FILE =  'http://openapi.vdisk.me/?m=file&a=delete_file';
var URL_COPY_FILE =  'http://openapi.vdisk.me/?m=file&a=copy_file';
var URL_MOVE_FILE =  'http://openapi.vdisk.me/?m=file&a=move_file';
var URL_RENAME_FILE =  'http://openapi.vdisk.me/?m=file&a=rename_file';
var URL_RENAME_DIR =  'http://openapi.vdisk.me/?m=dir&a=rename_dir';
var URL_MOVE_DIR =  'http://openapi.vdisk.me/?m=dir&a=move_dir';
var URL_SHARE_FILE =  'http://openapi.vdisk.me/?m=file&a=share_file';
var URL_CANCEL_SHARE_FILE =  'http://openapi.vdisk.me/?m=file&a=cancel_share_file';
var URL_RECYCLE_GET_LIST =  'http://openapi.vdisk.me/?m=recycle&a=get_list';
var URL_TRUNCATE_RECYCLE_GET =  'http://openapi.vdisk.me/?m=recycle&a=truncate_recycle';
var URL_RECYCLE_DELETE_FILE =  'http://openapi.vdisk.me/?m=recycle&a=delete_file';
var URL_RECYCLE_DELETE_DIR =  'http://openapi.vdisk.me/?m=recycle&a=delete_dir';
var URL_RECYCLE_RESTORE_FILE =  'http://openapi.vdisk.me/?m=recycle&a=restore_file';
var URL_RECYCLE_RESTORE_DIR =  'http://openapi.vdisk.me/?m=recycle&a=restore_dir';
var URL_GET_DIRID_WITH_PATH =  'http://openapi.vdisk.me/?m=dir&a=get_dirid_with_path';
var URL_EMAIL_SHARE_FILE =  'http://openapi.vdisk.me/?m=file&a=email_share_file';

/**
* @appkey,app_secret
*/
var APPKEY = 243370;
var APP_SECRET = 'ead5d2e0987e60ef43b2c9d80a893326';	

/**
 * 获得token
 *
 * @param string $account
 * @param string $password 
 * @param string $app_type 可选参数, 如:$app_type=sinat (注意: 目前支持微博帐号)
 *
 * @return array 
 *
 *
*/
function get_token($account,$password,$appType){

	var $account = $account;
	var $password = $password;
	var $app_type=null;
	//if ($appType) $app_type='sinat';

	var $appkey = APPKEY;
	var $app_secret = APP_SECRET;	

	var $timeNow = new Date().getTime();
	var $time = $timeNow.toString().substring(0,10);//10位

	var signatureTemp = "account="+$account+"&appkey="+$appkey+"&password="+$password+"&time="+$time;

	signatureTemp = Crypto.HMAC(Crypto.SHA256,signatureTemp,$app_secret);//SHA256
	
	var $param  = {
		//app_type:$appType,
		account: $account,
		password: $password,
		appkey: $appkey,
		time: $time,
		signature:signatureTemp
	};
	
	if ($appType) $param.app_type='sinat';

	dojo.xhrPost({
		url: URL_GET_TOKEN,
		content:$param,  
		//form: dojo.byId("loginForm"),
		//handleAs : json-comment-filtered,
		load: function(data){
			var data = eval("("+data+")");
			get_token_callback(data);
			//dojo.byId("divHello").innerHTML = responseText;
		},
		error: function(response){
			alert("Error");
		}
	});

}

/**
 * 获得列表(包括文件和子目录)
 *
 * @param int $dir_id 目录的id
 *
 * @return array 
 *
 *
*/
function get_list($dir_id){

	loadingShow();

	if (!$dir_id) $dir_id=0;
	var $token = window.localStorage.getItem("token");
	var $param  = {
		token:$token,
		dir_id:$dir_id
	};

	dojo.xhrPost({
		url: URL_GET_LIST,
		content:$param,  
		//form: dojo.byId("loginForm"),
		//handleAs : json-comment-filtered,
		load: function(data){
			var data = eval("("+data+")");
			get_list_callback(data);
		},
		error: function(response){
			alert("Error");
		}
	});

}



/*  Callback vdisk api
---------------------------------------------------------------------------------------*/

/**
* @获得token后处理函数
*/

function get_token_callback(data){
	if (data.err_code != 0){
		alert(data.err_code+','+data.err_msg);
		//alert('您的帐号或密码有错,请重试');
	}else{
		window.localStorage.setItem("token", data.data.token );
        var token = window.localStorage.getItem("token");
		if (token){
			window.location.href = 'list.html';
		}
	}
}

/**
* @获得列表后处理函数
*/
function get_list_callback(data){
	var dataContent = data;

	if (dataContent.err_code != 0){
		alert(data.err_code+','+data.err_msg);
	}else{
		var dataListHtml='' ;
		var dataList = dataContent.data;

		for (var i=0;i<dataList.length;i++){
			dataListHtml+='<li><a class="go"></a><a href="'+dataList[i].url+'">'+dataList[i].name+'</a></li>';
		}
		document.getElementById('list').innerHTML = dataListHtml;
		loadingHide();
	}

}

/**
* @loading set
*/

function loadingShow(){
	 document.getElementById('loading').style.display = 'block';
}

function loadingHide(){
	 document.getElementById('loading').style.display = 'none';
}