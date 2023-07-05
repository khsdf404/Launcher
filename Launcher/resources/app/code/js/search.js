window.$ = window.jQuery = require("jquery");
$('document').ready(function() {
    const electron = require('electron');
    const win = electron.remote.getCurrentWindow();
    const fs = require('fs');
    let trash;
    let id = '';
        $('.sidebar li').click(function () {
            id = $(this).attr(`id`);
        });
    let lis_arr = [];
    function Search() {
        $('.content').on('input', '#search', function () {
            k = 0;
            RemoveMark();
            let li = $(`.${id}_wrapp ul li`);
            let value = $('.search_input').val().toUpperCase();
            lis_arr = [];
            for (let i = 0; i < li.length; i++) {
                let text = li.find(`a`).eq(i).text().toUpperCase();
                if ( text.indexOf(value) > -1 ) {
                    let name = li.eq(i).find(`a`).text();
                    if (id == 'films') {
                        name = name.replace(/[*]/g, '');
                    }
                    let parts = name.toUpperCase().split(value);
                    while (parts.length > 2) {
                        let new_len = parts.length - 1;
                        let new_str = parts[new_len-1] + value + parts[new_len]
                        parts.pop();
                        parts.pop();
                        parts.push(new_str);
                    }
                    let left_part;
                    let right_part;
                    let val;
                    if ( parts[0].length > 0 ) {
                        // AAA_VALUE_BBB → AAA_
                        left_part = name.split('').slice(0, (parts[0].length)).join('');
                    }
                    else { left_part = ''}
                    if ( parts[1].length > 0 ) {
                        // AAA_VALUE_BBB → _BBB
                        right_part = name.split('').slice(parts[0].length + value.length).join('');
                    }
                    else { right_part = ''}
                    val = name.split('').slice(parts[0].length, (parts[0].length+value.length)).join('');

                    let string = left_part + '<mark>' + val  + '</mark>' + right_part;
                    li.find(`a`).eq(i).empty();
                    li.find(`a`).eq(i).append( string );
                    lis_arr.push(i)
                }
            }
            let scroll = li.eq(0).outerHeight() * lis_arr[0];
            $(`.${id}_wrapp`).animate({scrollTop:scroll}, 300);
            if (lis_arr.length == 0) {
                $(`.search_info`).text(`0/0`)
            }
            else {
                $(`.search_info`).text(`1/${lis_arr.length}`);
                $(`.${id}_wrapp`).find(`li`).eq(lis_arr[0]).find(`mark`).css({'background': 'rgba(249, 167, 197, 0.91)'});
            }
        });
    }
    function ShortCuts() {
        $(window).keydown(function (e) {
            if ((id == 'games') || (id == 'progs') || (id == 'films') || (id == 'mults')) {
                if (e.ctrlKey && e.code == `KeyF`) {
                    $(`.${id}_wrapp`).css({'display': 'block'});
                    $(`.${id}_wrapp`).append(`
                        <div class="search_wrapp">
                            <div class="input_header">Поиск по div'y<i class="fal fa-times"></i></div>
                            <div class="input_wrapp">
                                <input class="search_input" id="search" type="text" placeholder="Word?">
                                <div class="search_info">0/0</div>
                                <div class="arrow_up"><i class="fal fa-chevron-up"></i></div>
                                <div class="arrow_down"><i class="fal fa-chevron-down"></i></div>
                            </div>

                        </div>`
                    );
                    $(`.${id}_wrapp input`).focus();
                }
                if (e.key == `ArrowDown`) {
                    NextMark();
                }
                if (e.key == `ArrowUp`) {
                    PreviousMark();
                }
            }
        });
    }
    function Draggable() {
        $('.content').on('mouseenter', '.search_wrapp', function () {
            $(`.search_wrapp`).draggable({
                axis: "x",
                iframeFix:true,
                containment: `.${id}_wrapp`,
                start: function(e, ui) {
                    setTimeout(function () {
                        let interval = setInterval(function () {
                            let currentScrollTop = $(`.${id}_wrapp`).scrollTop();
                            let elem = document.getElementsByClassName('ui-draggable')[0];
                            let get = elem.getBoundingClientRect();
                            let top = get.top
                            if ( top > 440 ) {
                                $(`.${id}_wrapp`).scrollTop(currentScrollTop + 15);
                            }
                            if ( top < 80 ) {
                                $(`.${id}_wrapp`).scrollTop(currentScrollTop - 15);
                            }
                            $(window).mouseup(function () {
                                clearInterval(interval)
                            });
                        }, 10)
                    }, 10)
                }
            });
        })
    }
    function RemoveSearch() {
        $('body').on('click', '.sidebar li, .input_header i, .list ul', function () {
            if ((id == 'games') || (id == 'progs') || (id == 'films') || (id == 'mults')) {
                RemoveMark();
            }
            $(`.search_wrapp`).remove();
        });
    }
    let k = 0;
    function NextMark() {
        k += 1;
        let i = k % lis_arr.length;
        let outerHeight = $(`.games_wrapp li`).outerHeight();
        let scroll = outerHeight * lis_arr[i];
        $(`.${id}_wrapp`).find(`mark`).css({'background': 'rgba(160, 211, 247, 0.7)'});
        $(`.${id}_wrapp`).find(`li`).eq(lis_arr[i]).find(`mark`).css({'background': 'rgba(249, 167, 197, 0.91)'});
        $(`.${id}_wrapp`).animate({scrollTop: scroll}, 300);
        lis_arr.length == 0 ?
            $(`.search_info`).text(`0/0`) :
            $(`.search_info`).text(`${i+1}/${lis_arr.length}`);
    }
    function PreviousMark() {
        k <= 0 ? k = lis_arr.length : trash = 1;
        k -= 1;
        let i = k % lis_arr.length;
        let outerHeight = $(`.games_wrapp li`).outerHeight();
        let scroll = outerHeight * lis_arr[i];
        $(`.${id}_wrapp`).animate({scrollTop:scroll}, 300);
        $(`.${id}_wrapp`).find(`mark`).css({'background': 'rgba(160, 211, 247, 0.7)'});
        $(`.${id}_wrapp`).find(`li`).eq(lis_arr[i]).find(`mark`).css({'background': 'rgba(249, 167, 197, 0.91)'});
        lis_arr.length == 0 ?
        $(`.search_info`).text(`0/0`) : $(`.search_info`).text(`${i+1}/${lis_arr.length}`)
    }
    function Arrows() {
        $('.content').on('click', '.arrow_up', function () {
            PreviousMark();
        });
        $('.content').on('click', '.arrow_down', function () {
            NextMark();
        });
    }
    function RemoveMark() {
        for (let i = 0; i < $(`.${id}_wrapp ul li`).length; i++) {
            let text = $(`.${id}_wrapp ul li a:eq(${i})`).text();
            text = text.replace('<mark>', '');
            text = text.replace('</mark>', '');
            $(`.${id}_wrapp ul li a:eq(${i})`).empty();
            $(`.${id}_wrapp ul li a:eq(${i})`).text(text);
        }
    }

    Search();
    ShortCuts();
    Draggable();
    RemoveSearch();
    Arrows();
    $('.content').on('click', function (e) {
        if ( e.target.className != `search_input`) {
            $(`.search_input`).blur();
        }
        else {
            RemoveMark();
            $(`.search_info`).text(`0/0`);
            $('.search_input').val("");
        }
    });
});
