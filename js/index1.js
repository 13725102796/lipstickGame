var hg = null;
function addClass(element, new_name) {
    if (!element || !new_name) return false;
    if (element.className) {
        var old_class_name = element.className;
        element.className = old_class_name + " " + new_name;
    } else{
        element.className = new_name;
    }
    return true;
}
function removeClass(element, class_name) {
    if(!element || !class_name) return false;
    if (!element.className) return false;
    var all_names = element.className.split(" ");
    for (var i = 0; i < all_names.length; i++) {
        if (all_names[i] === class_name) {
            all_names.splice(i, 1);
            element.className = "";
            for (var j = 0; j < all_names.length; j++) {
                element.className += " ";
                element.className += all_names[j];
            }
            return true;
        }
    }
}
var orderId = null;
$(function() {
    $(".close").on("click",function(){
        if (window.isH5) {
            window.history.go(-1);
        }else{
            // wx.miniProgram.navigateBack();
        }
    })
    document.getElementById("levelSwitchBox").addEventListener("webkitAnimationEnd", function() {
        $("#levelSwitchBox").css("display","none")
        $("#levelSwitchBoxMain").attr("src","./img/level_2_main.png?v=1.0.0")
        $("#levelSwitchBox").removeClass("hidden")
    })
    $("#levelSwitchBox").addClass("hidden")
    if(!hg){
        createHg(false)
    }
});
function playAudioInWechat(obj){
    if (window.WeixinJSBridge) {
        WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
            obj.currentTime=0;
            obj.play();
        }, false);
    } else {
        document.addEventListener("WeixinJSBridgeReady", function () {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                obj.currentTime=0;
                obj.play();
            });
        }, false);
    }
}
function createHg(GAMEMODE){
    //初始化游戏, 两个参数分别表示"游戏所处的canvas画布元素"和"关卡设置, 可以省略(省略后将使用默认设置)"
    hg = new HardestGame(document.getElementById("gameStage"),GAMEMODE);
    //游戏成功过关
    hg.levelSuccessHandle = function (){
        if(hg.level<3){
            playAudioInWechat($("#success_audio").get(0));
            document.getElementById("currentLevel").getElementsByTagName("span")[0].innerHTML = hg.level;
            var time = 3;
            var interval = setInterval(function (){
                time--;
                if(time <= 0){
                    clearInterval(interval);
                    hg.gameContinue(true);
                }
            },1000);
        }else{
            var audio = document.getElementById('back_music');
            audio.pause();
            playAudioInWechat($("#gameSuccess_audio").get(0));
            $("#app").addClass("blur")
            $("#gameSuccessBox").css("display","block")
            $("#gameSuccessBoxBtn").on("click",function(){
                if (window.isH5) {
                    window.history.go(-1);
                }else{
                    // wx.miniProgram.switchTab({
                    //     url: '../index/index'
                    // });
                    // wx.miniProgram.navigateBack();
                    // wx.miniProgram.postMessage({data: {id: '1234'}});
                }
            })
        }
    }
    //游戏失败结束
    hg.gameOverHandle = function (){
        clearInterval(timeboxInterval);
        hg=null;
        if(hg){delete hg;}
        var audio = document.getElementById('back_music');
        audio.pause();
        playAudioInWechat($("#gameFail_audio").get(0));
        $("#gameOverBox").css("display","block");
        $("#app").addClass("blur")
        $("#gameOverBoxBtn").on("click",function(){
            if (window.isH5) {
                window.history.go(-1);
            }else{
                // wx.miniProgram.navigateBack();
                // wx.miniProgram.postMessage({data: {id: '1234'}});
            }
        })
    }
    //初始化游戏
    hg.init();
    hg.canvas.parentNode.style.width = hg.canvas.width + "px";
    hg.canvas.parentNode.style.height = hg.canvas.height + "px";
    //游戏开始
    hg.gameStart();
    document.getElementById("currentLevel").getElementsByTagName("span")[0].innerHTML = hg.level;
    return true;
}
