// import config from '../config/config'
// import OSS from 'ali-oss'
// async function multipartUpload(param,client,progressFn){
//     try {
//         let result = await client.multipartUpload(param.file.name, param.file, {
//             progressFn,
//             meta: {
//                 name: 'test'
//             }
//         });
//         let head = await client.head(param.file.name);
//         console.log(result);
//         console.log(head);

//         // param.success({
//         //     url: JSON.parse(xhr.responseText).resultBody,
//         //     meta: {
//         //         id: id,
//         //         title: name||'音频',
//         //         alt: name||'音频',
//         //         loop: false, // 指定音视频是否循环播放
//         //         autoPlay: false, // 指定音视频是否自动播放
//         //         controls: true, // 指定音视频是否显示控制栏
//         //         poster: '', // 指定视频播放器的封面
//         //         name: name||'音频'
//         //     }
//         // })
//     } catch (e) {
//         // 捕获超时异常
//         if (e.code === 'ConnectionTimeoutError') {
//             console.log("Woops,超时啦!");
//         }
//         console.log(e)
//     }
// }
// export const OssUpload = (param) => {
//     console.log('param',param);
//     let client = new OSS({
//         region: 'https://edu-uat.oss-cn-shenzhen.aliyuncs.com',
//         accessKeyId: 'LTAInpyk6yZsOGAw',
//         accessKeySecret: 'HSHrBZMjTYgsLAT76/MFMw7rujc=',
//         bucket: 'edu-ua',
//         policy:''
//     });
//     multipartUpload(param,client,progressFn)

//     // fetch(config.api+'/user/teacher/?keyword=', {
//     //     method: 'get',
//     //     mode: 'cors',
//     //     credentials: 'include',
//     // }).then(response => response.json()).then(body => {
//     //     console.log(body)
        
//     // }).catch(()=>{
//     //     param.error({
//     //         msg: '上传出错'
//     //     })
//     // })

//     const progressFn = (event) => {
//         param.progress(event.loaded / event.total * 100)
//     };
// };