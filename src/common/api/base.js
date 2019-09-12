/**
  * 接口域名的管理
  */
 const domain = 'http://192.168.16.228:9999';
 const base = {
    nvrs: `${domain}/warehouse/nvrs`,
    nvr: `${domain}/warehouse/nvr`,
    cameras:`${domain}/warehouse/cameras`,
    camera:`${domain}/warehouse/camera`,
    capture:`${domain}/warehouse/capture`,
    restart:`${domain}/warehouse/restart`,
    nvr_config:`${domain}/warehouse/nvr_config/`,
    camera_suggest:`${domain}/warehouse/nvr`
}

export default base;