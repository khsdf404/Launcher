window.$ = window.jQuery = require("jquery");
$(`document`).ready(function() {
  // Sapper
    $(".sapper_clean").click(function () {
        $(".sapper_case").remove();
        $(".end_class").remove();
        $(`.left_bombs`).text(``);
        $(`.sapper_btn`).css({"display":"flex"});
        $(`.sapper_clean`).css({"display":"none"});
    });
    $(".sapper_btn").click(function() {
        var wd = 27; // width
        var hg = 17; // height
        var bmb = 70; // bombs
    // Rematch
        $(`.sapper_btn`).css({"display":"none"});
        $(`.sapper_clean`).css({"display":"flex"});
        // Shaffle array func
        function shuffle(array)
            { array.sort(() => Math.random() - 0.5 ); }
        // Creating a playing field
        let random_array = [];
        for (k = 0; k < (wd*hg); k++) {
            $(".sapper_field").append(`<div class="sapper_case color_0 c_${k}"></div>`);
            random_array.push(k);
        }
        // Creating a bombs
        shuffle(random_array);
        shuffle(random_array);
        for (k = 0; k < bmb; k++) {
            $(`.c_${random_array[k]}`).addClass(`bomb`);
        }
        // bomb`s positions
        let bombs_pos_arr = [];
        for (k = 0; k < bmb; k++) {
            bombs_pos_arr.push($(`.sapper_wrapp .bomb`).eq(k).attr(`class`).split(` `)[2]);
        }
        // add classes num, zero
        for (k = 0; k < bmb; k++) {
            var bomb_pos = parseInt(bombs_pos_arr[k].replace(/\D+/g, ``));
            if ( bomb_pos % wd == 0 ) {
                $(`.c_` + (bomb_pos-wd) ).addClass(`num`);
                $(`.c_` + (bomb_pos-wd+1) ).addClass(`num`);
                $(`.c_` + (bomb_pos+1) ).addClass(`num`);
                $(`.c_` + (bomb_pos+wd) ).addClass(`num`);
                $(`.c_` + (bomb_pos+wd+1) ).addClass(`num`);
            }
            else if ( bomb_pos % wd == (wd-1)) {
                $(`.c_` + (bomb_pos-wd-1) ).addClass(`num`);
                $(`.c_` + (bomb_pos-wd) ).addClass(`num`);
                $(`.c_` + (bomb_pos-1) ).addClass(`num`);
                $(`.c_` + (bomb_pos+wd-1) ).addClass(`num`);
                $(`.c_` + (bomb_pos+wd) ).addClass(`num`);
            }
            else {
                $(`.c_` + (bomb_pos-wd-1) ).addClass(`num`);
                $(`.c_` + (bomb_pos-wd) ).addClass(`num`);
                $(`.c_` + (bomb_pos-wd+1) ).addClass(`num`);
                $(`.c_` + (bomb_pos-1) ).addClass(`num`);
                $(`.c_` + (bomb_pos+1) ).addClass(`num`);
                $(`.c_` + (bomb_pos+wd-1) ).addClass(`num`);
                $(`.c_` + (bomb_pos+wd) ).addClass(`num`);
                $(`.c_` + (bomb_pos+wd+1) ).addClass(`num`);
            }
        }
        $(`.sapper_wrapp .bomb.num`).removeClass(`num`);
        $(`.sapper_case`).not(`.bomb, .num`).addClass(`zero`);
////////////////////////////////////////////////////////////////////////////
        // counting bombs near cases
        for ( i = 0; i < $(`.sapper_wrapp .num`).length; i++) {
            var counter = 0;
            var class_position = $(`.sapper_wrapp .num:eq(${i})`).attr(`class`).split(` `)[2];
            var position = parseInt(class_position.replace(/\D+/g,""));
            var left = position - 1;
            var right = position + 1;
            var top = position - wd;
            var bottom = position + wd;
            var top_left = position - wd - 1;
            var top_right = position - wd + 1;
            var bottom_rigth = position + wd + 1;
            var bottom_left = position + wd - 1;
            let position_array = [left, right, top, bottom, top_left, top_right, bottom_left, bottom_rigth]
            let position_array_0 = [right, top, bottom, top_right, bottom_rigth]
            let position_array_26 = [left, top, bottom, top_left, bottom_left]
            if ( (position % wd != 0) && (position % wd != (wd-1)) ) {
                for ( t = 0; t < 8; t++) {
                    if ( $(`.c_${position_array[t]}`).hasClass(`bomb`) ) {
                        counter += 1;
                    }
                }
            }
            if (position % wd == 0) {
                for ( t = 0; t < 5; t++) {
                    if ( $(`.c_${position_array_0[t]}`).hasClass(`bomb`) ) {
                        counter += 1;
                    }
                }
            }
            if (position % wd == (wd-1)) {
                for ( t = 0; t < 5; t++) {
                    if ( $(`.c_${position_array_26[t]}`).hasClass(`bomb`) ) {
                        counter += 1;
                    }
                }
            }
            $(`.c_${position}`).text(counter)
        }
////////////////////////////////////////////////////////////////////////////
        // preparation
        $(`.sapper_wrapp .zero`).addClass(`will_groupped`);
        for (i = 0; i < (wd*hg); i++) {
            if ( ((i % wd == (wd-1)) || (i % wd == 0)) && ($(`.c_${i}`).hasClass(`zero`)) ) {
                $(`.c_${i}`).removeClass(`will_groupped`);
                $(`.c_${i}`).addClass(`side_zero`);
            }
        }
        // Creating groups
        var k = -1;
        while ( $(`.sapper_wrapp .will_groupped`).length > 0 ) {
            k += 1;
            var class_position = $(`.sapper_wrapp .will_groupped`).attr(`class`).split(` `)[2];
            var position = parseInt(class_position.replace(/\D+/g,""));
            $(`.${class_position}`).addClass(`flag grouped normal_zero group_${k}`);
            for ( m = 0; m < 60; m++) {
                while ( $(`.sapper_wrapp .flag`).length > 0) {
                    var class_position = $(`.flag:eq(${0})`).attr(`class`).split(` `)[2];
                    var position = parseInt(class_position.replace(/\D+/g,""));
                    var left = position - 1;
                    var right = position + 1;
                    var top = position - wd;
                    var bottom = position + wd;
                    var top_left = position - wd - 1;
                    var top_right = position - wd + 1;
                    var bottom_rigth = position + wd + 1;
                    var bottom_left = position + wd - 1;
                    let position_array = [left, right, top, bottom, top_left, top_right, bottom_left, bottom_rigth]
                    for ( i = 0; i < 8; i++) {
                        if ( $(`.c_${position_array[i]}`).hasClass(`will_groupped`) ) {
                            $(`.c_${position_array[i]}`).addClass(`flag grouped normal_zero group_${k}`);
                            $(`.c_${position_array[i]}`).removeClass(`will_groupped`);
                            $(`.c_${position}`).removeClass(`will_groupped flag`);
                        }
                        else if ( $(`.c_${position_array[i]}`).hasClass(`side_zero`) ) {
                            $(`.c_${position_array[i]}`).addClass(`grouped flag2 group_${k}`);
                            $(`.c_${position_array[i]}`).removeClass(`side_zero`);
                            $(`.c_${position}`).removeClass(`will_groupped flag`);
                        }
                        else if ( $(`.c_${position_array[i]}`).hasClass(`num`) ) {
                            $(`.c_${position_array[i]}`).addClass(`grouped group_${k}`);
                            $(`.c_${position}`).removeClass(`will_groupped flag`);
                        }

                        else {
                            $(`.c_${position}`).removeClass(`will_groupped flag`);
                        }
                    }
                    while ( 0 < $(`.sapper_wrapp .flag2`).length) {
                        var class_position = $(`.flag2:eq(${0})`).attr(`class`).split(` `)[2];
                        var position = parseInt(class_position.replace(/\D+/g,""));
                        var left = position - 1;
                        var right = position + 1;
                        var top = position - wd;
                        var bottom = position + wd;
                        var top_left = position - wd - 1;
                        var top_right = position - wd + 1;
                        var bottom_rigth = position + wd + 1;
                        var bottom_left = position + wd - 1;
                        let position_array_0 = [right, top, bottom, top_right, bottom_rigth];
                        let position_array_26 = [left, top, bottom, top_left, bottom_left];
                        if ( position % wd == 0 ) {
                            for ( i = 0; i < 5; i++) {
                                if ( $(`.c_${position_array_0[i]}`).hasClass(`side_zero`) ) {
                                    $(`.c_${position_array_0[i]}`).addClass(`grouped flag2 group_${k}`);
                                    $(`.c_${position_array_0[i]}`).removeClass(`side_zero`);
                                    $(`.c_${position}`).removeClass(`flag2`);
                                }
                                else if ( $(`.c_${position_array_0[i]}`).hasClass(`num`) ) {
                                    $(`.c_${position_array_0[i]}`).addClass(`grouped group_${k}`);
                                    $(`.c_${position}`).removeClass(`flag2`);
                                }

                                else {
                                    $(`.c_${position}`).removeClass(`flag2`);
                                }
                            }
                        }
                        else {
                            for ( i = 0; i < 5; i++) {
                                if ( $(`.c_${position_array_26[i]}`).hasClass(`side_zero`) ) {
                                    $(`.c_${position_array_26[i]}`).addClass(`grouped flag2 group_${k}`);
                                    $(`.c_${position_array_26[i]}`).removeClass(`side_zero`);
                                    $(`.c_${position}`).removeClass(`flag2`);
                                }
                                else if ( $(`.c_${position_array_26[i]}`).hasClass(`num`) ) {
                                    $(`.c_${position_array_26[i]}`).addClass(`grouped group_${k}`);
                                    $(`.c_${position}`).removeClass(`flag2`);
                                }

                                else {
                                    $(`.c_${position}`).removeClass(`flag2`);
                                }
                            }
                        }
                    }
                }
            }

        }
        // fix associated with the location of two groups at each other
        for ( i = 0; i < $(`.sapper_wrapp .normal_zero`).length; i++) {
            var class_position = $(`.sapper_wrapp .normal_zero:eq(${i})`).attr(`class`).split(` `)[2];
            var position = parseInt(class_position.replace(/\D+/g,""));
            var class_group = $(`.c_${position}`).attr(`class`).split(` `)[4];
            var group = parseInt(class_group.replace(/\D+/g,""));
            var left = position - 1;
            var right = position + 1;
            var top = position - wd;
            var bottom = position + wd;
            var top_left = position - wd - 1;
            var top_right = position - wd + 1;
            var bottom_rigth = position + wd + 1;
            var bottom_left = position + wd - 1;
            let position_array = [left, right, top, bottom, top_left, top_right, bottom_left, bottom_rigth]
            for ( z = 0; z < 8; z++) {
                if ( $(`.c_${position_array[z]}`).hasClass(`zero`) ) {
                    var class_group_2 = $(`.c_${position_array[z]}`).attr(`class`).split(` `);
                    class_group_2 = class_group_2[(class_group_2.length - 1)]
                    var group_2 = parseInt(class_group_2.replace(/\D+/g,""));
                    if ( group != group_2 ) {
                        var max = Math.max(group, group_2);
                        var min = Math.min(group, group_2);
                        $(`.sapper_wrapp .group_${min}`).addClass(`group_${max}`);
                        $(`.sapper_wrapp .group_${min}`).removeClass(`group_${min}`);
                    }
                }
            }
        }
        // creating groups with single zeros on the sides
        var k = 0;
        for ( i = 0; i < $(`.sapper_wrapp .grouped`).length; i++) {
            var class_groups = $(`.sapper_wrapp .grouped:eq(${i})`).attr(`class`).split(` `);
            class_groups = class_groups[(class_groups.length - 1)]
            var groups = parseInt(class_groups.replace(/\D+/g,""));
            if (groups > k) {
                k = groups;
            }
        }
        $(`.sapper_wrapp .side_zero`).addClass(`will_groupped`);
        while ( $(`.sapper_wrapp .will_groupped`).length > 0 ) {
            k += 1;
            var class_position = $(`.sapper_wrapp .will_groupped`).attr(`class`).split(` `)[2];
            var position = parseInt(class_position.replace(/\D+/g,""));
            $(`.${class_position}`).addClass(`flag grouped group_${k}`);
            for ( m = 0; m < 60; m++) {
                while ( 0 < $(`.sapper_wrapp .flag`).length ) {
                    var class_position = $(`.sapper_wrapp .flag:eq(${0})`).attr(`class`).split(` `)[2];
                    var position = parseInt(class_position.replace(/\D+/g,""));
                    var left = position - 1;
                    var right = position + 1;
                    var top = position - wd;
                    var bottom = position + wd;
                    var top_left = position - wd - 1;
                    var top_right = position - wd + 1;
                    var bottom_rigth = position + wd + 1;
                    var bottom_left = position + wd - 1;
                    let position_array_0 = [top, bottom, right, top_right, bottom_rigth]
                    let position_array_26 = [top, bottom, left, top_left, bottom_left]
                    if ( position % wd == 0 ) {
                        for ( i = 0; i < 5; i++) {
                            if ( $(`.c_${position_array_0[i]}`).hasClass(`will_groupped`) ) {
                                $(`.c_${position_array_0[i]}`).addClass(`flag grouped group_${k}`);
                                $(`.c_${position_array_0[i]}`).removeClass(`will_groupped `);
                                $(`.c_${position}`).removeClass(`will_groupped flag`);
                            }
                            else if ( $(`.c_${position_array_0[i]}`).hasClass(`num`) ) {
                                $(`.c_${position_array_0[i]}`).addClass(`grouped group_${k}`);
                                $(`.c_${position}`).removeClass(`will_groupped flag`);
                            }

                            else {
                                $(`.c_${position}`).removeClass(`will_groupped flag`);
                            }
                        }
                    }
                    else {
                        for ( i = 0; i < 5; i++) {
                            if ( $(`.c_${position_array_26[i]}`).hasClass(`will_groupped`) ) {
                                $(`.c_${position_array_26[i]}`).addClass(`flag grouped group_${k}`);
                                $(`.c_${position_array_26[i]}`).removeClass(`will_groupped`);
                                $(`.c_${position}`).removeClass(`will_groupped flag`);
                            }
                            else if ( $(`.c_${position_array_26[i]}`).hasClass(`num`) ) {
                                $(`.c_${position_array_26[i]}`).addClass(`grouped group_${k}`);
                                $(`.c_${position}`).removeClass(`will_groupped flag`);
                            }
                            else {
                                $(`.c_${position}`).removeClass(`will_groupped flag`);
                            }
                        }
                    }
                }
            }
        }
        $(`.sapper_wrapp .side_zero`).removeClass(`side_zero`);
        // highlighting the second largest group
        function start_zero() {
            var z = 0;
            for ( i = 0; i < $(`.sapper_wrapp .grouped`).length; i++) {
                var class_groups = $(`.sapper_wrapp .grouped:eq(${i})`).attr(`class`).split(` `);
                class_groups = class_groups[(class_groups.length - 1)]
                var groups = parseInt(class_groups.replace(/\D+/g,""));
                if (groups > z) {
                    z = groups;
                }
            }
            z += 1;
            var len_arr = [];
            for (i = 0; i < z; i++) {
                len_arr.push( $(`.sapper_wrapp .group_${i}.zero`).length )
            }
            len_arr.sort(function (a, b) {
                return b - a;
            });
            z-=1
            var second_size = len_arr[1]
            for (i = 0; i < z; i++) {
                if ( $(`.sapper_wrapp .group_${i}.zero`).length == second_size ) {
                    let num = Math.round(($(`.sapper_wrapp .group_${i}.zero`).length)/2);
                    $(`.sapper_wrapp .group_${i}.zero:eq(${num})`).css({'background': 'white'});
                    return;
                }
            }
        }
        start_zero();
///////////////////////////////////////////////////////////////////////////
        var text_array = [];
        for (k = 0; k < (wd*hg); k++) {
            let txt = $(".c_" + k).text();
            text_array.push(txt);
        }
        // well, click
        $(`.sapper_case`).click(function () {
            var class_position = $(this).attr(`class`).split(` `)[2];
            var position = parseInt(class_position.replace(/\D+/g,""));
            var main_class = $(this).attr(`class`).split(` `)[3];
            if ( main_class == `num` ) {
                $(this).empty();
                $(this).removeClass(`flag`)
                $(this).text( text_array[position] );
                $(this).addClass(`show`);
                win();
                update_remaining_bombs();
            }
            if ( main_class == `bomb` ) {
                defeat();
            }
            if ( main_class == `zero` ) {
                $(this).removeClass(`flag`);
                var class_group = $(this).attr(`class`).split(` `);
                class_group = class_group[(class_group.length - 1)];
                $(`.${class_group}`).empty();
                for ( i = 0; i < $(`.${class_group}`).length; i++) {
                    var class_position = $(`.${class_group}:eq(${i})`).attr(`class`).split(` `)[2];
                    var position = parseInt(class_position.replace(/\D+/g,""));
                    $(`.${class_group}:eq(${i})`).text(text_array[position]);
                    $(`.${class_group}:eq(${i})`).removeClass(`flag`);
                }
                $(`.${class_group}`).addClass('show');
                win();
                update_remaining_bombs();
            }
        });
        // flags RMB switch
        $('.sapper_case').mousedown( function(event){
            event.preventDefault();
            if (event.button == 2) {
                if ( (!$(this).hasClass("flag")) && (!$(this).hasClass("show")) ) {
                    $(this).text('');
                    $(this).append('<i class="fad fa-pennant"></i>');
                    $(this).addClass("flag")
                }
                else { $(this).removeClass("flag") }
                update_remaining_bombs();
                win();
            }
        });
///////////////////////////////////////////////////////////////////////////
        function win() {
            var c_all = $(`.show`).length + $(`.flag`).length;
            if (c_all == (wd*hg)) {
                $(".sapper_case").remove();
                $(".sapper_field").append('<div class="end_class"> Victory achieved. </div>');
                $('.left_bombs').text(``);
                $(".left_bombs").append('<i class="fal fa-empty-set"></i>');
            }
        }
        function defeat() {
            $(".sapper_case").remove();
            $(".sapper_field").append('<p class="end_class"> YOU DIED </p>');
            $('.left_bombs').text(``);
            $(".left_bombs").append('<i class="fal fa-empty-set"></i>');
        }
        function update_remaining_bombs() {
            let bomb_val = $('.sapper_wrapp .bomb').length - $('.sapper_wrapp .flag').length;
            if ( bomb_val > 0 ) {
                $(".left_bombs").empty();
                $('.left_bombs').text(bomb_val);
            }
            if ( bomb_val < 0 ) {
                $(".left_bombs").empty();
                $('.left_bombs').text(bomb_val + ", ты как из дурки сбежал");
            }
            if ( bomb_val == 0 ) {
                $('.left_bombs').text("");
                $(".left_bombs").append('<i class="fal fa-empty-set"></i>');
            }
        }

        // $(`.zero`).css({'background': `rgba(255,255,255,0.3)`});
        // $(`.group_0`).css({'background': `DarkSalmon`});
        // $(`.group_1`).css({'background': `PaleGreen`})
        // $(`.group_2`).css({'background': `Teal`})
        // $(`.group_3`).css({'background': `BlueViolet`})
        // $(`.group_4`).css({'background': `White`})
        // $(`.group_5`).css({'background': `Wheat`})
        // $(`.group_6`).css({'background': `DarkOrange`});
        // $(`.group_7`).css({'background': `Aqua`})
        // $(`.group_8`).css({'background': `Violet`})
        // $(`.group_9`).css({'background': `Yellow`})
        // $(`.group_10`).css({'background': `SlateGrey`})
        // $(`.group_11`).css({'background': `DarkRed`})
        $(`.sapper_case`).mousedown(function(event){
            event.preventDefault();
            if (event.button == 1) {
                console.log( `class: ` + $(this).attr(`class`));
                console.log( `bombs/flags: ` + $('.bomb').length + '/' +  $('.flag').length);
                console.log('showed: ' + $(`.show`).length);
            }
        });
    });

    // F11
    var win = require('electron').remote.getCurrentWindow();
    var count = 0;
    var width =  $( window ).width();
    var height = $( window ).height();
    var id = '';
    $('.sidebar li').click(function () {
        id = $(this).attr(`id`);
    });
    $(window).keydown(function (event) {
        if (id == 'sapper') {
            if (event.code == "F11") {
                if (count == 0) {
                    win.setBounds({ x: 0, y: 0, width: 1920, height: 1080 })
                    $(`body`).css({'zoom': '2'}),
                    $(`.header, .content_head`).css({'-webkit-app-region': 'no-drag'})
                    count = 1;
                }
                else {
                    let center_x = (1920 - width)/2;
                    let center_y = (1080 - height)/2;
                    win.setBounds({ x: center_x, y: center_y, width: width, height: height });
                    $(`body`).css({'zoom': '1'});
                    $(`.header, .content_head`).css({'-webkit-app-region': 'drag'})
                    count = 0;
                }
            }
        }
    });
    $(`.sidebar li`).click(function () {
        if (count == 1) {
            let center_x = (1920 - width)/2;
            let center_y = (1080 - height)/2;
            win.setBounds({ x: center_x, y: center_y, width: width, height: height });
            $(`body`).css({'zoom': '1'});
            $(`.header, .content_head`).css({'-webkit-app-region': 'drag'})
            count = 0;
        }
    });
});
