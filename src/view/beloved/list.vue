<template>
  <div v-model="activeTab">
    <Card style="margin-bottom: 32px">
      <div slot="title">
        <Icon type="ionic"></Icon>
        点击标签筛选
        <span
          style="background-image: linear-gradient(to right, #c8241b, #fc6906);box-shadow:1px 1px 12px #fc9185;padding:2px 7px;color: white;text-align: center;border-radius: 32px;margin-right: 12px;">{{total}}人</span>
      </div>
      <div v-for="(item,index) in labels" style="margin-bottom: 12px;display: inline-block;margin-right: 12px">
        <span style="margin-right: 6px;line-height: 56px;">{{item.title}}</span>
        <i-switch @on-change="change(item,$event)" :disabled="item.disabled" v-model="item.active"
                  style="margin-bottom: 2px"/>
      </div>
      <div>
        <Tag v-for="item in count" :key="item" closable @on-close="handleClose2(item,$event)">{{item}}</Tag>
      </div>
    </Card>
    <Tabs @on-click="getTab">
      <TabPane :label="item.title" :name="item.jump" v-for="item,index in tab" :key="index">
        <Input
          v-model="searchKeyword"
          @on-enter="createLabel"
          placeholder="搜索用户..."
          style="width: 200px; margin-bottom: 22px;"/>
        <span @click="createLabel">
          <Button type="primary" icon="ios-search" style="margin-bottom: 22px; margin-left: 12px;">搜索</Button>
        </span>
        <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
        <Page :total="orgTotal" @on-change="handlePage" :page-size="15" style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
      </TabPane>
    </Tabs>
    <Modal
      v-model="modal1"
      title="温馨提示"
      @on-ok="ok"
    >
      <p>是否执行该操作？</p>
    </Modal>
    <Modal
      v-model="modal"
      title='温馨提示'
      ok-text="OK"
      @on-ok="deleteUser"
      no-cancel>
      <p>是否确认删除佳偶？</p>
    </Modal>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import uAxios from '../../api/index'
  import config from '../../api/config'
  // import moment from 'moment';

  export default {
    search: '',
    name: 'beloved',
    data () {
      return {
        activeTab: '0',
        tab: [{title: '未审核', jump: '0'}, {title: '已审核', jump: '1'}],
        currentPage: 1,
        searchKeyword: '',
        modal: false, // 弹
        // 框
        orgTotal: 0,
        id: '',
        modal1: false,
        social: '',
        total: '',
        cost: '',
        count: [],
        jump: {
          is_vip: 0,
          is_match: 0,
          has_maker: 0,
          type: 'all',
          sex: 0
        },
        labels: [
          {
            title: '全部',
            item: ['vip', '良人佳偶认证', '有跟进红娘', '实名认证', '单身', '介绍人', '男', '女'],
            active: false,
            disabled: false
          },
          {title: 'vip', item: ['vip'], active: false, disabled: false},
          {title: '良人佳偶认证', item: ['良人佳偶认证'], active: false, disabled: false},
          {title: '有跟进红娘', item: ['有跟进红娘'], active: false, disabled: false},
          {title: '实名认证', item: ['实名认证'], active: false, disabled: false},
          {title: '单身/介绍人', item: ['单身', '介绍人'], active: false, disabled: false},
          {title: '男/女', item: ['男', '女'], active: false, disabled: false},
        ],
        Columns: [
          {
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center',
            sortable: true
          },
          {
            title: 'ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'mobile'
          },
          {
            title: '头像',
            key: 'updatedAt',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.avatar
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
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'user_detail',
                      params: argu
                    })
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '性别',
            align: 'center',
            width: 80,
            key: 'sex'
          },
          {
            title: '居住省市',
            align: 'center',
            key: 'address'
          },
          {
            title: '会员类型',
            align: 'center',
            key: 'rank'
          },
          {
            title: '单身/介绍人',
            align: 'center',
            key: 'type'
          },
          {
            title: '良人佳偶认证？',
            align: 'center',
            key: 'is_good_match'
          },
          {
            title: '加入时间',
            align: 'center',
            key: 'created_at'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              if (this.activeTab == '0') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'success'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.cost = '1'
                        this.id = params.row.id
                        this.modal1 = true
                      }
                    }
                  }, '同意申请'),
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.cost = '-1'
                        this.id = params.row.id
                        this.modal1 = true
                      }
                    }
                  }, '拒绝申请'),
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        let argu = {id: params.row.id}
                        this.$router.push({
                          name: 'user_detail',
                          params: argu
                        })
                      }
                    }
                  }, '用户详情')
                ])
              } else {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'error'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.id = params.row.id
                        this.modal = true
                      }
                    }
                  }, '删除佳偶'),
                  h('Button', {
                    props: {
                      type: 'primary'
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        let argu = {id: params.row.id}
                        this.$router.push({
                          name: 'user_detail',
                          params: argu
                        })
                      }
                    }
                  }, '用户详情')
                ])
              }
            }
          }
        ],
        value: '',
        information: [],
        loading: false,
        type: ''
      }
    },
    watch: {},
    methods: {
      ok () {
        let self = this,
          data = {
            status: this.cost
          }
        uAxios.put('admin/check/good/match/' + self.id, data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('操作成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      handleClose2 (name, event) {
        const index = this.count.indexOf(name)
        this.count.splice(index, 1)
        this.labels[0].active = false
        if (this.count.length == 0) {
          this.labels[0].disabled = false
        }
        this.getlist(1)
        let arr = [
          {key: 'is_vip', value: 'vip', index: 1},
          {key: 'is_match', value: '良人佳偶认证', index: 2},
          {key: 'has_maker', value: '有跟进红娘', index: 3},
          {key: 'is_approved', value: '实名认证', index: 4}
        ]
        for (let item of arr) {
          switch (this.count.includes(item.value)) {
            case true:
              this.labels[item.index].active = true
              break
            default:
              this.labels[item.index].active = false
          }
        }
        switch (this.count.indexOf('男') == -1 && this.count.indexOf('女') == -1) {
          case true:
            this.labels[6].active = false
            break
          default:
            this.labels[6].active = true
        }
        switch (this.count.indexOf('单身') == -1 && this.count.indexOf('介绍人') == -1) {
          case true:
            this.labels[5].active = false
            break
          default:
            this.labels[5].active = true
        }
        if (this.count.length != 0) {
          this.labels[0].disabled = true
        }
      },
      change (item, status) {
        if (status) {
          if (item.title === '全部') {
            for (let index in this.labels) {
              this.labels[index].active = true
            }
          } else {
            this.labels[0].disabled = true
          }
          for (let data of item.item) {
            this.count.push(data)
          }
        } else {
          if (item.title === '全部') {
            for (let index in this.labels) {
              this.labels[index].active = false
            }
          }
          for (let data of item.item) {
            let index = this.count.indexOf(data)
            if (index != -1) {
              this.count.splice(index, 1)
            }
          }
          if (this.count.length == 0) {
            this.labels[0].disabled = false
          }
        }
        this.getlist(1)
//                this.$Message.info('开关状态：' + status);
      },
      createLabel () {
        console.log(this.searchKeyword)
        this.page = 1
        this.getlist(1)
      },
      complainList () {
        // 投诉列表
        this.$router.push({
          name: 'complain'
        })
      },
      filterLabel (page) {
        console.log(this.social)
        if (this.social == 1 || this.social == 2) {
          this.type = 'single'
        } else {
          this.type = 'marriage'
        }
        this.page = 1
        this.getlist(1)
      },
      deleteUser () {
        let self = this
        uAxios.delete('admin/good/match/' + self.id).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('删除成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        this.getlist(1)
      },
      handlePage (num) {
        // 分页
        this.currentPage = num
        if (this.social.length == 0) {
          this.getlist(num)
        } else {
          this.filterLabel(num)
        }

      },
      searchTitle () {
        let arr = [
          {key: 'is_vip', value: 'vip'},
          {key: 'is_match', value: '良人佳偶认证'},
          {key: 'has_maker', value: '有跟进红娘'},
          {key: 'is_approved', value: '实名认证'}
        ]
        for (let item of arr) {
          switch (this.count.includes(item.value)) {
            case true:
              this.jump[item.key] = 1
              break
            default:
              this.jump[item.key] = 0
          }
        }
        if (this.count.includes('男')) {
          this.jump.sex = '1'
        } else if (this.count.includes('女')) {
          this.jump.sex = '2'
        } else {
          this.jump.sex = '0'
        }
        if (this.count.includes('男') && this.count.includes('女')) {
          this.jump.sex = '0'
        }
        if (this.count.includes('单身')) {
          this.jump.type = 'single'
        } else if (this.count.includes('介绍人')) {
          this.jump.type = 'marriage'
        } else {
          this.jump.type = ''
        }
        if (this.count.includes('单身') && this.count.includes('介绍人')) {
          this.jump.type = ''
        }
        console.log(this.jump)
      },
      getlist (page) {
        let self = this,
          jump = ''
        self.searchTitle()
        self.loading = true
        for (let item in self.jump) {
          jump = jump + `&${item}=${self.jump[item]}`
        }
        uAxios.get('admin/good/matches?page=' + page + '&keyword=' + self.searchKeyword + jump + '&status=' + self.activeTab)
          .then(res => {
            let result = res.data.data
            self.total = res.data.data.total
            self.information = result.data.map((item) => {
              return {
                avatar: item.avatar,
                created_at: item.created_at,
                id: item.id,
                mobile: item.mobile,
                name: item.name,
                sex: item.sex == 1 ? '男' : '女',
                rank: item.rank,
                type: item.type == 'single' ? '单身' : '介绍人',
                is_good_match: item.is_good_match == '0' ? '未认证' : '已认证',
                address: `${item.province}${item.city}` == '' ? '暂无' : `${item.province} ${item.city}`
              }
            })
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
      handleSearch () {
        let query = '&keyword=' + this.searchKeyword
        let self = this
        let page = 1
        uAxios.get('posts?page=' + page + query)
          .then(res => {
            let result = res.data.data
            self.orgData = result.data
            console.log(self.orgData)
            self.orgTotal = result.total
            // self.searchKeyword = ''
          })
      }
    },
    mounted () {
      // if (Cookies.get('admin_type') === 'matcher') {
      //     return this.$router.push({
      //         name: 'error-403',
      //         params: ''
      //     });
      // }
      this.getlist(1)
      // this.$store.commit('updateMenulist');
    }
  }
</script>

<style lang="less">
  /*@import "../../styles/common";*/
</style>
