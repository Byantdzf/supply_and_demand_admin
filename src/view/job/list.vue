<template>
  <div id="name">
    <div v-model="activeTab">
      <Card>

        <Tabs @on-click="getTab">
          <TabPane label="全部" name="ALL">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="关键字搜索..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                        <Button type="primary" icon="ios-search"
                                style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                    </span>
            <span @click="creatParty">
<!--                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建兼职</Button>-->
                    </span>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </TabPane>
          <TabPane label="进行中" name="UNDERWAY">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="关键字搜索..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                        <Button type="primary" icon="ios-search"
                                style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                    </span>
            <span @click="creatParty">
<!--                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建兼职</Button>-->
                    </span>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </TabPane>
          <TabPane label="待开始" name="UNPLAYED">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="关键字搜索..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                        <Button type="primary" icon="ios-search"
                                style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                    </span>
            <span @click="creatParty">
<!--                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建兼职</Button>-->
                    </span>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </TabPane>
          <TabPane label="已结束" name="FINISHED">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="关键字搜索..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                        <Button type="primary" icon="ios-search"
                                style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                    </span>
            <span @click="creatParty">
<!--                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建兼职</Button>-->
                    </span>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </TabPane>
          <TabPane label="已取消" name="CANCELED">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="关键字搜索..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                        <Button type="primary" icon="ios-search"
                                style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                    </span>
            <span @click="creatParty">
<!--                        <Button type="success" style=" margin-bottom: 22px; float: right;">创建兼职</Button>-->
                    </span>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'

  export default {
    name: 'activityList',
    components: {},
    data () {
      return {
        id: 2134,
        searchKeyword: '',
        loading: false,
        switchLoading: false,
        recommend: false,
        activeTab: 'ALL',
        orgTotal: 0,
        Columns: [
          {
            title: 'ID',
            align: 'center',
            width: 80,
            key: 'id'
          },
          {
            title: '名称',
            align: 'center',
            key: 'title'
          },
          {
            title: '图片',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.pics[0]
                },
                style: {
                  height: '48px',
                  marginTop: '6px',
                  border: '2px solid #f4f4f4'
                },
                on: {
                  click: () => {
                    // let argu = {id: params.row.id};
                    // this.$router.push({
                    //     name: 'activity',
                    //     params: argu
                    // });
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '地址',
            align: 'center',
            render: (h, params) => {
              let address = `${params.row.province}-${params.row.city}-${params.row.dist}`
              return h('span', params.row.dist !== null ? address : '未填写')
            },
          },
          {
            title: '阅读量',
            align: 'center',
            width: 100,
            key: 'click_num'
          },
          {
            title: '发布类型',
            align: 'center',
            render: (h, params) => {
              return h('span', params.row.type !== 'SUPPLY' ? '供应' : '需求')
            },
          },
          {
            title: '发布时间',
            align: 'center',
            width: 100,
            key: 'created_at'
          },
          {
            title: '是否推荐',
            align: 'center',
            width: 100,
            render: (h, params) => {
              if (params.row.is_cancel > 0 || params.row.is_deadline > 0) {
                return h('span', '已结束')
              }
              return h('i-switch', {
                props: {
                  value: params.row.is_recommend > 0,
                  recommend: this.recommend
                },
                on: {
                  'on-change': (value) => {
                    this.is_recommend(value, params.row.id)
                  }
                }
              })
            }
          },
          {
            title: '是否置顶',
            align: 'center',
            width: 100,
            render: (h, params) => {
              if (params.row.is_cancel > 0 || params.row.is_deadline > 0) {
                return h('span', '已结束')
              }
              return h('i-switch', {
                props: {
                  value: params.row.is_top > 0,
                  switchLoading: this.switchLoading
                },
                on: {
                  'on-change': (value) => {
                    this.switchFn(value, params.row.id)
                  }
                }
              })
            }
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              return h('div', [
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
                        name: 'Detail',
                        params: argu
                      })
                    }
                  }
                }, '查看详情'),
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.deleteJob(params.row.id)
                    }
                  }
                }, '删除供需')
                // h('Button', {
                //   props: {
                //     type: 'success'
                //   },
                //   style: {
                //     margin: '5px'
                //   },
                //   on: {
                //     click: () => {
                //       this.copyActivity(params.row.id)
                //     }
                //   }
                // }, '复制活动')
              ])
            }
          }
        ],
        information: [],
      }
    },
    methods: {
      copyActivity (id) {
        uAxios.post(`admin/copy/activity/${id}`).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('复制成功!')
            this.getlist(1)
          } else {
            alert('操作失败！')
          }
        }).catch(() => {
        })
      },
      switchFn (val, id) {
        console.log(val)
        this.switchLoading = true
        if (val) {
          uAxios.put(`admin/top/supply/and/demands/${id}`).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('设置成功!')
              this.switchLoading = false
              this.getlist(1)
            } else {
              alert('操作失败！')
            }
          })
        } else {
          uAxios.put(`admin/cancel/top/supply/and/demands/${id}`).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('设置成功!')
              this.switchLoading = false
              this.getlist(1)
            } else {
              alert('操作失败！')
            }
          })
        }

      },
      is_recommend (val, id) {
        this.recommend = true
        uAxios.put(`admin/recommend/supply/and/demands/${id}`).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('设置成功!')
            this.recommend = false
            this.getlist(1)
          } else {
            alert('操作失败！')
          }
        })
      },
      deleteJob (id) {
        this.$Modal.confirm({
          title: '系统提示',
          content: '<p>是否确认删除？</p>',
          onOk: () => {
            uAxios.delete(`admin/supply/and/demands/${id}`).then(response => {
              if (response.data.code === 0) {
                this.$Message.success('删除成功!')
                this.recommend = false
                this.getlist(1)
              } else {
                alert('操作失败！')
              }
            })
          }
        })
      },
      handlePage (num) { // 分页
        this.currentPage = num
        this.getlist(num)
      },
      handleSearch () {
        this.getlist(1)
      },
      creatParty () {
        let argu = {id: 0}
        this.$router.push({
          name: 'Detail',
          params: argu
        })
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        this.getlist()
      },
      getlist (page=1) {
        let self = this
        self.loading = true
        uAxios.get(`admin/supply/and/demands?page=${page}&keyword=${self.searchKeyword}&status=${self.activeTab}`)
          .then(res => {
            let result = res.data.data
            self.total = res.data.data.total
            self.information = result.data
            for (let item of self.information){
              item.pics = JSON.parse(item.pics)
            }
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
    },
    mounted () {
      this.getlist(1)
    }
  }
</script>
<style lang="less" scoped>
  .line-chart-con {
    height: 300px;
  }

  .ivu-card-body {
    text-align: center;
  }

  ._bc-list {
    box-shadow: 0 0 12px #d3d3d3;
    margin-bottom: 12px;
    padding: 12px;
    position: relative;
  }

  ._bc-num {
    font-size: 42px;
    font-weight: bold;
    position: absolute;
    right: 6%;
    top: 40%;
  }

  .bc-style {
    width: 54px;
    position: absolute;
    right: 2%;
    top: 2%;
  }

  .float_l {
    float: left;
  }

  ._bc-name {
    font-size: 16px;
    margin-left: 12px;
    font-weight: bold;

  }
</style>
