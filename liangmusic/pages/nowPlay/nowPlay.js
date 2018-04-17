var app = getApp()
var tag = 1;
Page({
  playAudio: function (e) {
    var me = this
    wx.playBackgroundAudio({
          dataUrl: me.data.src,
          title: me.data.name,
          coverImgUrl: me.data.pic,
          success:function(){
            me.backgroundAudioTime();
            me.setData({playP:true})
          }
    })  
  },
  data: {
    poster: '',
    name: '',
    author: '',
    src: '',
    pic:'',
    playP:true,
    curTime:'00:00',
    endTime:'00:00',
    reCurTime:'',
    reEndTime:'',
    songId:'',
  },//播放暂停
  audioPlay: function () { 
    if(tag == 1){
      wx.pauseBackgroundAudio()
      this.setData({playP:false})
      tag = 0;
    }else{
      this.playAudio()
      this.setData({playP:true})
      tag = 1;
    }
    
  },//获取音乐时间
  backgroundAudioTime:function(u){
      var me = this;
      var timer = setInterval(function(){
        wx.getBackgroundAudioPlayerState({
            success: function(res) {
                var status = res.status
                var dataUrl = res.dataUrl
                var curTime = res.currentPosition
                var endTime = res.duration
                var downloadPercent = res.downloadPercent
                if(curTime == endTime  && status == '1'){
                  clearInterval(timer)
                  me.setData({playP:false})
                  tag = 0;
                }
                console.log(curTime)
                me.setData({reCurTime:curTime})
                me.setData({reEndTime:endTime})
                if(curTime <10){
                  curTime = '00:0' + curTime;
                }
                if(curTime >= 10){
                  if(curTime >= 60){
                    var c = parseInt(curTime / 60)
                    var d = curTime % 60
                    if(d < 10){
                      d = '0' + d;
                    }
                    curTime = '0'+ c + ':' + d;
                  }else{
                    curTime = '00:' + curTime;
                  }
                  
                }  
                var a = parseInt(endTime / 60);
                var b = endTime % 60;
                if(b < 10){
                  b = '0' + b;
                }
                endTime = '0' + a + ':' + b;
                me.setData({curTime:curTime})
                me.setData({endTime:endTime})
            }
        })
      },1000)
        
  },//滑动条的改变
  slider1change:function(e){
    var mine = this;
    var e = e.detail.value
    wx.seekBackgroundAudio({
        position: e
    })
    if(e <10){
          e = '00:0' + e;
        }
        if(e >= 10){
          if(e >= 60){
            var c = parseInt(e / 60)
            var d = e % 60
            if(d < 10){
              d = '0' + d;
            }
            e = '0'+ c + ':' + d;
          }else{
            e = '00:' + e;
          }
          
        }  
       
        this.setData({curTime:e})
  },
  onLoad:function(){
    if(app.songId == undefined ){
      this.setData({playP:false})
    }else{
      this.dataUpdate()
    }
     
  },//下拉刷新
  onPullDownRefresh: function(){
    setTimeout(function(){
      wx.stopPullDownRefresh()
    },1000)
  },
  onShow:function(){
    if(app.songId == '001'){
      this.setData({name: '此时此刻',
    author: '许巍',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    pic:'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',})
      this.playAudio()
      return;
    }
    tag = 1;
    var old = this.data.songId;
    var newId = app.songId;
    if(old != newId){
      this.setData({songId:newId});
      this.dataUpdate();
    } 
  },
  dataUpdate:function(){
     var that = this;
        wx.request({
            url: 'https://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid='+app.songId,//+app.songId
            header: {
                'content-type': 'application/json'
            },
            success: function(res) {
                // console.log(res)
                that.setData({author:res.data.songinfo.author,name:res.data.songinfo.album_title,src:res.data.bitrate.file_link,pic:res.data.songinfo.pic_small})
                // console.log(that.data)
                // setTimeout(function(){
                  that.playAudio();
                // },1000)
                
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