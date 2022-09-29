
import config from '../config/config';
import qs from 'qs'
export default function customUpload(option) {
    /* coding here */

    
    // onProgress: (event: { percent: number }): void

    console.log(option); // option中为文件信息和Upload组件的各种回调方法
    let uploadAuth, uploadAddress, videoId;
    const uploader =new window.AliyunUpload.Vod({
        
        
        userId:'1460600281746650',
        retryCount: 3,
        enableUploadProgress: true,
        //网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
            option.onError(message, uploadInfo); // 执行上传失败的回调
        },
        // 文件上传完成
        onUploadSucceed: function (uploadInfo) {
            // console.log(uploadInfo);
            console.log('上传完成')
            option.onSuccess({ err: 0, data: { uri: uploadInfo.videoId, ...uploadInfo } }); // 执行上传成功的回调
        },
        // 文件上传进度
        onUploadProgress: function (uploadInfo, totalSize, loadedPercent) {
            console.log(loadedPercent)
            option.onProgress({ percent: parseFloat((loadedPercent * 100.00).toFixed(2)) }); // 实时返回上传进度数据
        },
        // STS临时账号会过期，过期时触发函数
        onUploadTokenExpired: function (uploadInfo) {

            fetch(config.api+'/site/uploadAuth', {
                method: 'post',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({
                    file_name: uploadInfo.file.name,
                    type: 'video',
                    video_id: '',
                    title: uploadInfo.file.name
                })
            })
            .then(response => response.json())
            .then(body => {
                const {errorMsg} = body
                if(!errorMsg){
                uploadAuth = body.resultBody.UploadAuth;
                uploadAddress = body.resultBody.UploadAddress;
                videoId = body.resultBody.VideoId;
                uploader.resumeUploadWithAuth(uploadAuth);
                }
            });
        },
        onUploadCanceled: function (uploadInfo) {
            // console.log("onUploadCanceled:file:" + uploadInfo.file.name);
        },
        // 开始上传
        onUploadstarted: function (uploadInfo) {
            console.log(uploadInfo)

            fetch(config.api+'/site/uploadAuth', {
                method: 'post',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: qs.stringify({
                    file_name:uploadInfo.file.name,
                    type:'video',
                    video_id:'',
                    title:uploadInfo.file.name
                })
            })
            .then(response => response.json())
            .then(body => {

                const {errorMsg} = body
                if(!errorMsg){
                uploadAuth = body.resultBody.UploadAuth;
                uploadAddress = body.resultBody.UploadAddress;
                videoId = body.resultBody.VideoId;

                if (!uploadInfo.videoId)//这个文件没有上传异常
                {
                    uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
                }
                else//如果videoId有值，根据videoId刷新上传凭证
                {
                    uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress);
                }
                }
            });
        }
        ,
        onUploadEnd: function (uploadInfo) {
            console.log("onUploadEnd: uploaded all the files");
        }
    });
    // 点播上传。每次上传都是独立的鉴权，所以初始化时，不需要设置鉴权
    // 临时账号过期时，在onUploadTokenExpired事件中，用resumeWithToken更新临时账号，上传会续传。
    uploader.addFile(option.file, null, null, null); // 添加文件
    uploader.startUpload(); // 开始上传
    return { abort() {/* coding here */ } };
}