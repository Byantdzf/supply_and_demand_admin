<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='title' name="detail">
        <Row>
          <Col span="22" style="margin: 22px">
            <Card>
              <Form ref="activity" :model="activity" :label-width="100">
                <FormItem label="项目图片" prop="image">
                  <Card style="max-width: 400px;">
                    <uploadImages v-on:uploadPictures="uploadPicture" :pic="jobData.pics"></uploadImages>
                  </Card>
                </FormItem>
                <FormItem label="项目名称" prop="name">
                  <Input v-model="jobData.title" placeholder="Enter title"></Input>
                </FormItem>
                <FormItem label="阅读量" prop="name">
                  <span style="color: #ff740a">{{jobData.click_num}}</span>
                </FormItem>
                <FormItem label="项目状态" prop="name">
                  <RadioGroup v-model="jobData.typeName">
                    <Radio label="供应"></Radio>
                    <Radio label="需求"></Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="项目状态" prop="name">
                  <RadioGroup v-model="jobData.statusName">
                    <Radio label="进行中"></Radio>
                    <Radio label="已结束"></Radio>
                    <Radio label="待开始"></Radio>
                    <Radio label="已取消"></Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem label="项目类型" prop="number">
                  <Cascader :data="jobTypeData" v-model="jobTypeValue" style="max-width:184px" @on-change="CascaderChange"></Cascader>
                </FormItem>
                <FormItem label="项目详情" prop="name">
                  <Row>
                    <Input v-model="jobData.content"  type="textarea" placeholder="项目详情" style="max-width: 400px;"></Input>
                  </Row>
                </FormItem>
                <FormItem label="开始时间" prop="name">
                  <Row>
                    <DatePicker type="date" format="yyyy-MM-dd" placement="top" @on-change="getDate"
                                placeholder="Select date and time(Excluding seconds)" style="max-width: 400px;"
                                :value="jobData.start_time"></DatePicker>
                  </Row>
                </FormItem>
                <FormItem label="结束时间" prop="name">
                  <Row>
                    <DatePicker type="date" format="yyyy-MM-dd" placement="top" @on-change="getDate"
                                placeholder="Select date and time(Excluding seconds)" style="max-width: 400px;"
                                :value="jobData.end_time"></DatePicker>
                  </Row>
                </FormItem>
                <FormItem label="联系人" prop="number">
                  <Row>
                    <Input v-model="jobData.linkman" placeholder="名称"></Input>
                  </Row>
                </FormItem>
                <FormItem label="联系人电话" prop="number">
                  <Row>
                    <Input v-model="jobData.link_mobile" placeholder="联系电话"></Input>
                  </Row>
                </FormItem>
              </Form>
              <div style="text-align: center">
                <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </TabPane>
      <!--<TabPane label='报名成员' name="activity" v-if="id != 0">-->
        <!--<Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>-->
        <!--<Page :total="orgTotal" @on-change="handlePage" :page-size="15"-->
              <!--style="float:right;margin-top:5px;margin-bottom:30px;"></Page>-->
      <!--</TabPane>-->
    </Tabs>
    <Modal v-model="showMapModel" width="860" title="活动地址" @on-ok="ok">
      <Geolocation @getLocation="getLocation" @hideModal="hideModal" :setLocation="setLocation"></Geolocation>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api/index'
  import config from '../../api/config'
  import Geolocation from '../components/Geolocation'
  import uploadImages from '../components/uploadImages'
  import uploadImage from '../components/uploadImage'
  import dropdown from '../components/dropdown'
  import VDistpicker from 'v-distpicker'

  export default {
    components: {
      dropdown,
      uploadImage,
      uploadImages,
      VDistpicker,
      Geolocation
    },
    watch: {
      value1 () {
        console.log(this.value1)
      }
    },
    data () {
      return {
        jobTypeValue: [1], // 类型
        jobTypeData: [], // 类型数组
        intro: '',
        jobData: {},
        articlesId: '',
        showMapModel: false,
        address: '',
        switch1: false,
        Index: 0,
        setLocation: [],
        disabled: false,
        user_is_admin: 0,
        date: [],
        title: '供需详情',
        BtnText: '保存',
        loading: false,
        payType: [
          {
            title: '供应',
            type: 'SUPPLY'
          },
          {
            title: '需求',
            type: 'DEMAND'
          }
        ],
        columns: [
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'key'
          }
        ],
        columns1: [
          {
            title: 'Name',
            key: 'title'
          },
          {
            title: 'Age',
            key: 'key'
          }
        ],
        information: [],
        VIPinformation: [],
        searchKeyword: '',
        activeTab: 'detail',
        orgColumns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '用户ID',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.user.id)
            }
          },
          {
            title: '用户名',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.user.name)
            }
          },
          {
            title: '头像',
            key: 'avatar',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.user.avatar
                },
                style: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  marginTop: '6px',
                  border: '4px solid #f4f4f4'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.user_id}
                    this.$router.push({
                      name: 'user_detail',
                      params: argu
                    })
                  }
                }
              })
            },
            width: 80,
            align: 'center'
          },
          {
            title: '报名时间',
            key: 'created_at',
            align: 'center',
            editable: true
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = {id: params.row.user_id}
                      this.$router.push({
                        name: 'user_detail',
                        params: argu
                      })
                    }
                  }
                }, '查看详情')
              ])
            }
          }
        ],
        orgData: [],
        total: 0,
        orgTotal: 0,
        modal: false,
        name: '',
        mobile: '',
        avatar: '',
        maker_name: '',
        is_approved: '',
        photos: [],
        graduate_photos: [],
        other_photos: [],
        identification_photos: [],
        wechat_qrcode: [],
        love_characters: [],
        love_languages: [],
        access: localStorage.getItem('access'),
        character: {},
        message: {},
        client_id: 0,
        uploaddata: [],
        id: 0,
        industryID: 0,
        //活动详情
        activity: {}
      }
    },
    methods: {
      CascaderChange(value, selectedData){
        // console.log(value, selectedData)
        this.industryID = value
        console.log(this.jobTypeValue)
      },
      handleChange (html, text) {
        this.intro = html
        console.log(this.intro)
      },
      editAddress (value) {
        this.activity.address = value.split(' ')[3]
      },
      hideModal (val) {
        this.showMapModel = val
      },
      getLocation (childValue, lnglat) {
        this.address = `${childValue.address}`
        this.jobData.province = childValue.province
        this.jobData.city = childValue.city
        this.jobData.dist = childValue.dist
        this.jobData.address = `${childValue.address}`
        this.jobData.lng = lnglat[0]
        this.jobData.lat = lnglat[1]
      },
      ok () {
        console.log('确定')
      },
      getDate (e) {
        this.jobData.job_time = e
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        this.getOrder(1)
      },
      settNote () {
        let argu = {id: this.id}
        this.$router.push({
          name: 'user_note',
          params: argu
        })
      },
      getGropData (_id) {
        this.client_id = _id
      },
      uploadPicture (image) {  // 单
        this.jobData.pic = image // 轮播banna
      },
      uploadPictures (image) {  // 多
        this.jobData.detail_pic = image // 详情image
      },
      // 提交表单
      handleSubmit () {
        this.jobData.intro = this.intro
        this.jobData.industry_id = this.industryID
        if (this.id == 0) {
          uAxios.post(`admin/jobs`, this.jobData).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('创建成功!')
              setTimeout(() => {
                this.$router.push({
                  name: 'jobList'
                })
              }, 800)
            } else {
              alert('操作失败！')
            }
          })
          console.log(this.activity)
          return
        }
        switch (this.jobData.typeName) {
          case '供应':
            this.jobData.type = 'SUPPLY'
            break
          case '需求':
            this.jobData.type = 'DEMAND'
            break
        }
        switch (this.jobData.statusName) {
          case '进行中':
            this.jobData.status = 'UNDERWAY'
            break
          case '已结束':
            this.jobData.status = 'FINISHED'
            break
          case '待开始':
            this.jobData.status = 'UNPLAYED'
            break
          case '已取消':
            this.jobData.status = 'CANCELED'
            break
        }
        console.log(this.jobData)
        uAxios.put(`admin/supply/and/demands/${this.id}`, this.jobData).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('保存成功!')
          } else {
            alert('操作失败！')
          }
        })
      },
      getOrder (page) { // 用户列表
        let self = this
        self.loading = true
        uAxios.get(`admin/jobs/${self.id}/members?page=` + page + '&type=' + self.activeTab + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            self.orgTotal = result.total
            self.loading = false
          })
      },
      // 赋值子类型
      getJobChildren (item) {
        let subs = []
        for (let item_son of item) {
          subs.push(
            {
              value: item_son.id,
              label: item_son.name
            }
          )
        }
        return subs
      },
      getJobType () {
        let vm = this
        uAxios.get('admin/industries?nopage=1')
          .then(res => {
            let result = res.data.data
            console.log(result)
            let typeList = []
            for (let item of result) {
              typeList.push(
                {
                  value: item.id,
                  label: item.name
                }
              )
            }
            vm.jobTypeData = typeList
          })
      },
      handlePage (num) {
        // 分页
        this.getOrder(num)

      },
      setStatus () {
        let status = ''
        switch (this.jobData.statusName) {
          case '进行中':
            status = 'UNDERWAY'
            break
          case '已结束':
            status = 'FINISHED'
            break
          case '待开始':
            status = 'UNPLAYED'
            break
          case '已取消':
            status = 'CANCELED'
            break
        }
        uAxios.put(`admin/supply/and/demands/${this.id}/status?status=${status}`)
          .then(res => {
            this.$Message.info('操作成功')
          })
      },
      getlist (page = 1) {
        let vm = this
        vm.loading = true
        uAxios.get(`admin/supply/and/demands/${vm.id}`)
          .then(res => {
            let result = res.data.data
            if (result.industry) {
              vm.jobTypeValue = [result.industry.id]
            }
            vm.jobData = result
            switch (result.status) {
              case 'UNDERWAY':
                vm.jobData.statusName = '进行中'
                break
              case 'FINISHED':
                vm.jobData.statusName = '已结束'
                break
              case 'UNPLAYED':
                vm.jobData.statusName = '待开始'
                break
              case 'CANCELED':
                vm.jobData.statusName = '已取消'
                break
            }
            switch (result.type) {
              case 'SUPPLY':
                vm.jobData.typeName = '供应'
                break
              case 'DEMAND':
                vm.jobData.typeName = '需求'
                break
            }

            vm.data = []
            vm.address = `${result.address}`
            vm.setLocation = [result.lng, result.lat]
          })
      },
    },
    created () {
    },
    mounted () {
      this.getJobType()
      if (this.$route.params.id != 0) {
        this.id = this.$route.params.id
        this.getlist()
        return
      }
      this.title = this.BtnText = '新增兼职'
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }

  #container {
    width: 300px;
    height: 180px;
  }

  .float_l {
    float: left
  }

  .distpicker-address-wrapper select {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0 12px !important;
    margin-right: 12px !important;
    font-size: 14px !important;
  }

  Input {
    max-width: 400px;
  }
</style>
