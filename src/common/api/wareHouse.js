/**
  * 仓库管理模块接口列表
  */

import base from './base'; // 导入接口域名列表
import axios from '@/common/utils/http.js'; // 导入http中创建的axios实例
//  import qs from 'qs'; // 根据需求是否导入qs模块

const wareHouse = {
    // 查询NVR
    queryNvr() {
        return axios.get(`${base.nvrs}/`);
    },
    //查询单个摄像头
    queryCamera(id) {
        return axios.get(`${base.camera}/${id}/`);
    },
    //修改NVR
    reviewNvr(id, params) {
        return axios.put(`${base.nvr}/${id}/`, params);
    },
    //修改摄像头
    reviewCamera(id, params) {
        return axios.put(`${base.camera}/${id}/`, params);
    },
    //删除NVR
    delNvr(id) {
        return axios.delete(`${base.nvr}/${id}/`);
    },
    //删除摄像头
    delCamera(id) {
        return axios.delete(`${base.camera}/${id}/`);
    },
    //新增NVR
    addNvr(params) {
        return axios.post(`${base.nvrs}/`, params);
    },
    //新增摄像头
    addCamera(params) {
        return axios.post(`${base.cameras}/`, params);
    },
    //截屏
    capture(params) {
        return axios.post(`${base.capture}/`, params);
    },

    //新增摄像头时端口和通道默认值
    cameraSuggest(id) {
        return axios.get(`${base.camera_suggest}/${id}/suggest/`);
    },
    restartServer() {
        return axios.post(`${base.restart}/`);
    }



    // 
    // 新闻详情,演示
    //  articleDetail (id, params) {
    //      return axios.get(`${base.sq}/topic/${id}`, {
    //          params: params
    //      });
    //  },
    // post提交
    //  login (params) {
    //      return axios.post(`${base.sq}/accesstoken`, qs.stringify(params));
    //  }
}

export default wareHouse;