$(function () {
    var html = document.querySelector('html');
    changeRem();
    window.addEventListener('resize', changeRem);
    function changeRem() {
        var width = html.getBoundingClientRect().width;
        html.style.fontSize = width / 10 + 'px';
    }
            
    $('.awards').append('<p style="font-weight: bolder;margin-top:.3rem">您的中奖记录：</p><span style="color:#fff;font-weight: bolder;">奶茶一杯</span>')
    var $blin = $(".light p"),
        $prize = $(".play li").not("#btn"),
        $change = $("#change"),
        $btn = $("#btn"),
        length = $prize.length,
        data = {count: 1},
        bool = true,
        mark = 0,
        timer;
        $maskRule = $("#mask-rule"),
        $mask = $("#mask"),
        $winning = $(".winning"),
        $card = $("#card"),
        $close = $("#close");

        // $(".rule").click(function () {
        //     $maskRule.show();
        // });
        // $("#close-rule").click(function () {
        //     $maskRule.hide();
        // });

    init();
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
            if (data.count > 0) {
                data.count--;
                $change.html(data.count);
                clickFn();
            } else {
                alert("每人只有一次抽奖机会哦");
            }
        }
    });
    // 点击抽奖
    function clickFn() {
        clearInterval(timer);
        // var random = [1, 2, 3, 4, 5, 6, 7, 8];
        var text = '奈雪的茶'
        // random = random[Math.floor(Math.random() * random.length)];
        // 奖项index
        random = 0;
        mark += random;
        mark %= 8;
        console.log(mark)
        // if (mark === 3) {
        //     random++;
        //     mark++;
        // }
        // if (mark === 6) {
        //     random--;
        //     mark--;
        // }
        random += 40-mark;
        for (var i = 1; i <= random; i++) {
            setTimeout(animate(), 2 * i * i);
        }
        setTimeout(function () {
            console.log(mark);
            setTimeout(function () {
                bool = true;
                win(text);
            }, 1000);
        }, 2 * random * random);
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
    // 领奖
    $("#close,.win,.btn").click(function () {
        // clearInterval(timer);
        // init();
        alert('抽奖结果统计完毕后将由人事部门统一发放奖品，敬请期待！')
        $mask.hide();
        $winning.removeClass("reback");
        $card.removeClass("pull");
    });

});




