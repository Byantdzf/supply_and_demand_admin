<template>
  <div class="hello">
    <Card style="margin-top: 18px;">
      <p slot="title" style="color: none;">广告管理</p>
      <div style="display: inline-block;margin-left: 22px;width: 100%;">
        <Col span="14">
          <Row>
            <Col span="24" v-for="item,index in messageList" :key="index" class="bc_item">
              <Col span="11">
                <div @click="getIndex(index)">
                  <informPic v-on:uploadPictures="uploadInformPic" :pic="item.pic"></informPic>
                </div>
              </Col>
              <Col span="12" offset="1">
                <Input v-model="item.path" placeholder="跳转路径（'https://XXX.com'）"/>
                <Input v-model="item.content" type="textarea" placeholder="广告内容..." style="margin: 12px 0;"/>
                <!--<Select v-model="item.type" style="max-width: 300px;margin-top: 8px;">-->
                  <!--<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</Select>-->
                <!--<DatePicker type="daterange" v-model="item.date" placement="bottom-end" placeholder="通知显示时间" style="max-width: 220px;margin-top: 8px-->
<!--;margin-right: 12px"></DatePicker>-->
                <Button type="error" @click="removeMessage(index)">删除</Button>
              </Col>
            </Col>
          </Row>
          <div style="text-align: center;margin-top: 22px;">
            <Button style="margin: auto;float: left" type="dashed" @click="addMessage">添加+</Button>
            <Button type="success" size="large" icon="ios-checkmark" @click="saveMessage">保存</Button>
          </div>
        </Col>
      </div>
    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api'
  import uploadImage from '../components/uploadImage'
  import dropdown from '../components/dropdown'

  export default {
    components: {
      dropdown: dropdown,
      uploadImage: uploadImage,
      informPic: uploadImage
    },
    data () {
      return {
        articlesId: '',
        switch1: false,
        redMun: [],
        disabled: false,
        user_is_admin: 0,
        information: [],
        loading: false,
        VIPinformation: [],
        poster: '',
        client_id: 0,
        searchKeyword: '',
        photo: '',
        activeTab: 'orgInfo',
        informIndex: 0,
        character: {},
        uploaddata: [],
        cityList: [
          {
            value: 'OF',
            label: '公众号'
          },
          {
            value: 'MP',
            label: '小程序'
          }
        ],
        messageList: [] // 通知数量
      }
    },
    methods: {
      move (item, type) {
        let myindex = this.messageList.indexOf(item)
        this.messageList.splice(myindex - 1, 0, this.messageList.splice(myindex, 1)[0])
      },
      uploadPictures (image) {
        this.photo = image // 轮播
      },
      uploadInformPic (image) {
        console.log(this.informIndex)
        this.messageList[this.informIndex].pic = image // 轮播
      },
      getIndex (index) {
        this.informIndex = index
      },
      getGropData (value) {
        console.log(this.searchKeyword)
        let self = this
        self.loading = true
        uAxios.get(`admin/users?type=single&keyword=${value}`)
          .then(res => {
            let result = res.data.data.data
            this.redMun = result.map((item) => {
              return {
                name: item.name,
                id: item.id
              }
            })
            console.log(this.redMun)
          })
      },
      addMessage () {
        // 增加message数据
        this.messageList.push({
          content: '',
          path: '',
          pic: ''
        })
      },
      removeMessage (index) {
        // 删除message数据
        this.$Notice.warning({
          title: '温馨提示',
          desc: '记得保存之后才会生效哦！'
        })
        this.messageList.splice(index, 1)
      },
      returnDate (date) {
        // 格式化时间 return
        const d = new Date(date)
        var resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        return resDate.split(' ')[0]
      },
      saveMessage () {
        console.log(this.messageList)
        for (let item of this.messageList) {
          for (let key in item) {
            if (item[key].toString().replace(/(^\s*)|(\s*$)/g, '') == '') {
              return this.$Message.error('请填写完整信息后再保存！')
            }
          }
        }
        let data = {
          ads: this.messageList
        }
        uAxios.post(`admin/ads`, data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      gotoUrl (name, name_id, id) {
        let argu = {}
        argu[name_id] = id
        this.$router.push({
          name: name,
          params: argu
        })
      },
      // delete用户
      deleteUser (id) {
        let test_value = confirm('你确定要继续吗？')
        let self = this
        if (test_value) {
          uAxios.delete(`admin/home/recommends/${id}`).then((response) => {
            if (response.data.code === 0) {
              this.$Message.info('删除成功')
              this.getlist(this.currentPage)
            } else {
              this.$Modal.error({
                content: response.data.message
              })
            }
          })
        }
      },
      getlist (page) {
        let self = this
        uAxios.get('admin/ads')
          .then(res => {
            let result = res.data.data
            self.information = result.map((item, index) => {
              return {
                path: item.path,
                id: item.id,
                pic: item.pic,
                content: item.content
              }
            })
            self.messageList = self.information
          })
      }
    },
    mounted () {
      this.id = 1
      this.getlist(1)
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }

  .bc_item {
    margin-top: 12px;
    border: 1px solid #cdcdcd;
    position: relative;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  .move_box {
    position: absolute;
    top: 0;
    right: 12px;

    .moveUp, .moveDown {
      margin-top: 4px;
      padding: 2px 8px;
    }

    .moveUp {
      border-top: 2px solid #33c627;
      color: #33c627;
      /*border-bottom-left-radius: 12px;*/
    }

    .moveDown {
      border-bottom: 2px solid #ec5a39;
      color: #ec5a39;
      margin-top: 12px;
    }
  }

  Input{
    max-width: 300px;
  }
</style>
