$(function () {
    var html = document.querySelector('html');
    changeRem();
    window.addEventListener('resize', changeRem);
    function changeRem() {
        var width = html.getBoundingClientRect().width;
        html.style.fontSize = width / 10 + 'px';
    }
    var requestUrl = 'https://web.princesky.com/'
    var $blin = $(".light p"),
        $prize = $(".play li").not("#btn"),
        $change = $("#change"),
        $btn = $("#btn"),
        length = $prize.length,
        count = 1,
        bool = true,
        mark = 0,
        giftCode = 0,
        oaId = getUrlKey('oaId',window.location.href),
        userCode = getUrlKey('userCode',window.location.href),
        userName = getUrlKey('userName',window.location.href),
        timer;
        $maskRule = $("#mask-rule"),
        $mask = $("#mask"),
        $winning = $(".winning"),
        $card = $("#card"),
        $close = $("#close");
        $.ajax({
            url: requestUrl+'platform/v1/api/gift/awards?activeCode=20201103&userCode='+userCode,
            type: 'get',
            data: '',
            success: function(data) {
                console.log(data)
                $('.one').html(data.data[0].awardName)
                $('.two').html(data.data[1].awardName)
                $('.three').html(data.data[2].awardName)
                $('.four').html(data.data[3].awardName)
                $('.five').html(data.data[4].awardName)
                $('.six').html(data.data[5].awardName)
                $('.seven').html('谢谢参与')
            },
            error: function(err) {
                $.alert('系统错误，数据获取失败')
            }
        })
        $.ajax({
            url: requestUrl+'platform/v1/api/gift/awardsRecord?activeCode=20201103&userCode='+userCode,
            type: 'get',
            data: '',
            success: function(data) {
                console.log(data)
                if(data.errmsg){
                    $.alert(data.errmsg)
                    return;
                }
                if(data.data.length>0){
                    count = 0
                    $change.html(count);
                    $('.record').append('<p style="font-weight: bolder;margin-bottom:.1rem">您的中奖记录：</p><span style="color:#fff;font-weight: bolder;text-decoration:underline">'
                                +data.data[0].awardName+'</span>')
                }else{
                    count = 1
                    $change.html(count);
                    init();
                }
            },
            error: function(err) {
                $.alert('系统错误，数据获取失败')
            }
        })


        // $(".rule").click(function () {
        //     $maskRule.show();
        // });
        // $("#close-rule").click(function () {
        //     $maskRule.hide();
        // });

    // 初始化动画
    function init() {
        timer = setInterval(function () {
            $blin.toggleClass("blin");
            length++;
            length %= 8;
            $prize.eq(length - 1).removeClass("select");
            $prize.eq(length).addClass("select");
            mark++;
            mark %= 8;
        }, 1000);
    }
    // 点击抽奖判断次数
    $btn.click(function () {
        if (bool) {
            bool = false;
            if (count > 0) {
                clickFn();
            } else {
                $.alert("每人只有一次抽奖机会哦");
            }
        }
    });
    // 点击抽奖
    function clickFn() {
        clearInterval(timer);
        $.ajax({
            url: requestUrl+'platform/v1/api/gift/draw?activeCode=20201103&userCode='+userCode+'&userName='+userName,
            type: 'get',
            data: '',
            success: function(data) {
                console.log(data)
                var data = data
                if(data.errmsg){
                    $.alert(data.errmsg)
                }else{
                    var text = data.data.giftName
                    var awardName = data.data.awardName
                    giftCode = data.data.giftCode-1+1
                    var result = 1
                    switch (giftCode){
                        case 1:
                            result = 0
                            break;
                        case 2:
                            result = 1
                            break;
                        case 3:
                            result = 2
                            break;
                        case 4:
                            result = 4
                            break;
                        case 5:
                            result = 5
                            break;
                        case 6:
                            result = 6
                            break;
                        case 7:
                            result = 7
                            break;
                    }
                    // 奖项index
                    random = 0;
                    mark += random;
                    mark %= 8;
                    random = random+40-mark;
                    random += result
                    for (var i = 1; i <= random; i++) {
                        setTimeout(animate(), 2 * i * i);
                    }
                    setTimeout(function () {
                        setTimeout(function () {
                            bool = true;
                            count--;
                            $change.html(count);
                            if(giftCode==7){
                                $.alert('谢谢参与')
                                $('.record').append('<p style="font-weight: bolder;margin-bottom:.1rem">您的中奖记录：</p><span style="color:#fff;font-weight: bolder;text-decoration:underline">谢谢参与</span>')
                            }else{
                                win(text);
                                $('.record').append('<p style="font-weight: bolder;margin-bottom:.1rem">您的中奖记录：</p><span style="color:#fff;font-weight: bolder;text-decoration:underline">'
                                +awardName+'</span>')
                            }
                        }, 1000);
                    }, 2 * random * random);
                    }
            },
            error: function(err) {
                $.alert('系统错误，数据获取失败')
            }
        })

    }
    // 奖品弹窗
    function win(text) {
        $mask.show();
        $winning.addClass("reback");
        setTimeout(function () {
            $card.addClass("pull");
            $("#card span").html(text)
        }, 500);
    }
    // 抽奖动画
    function animate() {
        return function () {
            $blin.toggleClass("blin");
            length++;
            length %= 8;
            $prize.eq(length - 1).removeClass("select");
            $prize.eq(length).addClass("select");
        }
    }
    function getUrlKey(name,url){
    　　return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null

    }
    // 领奖
    $("#close,.win,.btn").click(function () {
           $.alert('1月4日起凭抽奖页面中奖记录至相应门店或事业部HRBP处领取礼品')
            $mask.hide();
            $winning.removeClass("reback");
            $card.removeClass("pull"); 
    });

});




