import config from '../config/config'
import {message} from 'antd'
export const myUploadFn = (param) => {

    console.log('param',param);
    
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    let dir = ''
    let host = ''
    let poster = ''
    let _name = param.file.name
    let name = _name.replace(/\s+/g,"")
    const id = param.file.lastModified
    
    const suffix = param.file.name.slice(param.file.name.lastIndexOf('.'));
    const filename = Math.random().toString(36).slice(-8) + Date.now() + suffix;
    
    console.log(name)
    const successFn = (response) => {
        console.log('response:  ', response);
        let url = host+'/'+dir+filename
        if(name.indexOf('.mp3')>-1){
            name = name.replace('.mp3','')
            poster = 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com/images/64a98784-c662-423e-b9e1-6f745a26c4cb.png'
        }
        param.success({
            url: url,
            meta: {
                id: id,
                title: name||'音频',
                alt: name||'音频',
                loop: false, // 指定音视频是否循环播放
                autoPlay: false, // 指定音视频是否自动播放
                controls: true, // 指定音视频是否显示控制栏
                poster: poster, // 指定视频播放器的封面
                name: name||'音频'
            }
        })
    };

    const progressFn = (event) => {
        param.progress(event.loaded / event.total * 100)
    };
    const errorFn = (response) => {
        param.error({
            msg: '上传出错！请重试'
        })
    };
    xhr.upload.addEventListener("progress", progressFn, false);
    xhr.addEventListener("load", successFn, false);
    xhr.addEventListener("error", errorFn, false);
    xhr.addEventListener("abort", errorFn, false);

    if(param.file.type.indexOf('image') > -1){
        // dir = 'image/'
    }else if(param.file.type.indexOf('video') > -1){
        // dir = 'video/'
    }else if(param.file.type.indexOf('audio') > -1){
        // dir = 'audio/'
    }else{
        message.info('只支持JPEG、PNG、MP3、MP4、GIF文件');
        param.error({
            msg: '请选择正确的文件！'
        })
        return;
    }

    fetch(config.api + '/site/getSign', {
        method: 'get',
        mode: 'cors',
        credentials: 'include',
    }).then(response => response.json()).then(body => {
        const {errorMsg} = body
        if(!errorMsg){
        const key = body.resultBody
        const serverURL = key['host'];
        host = key['host']
        dir = key['dir']

        fd.append('expire', key['expire']);
        fd.append('OSSAccessKeyId', key['accessid']);
        fd.append('success_action_status', '200');
        fd.append('policy', key['policy']);
        fd.append('callback', key['callback']);
        fd.append('signature', key['signature']);
        fd.append('key',key['dir']+filename);
        fd.append('file', param.file);

        xhr.open('POST', serverURL, true);
        xhr.withCredentials = false;
        xhr.send(fd)
        }
    }).catch(() => {
        param.error({
            msg: '获取签名出错'
        })
    })
};