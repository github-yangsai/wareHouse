<template>
  <div>
    <Modal
      v-model="openFlag"
      title="配置信息"
      :mask-closable="false"
      width="900px"
      footer-hide
      header-hide
      @on-visible-change="closeDialog"
    >
      <div class="viewconfig_cotainer">
        <Table height="400" :columns="columns" :data="listData"></Table>
        <!-- <div id="config_title"></div>
        <div id="config_box"></div> -->
        <div class="btn_box">
          <input type="button" value="导出配置表" class="full_btn" @click="downloadTable" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "viewConfig",
  data() {
    return {};
  },
  props: ["openFlag", "data"],
  methods: {
    closeDialog(val) {
      if (!val) {
        this.$emit("closePopup");
      }
    },
    tranferDate(val) {
      if (val) {
        let date = new Date(val);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let second = date.getSeconds();
        return `${year}${month < 10 ? "0" + month : month}${
          day < 10 ? "0" + day : day
        }${hour < 10 ? "0" + hour : hour}${min < 10 ? "0" + min : min}${
          second < 10 ? "0" + second : second
        }`;
      }
    },
    csvToJSON() {
      // const CSVToJSON = (data, delimiter = ",") => {
      //   const titles = data.slice(0, data.indexOf("\n")).split(delimiter);
      //   return data
      //     .slice(data.indexOf("\n") + 1)
      //     .split("\n")
      //     .map(v => {
      //       const values = v.split(delimiter);
      //       return titles.reduce(
      //         (obj, title, index) => ((obj[title] = values[index]), obj),
      //         {}
      //       );
      //     });
      // };
      // let data = CSVToJSON(this.data);
      // let string = JSON.stringify(this.data),
      //   jsonData = new Function("return " + string)(),
      //   //使用new Function()的方式新建一个function，
      //   //同时后面加上括号立即执行该function,得到json对象组
      //   i,
      //   jsonLength = jsonData.length,
      //   temp,
      //   tbl,
      //   tr,
      //   td,
      //   th,
      //   box;
      // tbl = document.createElement("table");
      // tbl.className = "config_table";
      // for (i = 0; i < jsonLength; i++) {
      //   tr = document.createElement("tr");
      //   if (i == 0) {
      //     for (temp in jsonData[i]) {
      //       th = document.createElement("th");
      //       th.innerHTML = temp;
      //       tr.appendChild(th);
      //     }
      //   } else {
      //     for (temp in jsonData[i]) {
      //       td = document.createElement("td");
      //       td.appendChild(document.createTextNode(jsonData[i][temp]));
      //       tr.appendChild(td);
      //     }
      //   }
      //   tbl.appendChild(tr);
      // }
      // box = document.getElementById("config_box");
      // box.appendChild(tbl);
    },
    downloadTable() {
      //导出配置表
      this.$store.commit("changeLoading", true);
      this.$api.wareHouse.nvrConfig().then(res => {
        const content = res.data;
        const blob = new Blob([content]);
        let times = new Date().getTime();
        let currentDate = this.tranferDate(times);
        const fileName = currentDate + "配置表.csv";
        this.$store.commit("changeLoading", false);
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          //IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      });
    }
  },
  watch: {
    openFlag(val) {
      if (val) {
        if (this.data.columns) {

          // document.getElementById("config_box").innerHTML = "";
          // document.getElementById("config_title").innerHTML = "";
          // let jsonData = this.data,
          //   i,
          //   temp,
          //   tbl,
          //   tb2,
          //   tr,
          //   td,
          //   th,
          //   columnsDiv,
          //   box;
          // tbl = document.createElement("table");
          // tbl.className = "config_table";
          // tb2 = document.createElement("table");
          // tb2.className = "config_table";
          // tr = document.createElement("tr");
          // for (let j = 0; j < jsonData.columns.length; j++) {
          //   th = document.createElement("th");
          //   th.innerHTML = jsonData.columns[j];
          //   tr.appendChild(th);
          // }
          // tb2.appendChild(tr);
          // document.getElementById("config_title").appendChild(tb2);
          // for (let i = 0; i < jsonData.data.length; i++) {
          //   tr = document.createElement("tr");
          //   for (let j = 0; j < jsonData.data[i].length; j++) {
          //     td = document.createElement("td");
          //     td.innerHTML = jsonData.data[i][j];
          //     tr.appendChild(td);
          //   }
          //   tbl.appendChild(tr);
          // }
          // box = document.getElementById("config_box");
          // box.appendChild(tbl);
        }
      }
    }
  },
  computed:{
    columns(){
      if(this.data && this.data.columns){
        for(let i = 0; i < this.data.columns.length;i++){
          let key = this.data.columns[i].key;
          if(key == "nvr_name" || key == "nvr_channel" || key == "output_port" || key == "camera_no"){
            this.data.columns[i].width = 100;
          }else if(key == "camera_name"){
            this.data.columns[i].width = 130;
          }
        }
        return this.data.columns
      }else{
        return []
      }
    },
    listData(){
      if(this.data && this.data.data){
        return this.data.data
      }else{
        return []
      }
    }
  }
};
</script>

<style>
#config_box {
  max-height: 400px;
  overflow-y: auto;
}
.config_table {
  width: 100%;
  border-collapse: collapse;
}
.config_table th {
  height: 40px;
  background: #eee;
  border: 1px #d2d2d2 solid;
  border-collapse: collapse;
  font-weight: bold;
}
.config_table td {
  height: 40px;
  /* text-align: center; */
  padding:0 10px;
  font-size: 14px;
  border: 1px #d2d2d2 solid;
  border-collapse: collapse;
}
.viewconfig_cotainer {
  padding: 10px 20px;
}
.viewconfig_cotainer .btn_box {
  text-align: center;
  padding-top: 30px;
}
.viewconfig_cotainer .btn_box input {
  display: inline-block;
  border-radius: 6px;
  min-width: 100px;
  height: 40px;
  line-height: 40px;
  padding: 0 25px;
  text-align: center;
  border: 1px #071826 solid;
  font-size: 16px;
  margin-left: 15px;
  outline: none;
  cursor: pointer;
}
.viewconfig_cotainer .full_btn {
  background: #071826;
  color: #fff;
}
.viewconfig_cotainer .full_btn:hover {
  background: #4d6e87;
  border-color: #4d6e87;
}
.config_table td:first-child,.config_table th:first-child{
  width:120px;
}
.config_table td:nth-child(2),.config_table th:nth-child(2){
  width:80px;
}
.config_table td:nth-child(3),.config_table th:nth-child(3){
  width:80px;
}
.config_table td:nth-child(4),.config_table th:nth-child(4){
  width:130px;
}
.config_table td:nth-child(5),.config_table th:nth-child(5){
  width:80px;
}
.config_table th{
  border-bottom: none;
}
.viewconfig_cotainer .ivu-table td,.viewconfig_cotainer .ivu-table th{
  height: 40px;
  border-right:1px #e8eaec solid;
}
.viewconfig_cotainer .ivu-table th:last-child{
  border-right:none;
}
</style>
