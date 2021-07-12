// 歌曲信息搜索接口：https://autumnfish.cn/search
// 歌曲URL获取接口：https://autumnfish.cn/song/url (请求参数：歌曲id)
// 歌曲详情（封面）获取：https://autumnfish.cn/song/detail (请求参数：歌曲id)
// 歌曲评论获取：https://autumnfish.cn/comment/hot?type=0 (请求参数：歌曲id)
// 歌曲mv获取：https://autumnfish.cn/mv/url (请求参数：mvid，为0表示没有mv)
var app = new Vue({
    el:"#player",
    data:{
        //搜索关键字
        query:"",
        //歌曲数组
        musicList:[],
        //歌曲地址
        musicUrl:"",
        //歌曲封面
        musicCover:"",
        //歌曲评论
        hotComments:[],
        // 遮罩层显示状态
        isShow:false,
        // mv地址
        mvUrl:"",
        //音乐播放状态,mv播放状态
        isPlaying:false,
		
		//天气预报
		city:'湛江',
		weatherList:[], //五天天气列表
		type:'',//当天天气类型
		temperature:'',//当天天气温度
		month:'' //月份
    },
    methods:{
        //歌曲搜索
        searchMusic:function(){
            var that = this;
            axios.get("https://autumnfish.cn/search?keywords="+this.query)
            .then(function(response){
                //console.log(response);
                that.musicList = response.data.result.songs;
            },function(err){
                console.log(err);
            })
        },
        //歌曲播放
        playMusic: function(musicId){
            //console.log(musicId);
            var that = this;
            axios.get("https://autumnfish.cn/song/url?id="+musicId)
            .then(function(response){
                //console.log(response.data.data[0].url);
                that.mvUrl = "";
                that.musicUrl = response.data.data[0].url;
            },function(err){
                console.log(err);
            })
            
            //歌曲封面获取
            axios.get("https://autumnfish.cn/song/detail?ids="+musicId)
            .then(function(response){
                //console.log(response.data.songs[0].al.picUrl);
                that.musicCover = response.data.songs[0].al.picUrl;
            },function(err){console.log(err);})

            //歌曲评论获取
            axios.get("https://autumnfish.cn/comment/hot?type=0&id="+musicId)
            .then(function(response){
                //console.log(response.data.hotComments);
                that.hotComments = response.data.hotComments;
            },function(err){console.log(err);})
        },    
        playMv: function(mvId){
            //mv播放
            var that = this;
            axios.get("https://autumnfish.cn/mv/url?id="+mvId)
            .then(function(response){
                //console.log(response.data.data.url);
                that.isShow = true; //显示遮罩层 
				that.$refs.audio.pause();//暂停当前播放音乐（重复播放有杂音）
                that.mvUrl = response.data.data.url;
            },function(err){console.log(err);})
        },

        //播放时动画打开
		play:function(){
			this.isPlaying=true;
		},
		//暂停时动画暂停
		pause:function(){
			this.isPlaying=false;
		},

        //隐藏
        hide:function(){
            this.isShow = false;
            //关闭之后,视频也不再播放了
			this.$refs.video.pause();
        },
		
		//搜索天气并赋值
		searchWeather:function(){
			var d = new Date();
			this.month = (d.getMonth()+1)+'月';
		    //console.log(this.city);
		    var that = this;   //回调函数中this已经改变 
		    axios.get('http://wthrcdn.etouch.cn/weather_mini?city='+this.city)
		    .then(function(response){
		        console.log(response)
		        that.weatherList = response.data.data.forecast;
			    // 给天气列表加上对应天气图标
				for(var i = 0; i<that.weatherList.length; i++)
					{	
						that.weatherList[i].img = "../音乐播放器/image/" + that.weatherList[i].type + ".png";
						that.weatherList[i].high = that.weatherList[i].high.substr(3)
						that.weatherList[i].low = that.weatherList[i].low.substr(3)
					}
				console.log(that.weatherList);
				that.temperature = response.data.data.wendu + '℃';
				that.type = that.weatherList[0].img;
		    },function(err){
		        console.log(err);
		    })
		},
    },
	//设置监听isPlaying的变化，让用户点击唱片图标也可以进行歌曲的暂停与播放
	watch:{
		isPlaying (news,olds){
			if(news == true){
				this.$refs.audio.play();
			}
			else{
				this.$refs.audio.pause();
			}
		}
	},
	//利用钩子函数在创建实例后就搜索湛江天气
	created() {
		this.searchWeather();
	}
})