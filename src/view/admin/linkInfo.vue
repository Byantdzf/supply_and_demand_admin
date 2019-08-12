<template>
  <div>
    <Card>
      <Tabs style="margin-top: 12px;">
        <TabPane label="联系方式" name="adminList">
          <Form ref="formValidate" :label-width="100" :model="formValidate">
            <FormItem label="微信二维码：" prop="name">
              <informPic v-on:uploadPictures="uploadInformPic" :pic="formValidate.qrcode"></informPic>
            </FormItem>
            <FormItem label="联系方式：" prop="name">
              <Input v-model="formValidate.mobile" placeholder="Enter your name" style="width: 60%"></Input>
            </FormItem>
            <FormItem label="业务微信：" prop="name">
              <Input v-model="formValidate.wechat" placeholder="Enter your name" style="width: 60%"></Input>
            </FormItem>
          </Form>
          <div style="text-align: center;margin-top: 22px;">
            <Button type="success" size="large" icon="ios-checkmark" @click="saveLinkInfo">保存</Button>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'
  import dropdown from '../components/dropdown'
  import Cookies from 'js-cookie'
  import uploadImage from '../components/uploadImage'

  export default {
    name: 'authorization',
    components: {
      dropdown: dropdown,
      informPic: uploadImage
    },
    data() {
      return {
        formValidate: {
          mobile: '',
          qrcode: '',
          wechat: ''
        }
      }
    },
    methods: {
      saveLinkInfo () {
        // console.log(this.messageList)
        // for (let item of this.messageList) {
        //   for (let key in item) {
        //     if (item[key].toString().replace(/(^\s*)|(\s*$)/g, '') == '') {
        //       return this.$Message.error('请填写完整信息后再保存！')
        //     }
        //   }
        // }
        let data = {
          mobile: this.formValidate.mobile,
          wechat: this.formValidate.wechat,
          qrcode: this.formValidate.qrcode
        }
        uAxios.post(`admin/link/info`, data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('保存成功')
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      uploadInformPic (image) {
        console.log(image)
        this.formValidate.qrcode = image // 轮播
      },
      changeTree (val) {
        if (val && val[0].title) {
          if (val[0].title === '超级管理员') return this.paasName = 'super'
          for (let item of this.paasList) {
            if (item.title === val[0].title) {
              this.paasID = item.id
              this.paasName = item.name
            }
          }
        }
      },
      ok () {
        let vm = this
        if (!vm.name) {
          return vm.$Message.error('请输入名字！')
        } else if (!vm.mobile) {
          return vm.$Message.error('请输入手机号！')
        } else if (!vm.password) {
          return vm.$Message.error('请输入登录密码！')
        }
        uAxios.post(`admin/admins`, {name: vm.name, mobile: vm.mobile, password: vm.password})
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              vm.$Message.success('添加成功！')
              vm.getlist()
            }
          }).catch(() => {
          vm.$Message.error(result.message)
        })
      },
      removeAdmin (id, index) {
        uAxios.delete(`admin/users/${id}/admin`)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.information.splice(index, 1)
              this.$Message.success('删除成功！')
            }
          }).catch(() => {
          this.$Message.error(res.message)
        })
      },
      getTab (type) {
        this.activeTab = type
      },
      handlePage (num) { // 分页
        this.getlist(num)
      },
      getlist (page = 1) {
        let self = this
        self.loading = true
        uAxios.get(`admin/link/info`)
          .then(res => {
            let result = res.data.data
            self.formValidate = {
              mobile: result.mobile,
              qrcode: result.qrcode,
              wechat: result.wechat
            }
          })
      },
      handleSearch () {
        this.getlist(1)
      }
    },
    mounted () {
      this.getlist()
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold;
  }

  .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
    background-color: #d5e8fc;
    position: relative;
    padding-right: 22px;

    &:after {
      content: '';
      position: absolute;
      right: 4px;
      top: 5px;
      width: 12px;
      height: 18px;
      background-image: url("http://images.ufutx.com/201905/15/c09ba0a5ed976879bc389cc9cfd8c43a.png");
      background-size: contain;
      background-repeat: no-repeat;
    }

    /*box-shadow: 1px 1px 12px #d3d3d3;*/
  }
</style>
