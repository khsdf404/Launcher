window.$ = window.jQuery = require("jquery");
$('document').ready(function() {
    const electron = require('electron');
    const win = electron.remote.getCurrentWindow();
    const fs = require('fs');


    let all_wrapps = '';
    all_wrapps += `.greeting`;
    for (i = 1; i < $(`.sidebar ul li`).length-1; i++) {
        all_wrapps += `, .`;
        all_wrapps += $(`.sidebar ul li`).eq(i).attr('id');
        all_wrapps += `_wrapp`;
    }
    let all_footers = '';
    for (i = 0; i < $(`.sidebar .footer`).children(`div`).length; i++) {
        let classe = $(`.sidebar .footer`).children(`div`).eq(i).attr('class');
        let class_arr = classe.split(` `);
        for (k = 0; k < class_arr.length; k++) {
            all_footers += `.` + class_arr[k] + `, `;
        }
    }
    all_footers = all_footers.split(``);
    all_footers.pop(); all_footers.pop();
    all_footers = all_footers.join(``);

    let id = ''; let old_id = 'greeting'; let _index = -1;
    function Sidebar_CSS() {
        setTimeout(function() {
            $(".greeting").css({'opacity': "1"});
        }, 100);
        setTimeout(function() {
            $(".sidebar").css({'opacity': "1"});
        }, 600);
        let listHeight = $('.sidebar ul').height();
        $(`.sidebar li`).css({'height': ((listHeight)/8)});
        $(`.sidebar li i `).css({'margin-right': '12px', 'font-size': '26px'});
        function MouseOverSidebar() {
            $('.sidebar').on('mouseover', function() {
                $('.sidebar').off(`mouseover`);
                $( `.sidebar` ).animate({'min-width': '212px' }, 200, function () {
                    MouseOverSidebar();
                });
                $(`.sidebar li`).css({'height': ((listHeight)/7)});
                $(`.sidebar li i`).css({'margin-right': '6px', 'font-size': '18px'});
            });
        }
        function MouseLeaveSidebar() {
            $('.sidebar').on('mouseleave', function() {
                $('.sidebar').off(`mouseleave`);
                $( `.sidebar` ).animate( { 'min-width': '61px' }, 200, function () {
                    MouseLeaveSidebar();
                });
                $(`.sidebar li`).css({'height': ((listHeight)/8)});
                $(`.sidebar li i `).css({'margin-right': '12px', 'font-size': '26px'});
                $(`.sidebar ul`).scrollTop(0);
            });
        }
        MouseOverSidebar();
        MouseLeaveSidebar();
    }
    function Sidebar_List() {
        $('.sidebar ul li').click(function () {
            id = $(this).attr(`id`);
            if (id != 'close') {
                $(`.wrappers`).children().not(`.${id}_wrapp, .${old_id}_wrapp`).css({'opacity': '0'});
                old_id = id;
                $(`.${id}_wrapp`).scrollTop(0);
                console.log(id);
                if (!$(`.${id}_wrapp`).hasClass('was_showed_by_sidebar')) {
                    $(`.wrappers`).animate({
                        scrollTop: 455 * $(this).index()
                     }, 600, function () {
                          $(`.wrappers`).children().css({'opacity': '1', 'transition': '0s opacity'});
                     });
                    setTimeout(function () {
                        $(all_footers).css({"display": "none"});
                        $(`.${id}_footer`).css({'display': 'flex'});
                        $(all_wrapps).scrollTop(0);
                        if (id != 'sapper') {
                            $(".sapper_case").remove();
                            $(".end_class").remove();
                            $(`.left_bombs`).text(``);
                        }
                    }, 100);
                    $(all_wrapps).removeClass('was_showed_by_sidebar');
                    $(`.${id}_wrapp`).addClass('was_showed_by_sidebar');
                }
            }
            _index = $(this).index();
        });
        $(`#close`).click(function () {
            win.close();
        });
    }
    function Sidebar_Footer() {
        function List() {
            function ShowConfigWindow() {
            $('.config_window input').val('');
            $('.config_window').css({'top': '0', 'opacity': '1'});
            let all_btn = $('.buttons button');
                all_btn.css({"display": "none"});
            $(`.btn_cancel`).css({"display": "block"});
            let all_inp = $('.inputs div');
                all_inp.hide();
            if ((id == `games`) ||  (id == `progs`)) {
                $(`.btn_add`).css({"display": "block"});
                $('.form_name, .form_path, .form_dlink').show();
                id == `games` ?
                    $(`.inp_path`).val('D:/Games/') :
                    $(`.inp_path`).val('D:/Programs/');
            }
            if ((id == `films`) ||  (id == `mults`)) {
                $(`.btn_add`).css({"display": "block"});
                $('.form_name, .form_link').show();
            }
            if (id == `pass`) {
                $(`.btn_pass_add`).css({"display": "block"});
                $('.form_name, .form_login, .form_pass, .form_key').show();
            }
        }
            $('.footer .add').click(function () {
                ShowConfigWindow();
            });
        }
        function Passwords() {
            $(`.sidebar .non_blur`).click(function () {
                $(`.p_login`).hasClass('blur') ?
                    $(this).removeClass().addClass(`fad fa-eye non_blur`) :
                    $(this).removeClass().addClass(`fad fa-eye-slash non_blur`);
                $(`.p_login, .p_password`).toggleClass('blur');
            });
        }
        function Cards() {
            let cards_sw = 1;
            $(".cards_redo").click(function() {
                $(".cards_wrapp ul li").css({ "opacity": "1" });
            });
            $(".switch_cards").click(function () {
                if ( cards_sw == 0 ) {
                    $(".hide_cards").css({"display":"none"});
                    $(".cards_wrapp ul").css({ "height": "380px" });
                    $(".cards_wrapp ul li").css({ "padding": "6.7px 0" });
                    $(".new_fc").css({ "padding-top": "12px" });
                    $(".switch_cards").text("54");
                    cards_sw = 1;
                }
                else {
                    $(".hide_cards").css({"display":"flex"});
                    $(".cards_wrapp ul").css({ "height": "420" });
                    $(".cards_wrapp ul li").css({ "padding": "0.7px 0" });
                    $(".new_fc").css({ "padding-top": "0px" });
                    $(".switch_cards").text("36");
                    cards_sw = 0;
                }
                $(".cards_wrapp ul li").css({ "opacity": "1" });
            });
        }
        List();
        Passwords()
        Cards();
    }

    Sidebar_CSS();
    Sidebar_List();
    Sidebar_Footer();
});
