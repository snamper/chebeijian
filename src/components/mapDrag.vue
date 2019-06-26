
<template>
  <div class="m-map">
 
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>
</template>

<script>
import remoteLoad from '@/utils/remoteLoad.js'
import { MapKey, MapCityName } from '@/config/config'
export default {

  data () {
    return {
  
      AMapUI: null,
      AMap: null,
     
 data:[{"lng":'118.378806','lat':'31.293173'},{"lng":'118.374686','lat':'31.304908'},{"lng":'118.405585','lat':'31.305201'},{"lng":'118.40198','lat':'31.325439'}]


    }
  },

  methods: {

    // 实例化地图
    initMap () {

var map = new AMap.Map('js-container', {
    resizeEnable: true,   
    zoom: 13
});  

var marker
 
for(var i=0 ; i< this.data.length;i++){
      var jfong=[ this.data[i].lng,this.data[i].lat];	
     
				marker = new AMap.Marker({
			    position: jfong,
			    zIndex: 101,
			    map:map
				});	

      marker.setMap(map)
      marker.on('click', this.markerClick);
			
	
			
			
    }	

    },
    //点击事件
    markerClick() {
        console.log(777)
      
    }
  },
  async created () {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap && window.AMapUI) {
      this.initMap()
    // 未载入高德地图API，则先载入API再初始化
    } else {
      await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${MapKey}`)
      await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
      this.initMap()
    }
  }
}
</script>

<style lang="css">
.m-map{ min-width: 500px; min-height: 300px; position: relative; }
.m-map .map{ width: 100%; height: 100%; }
.m-map .search{ position: absolute; top: 10px; left: 10px; width: 285px; z-index: 1; }
.m-map .search input{ width: 180px; border: 1px solid #ccc; line-height: 20px; padding: 5px; outline: none; }
.m-map .search button{ line-height: 26px; background: #fff; border: 1px solid #ccc; width: 50px; text-align: center; }
.m-map .result{ max-height: 300px; overflow: auto; margin-top: 10px; }
</style>
