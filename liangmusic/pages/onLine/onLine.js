var app = getApp()
var offset = 0;
Page({
    data:{
        duration:500,
        current:0,
        tag:0,
        backTag:0,
        left:'14%',
        categrayCont:false,
        categrayA:false,
        scrollOr:true,
        nowType:'',
        collection:1,
        songList:[],
        collectionList:[{
            poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
            name: '此时此刻',
            author: '许巍',
            src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        }]
    },
    onLine:function(){
        this.setData({current:0})
        this.setData({left:'14%'})
    },
    myMusic:function(){
        this.setData({current:1})
        this.setData({left:'65%'})
    },
    bindchange:function(event){
        this.setData({tag:event.detail.current})
    },
    musicList:function(index){
        this.setData({nowType:index})
        wx.showLoading({
            title: '加载中...',
        })
        this.setData({scrollOr:false})
        var that = this;
        wx.request({
            url: 'https://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type='+index+'&size=10&offset=0',
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log(res.data.song_list)
                that.setData({songList:res.data.song_list})
                wx.hideLoading()
            }, 
            fail: function(failRes) {
            // fail
            console.log(failRes);
            },
            complete: function() {
            // complete
            console.log('重定向')
            }
        })
    },
    onLoad:function(){
        // this.musicList()
    },
    changeView:function(event){
       app.songId = event.currentTarget.id;
        wx.switchTab({
            url: '/pages/nowPlay/nowPlay'
        })
    },
    goToView:function(){
        app.songId = '001';
        wx.switchTab({
            url: '/pages/nowPlay/nowPlay'
        })
    },
    categray:function(event){
        var that = this;
        this.musicList(event.target.id)
        setTimeout(function(){
            that.setData({categrayCont:true});
        },800)
        this.setData({categrayA:true})
       
        this.setData({backTag:1})
    },
    backView:function(){
        this.setData({categrayCont:false});
        this.setData({categrayA:false})
        this.setData({backTag:0})
        this.setData({scrollOr:true})
    },//我的收藏
    myLike:function(e){
        this.data.collectionList.push(e.target.id)
        for(var i=0; i< this.data.songList.length; i++){
            // console.log(this.data.songList[i].song_id)
        }
        // console.log(this.data.collectionList)
    },
    scrolltolower:function(){
         wx.showLoading({
            title: '加载中...',
        })
        offset += 10;
        var that = this;
        wx.request({
            url: 'https://tingapi.ting.baidu.com/v1/restserver/ting?format=json&calback=&from=webapp_music&method=baidu.ting.billboard.billList&type='+ that.data.nowType +'&size=10&offset=' + offset,
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                console.log()
                if(res.data.song_list == null){
                    wx.showToast({
                        title: '没有更多了...',
                        icon: 'success',
                        duration: 1000
                    })
                }else{
                    var arr = that.data.songList.concat(res.data.song_list)
                    that.setData({songList:arr})
                    wx.hideLoading()
                }  
            }, 
            fail: function(failRes) {
            // fail
            console.log(failRes);
            },
            complete: function() {
            // complete
            console.log('重定向')
            }
        })
    }
  
})