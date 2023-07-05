window.$ = window.jQuery = require("jquery");
$('document').ready(function() {
    const electron = require('electron');
    const win = electron.remote.getCurrentWindow();
    const { dialog } = electron.remote
    const { exec } = require('child_process')
    const { DownloaderHelper } = require('node-downloader-helper');
    const opn = require('opn');
    const fs = require('fs');
    let games_list = JSON.parse(games_json);
    let progs_list = JSON.parse(progs_json);
    let films_list = JSON.parse(films_json);
    let mults_list = JSON.parse(mults_json);
    let storage_one, storage_two;
    let trash;
    let id = '';

    function ActualConfig() {
        let config = fs.readFileSync(`${__dirname}\\code\\config.json`).toString();
        let elem;
            elem = config.split(`storage_one_json = `)[1];
            elem = elem.split('\n')[0];
            elem = elem.replace(/'/g, ``).replace(/;/g,'');
        storage_one = JSON.parse(elem)
            elem = config.split(`storage_two_json = `)[1];
            elem = elem.split('\n')[0];
            elem = elem.replace(/'/g, ``).replace(/;/g,'');
        storage_two = JSON.parse(elem)
    }
    function Recreate__Config() {
        ActualConfig();
        let list_array = [games_list, progs_list, films_list, mults_list, storage_one, storage_two]
        let json_array = [`games_json`, `progs_json`, `films_json`, `mults_json`, `storage_one_json`, `storage_two_json`];
        let line = '';
        for ( i = 0; i < list_array.length; i++) {
            line = line + `${json_array[i]} = '` + JSON.stringify(list_array[i]) + "';\n\n";
        }
        fs.writeFileSync(`${__dirname}\\code\\config.json`, line , (err) => {
            if (err) throw err;
        });
    }
    function Recreate__Games() {
        $('.games_wrapp ul').empty();
        for (let k = 0; k < games_list.length; k++) {
            $('.games_wrapp ul').append(`
                <li>
                    <a>${games_list[k].name}</a>
                    <div class="list_box">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </li>
            `);
            if (games_list[k].path != `#`) {
              $('.games_wrapp ul li').eq(k).append(`
                <div class="run launch">
                    Run
                </div>
              `);
            }
        }
    }
    function Recreate__Progs() {
        $('.progs_wrapp ul').empty();
        for (let k = 0; k < progs_list.length; k++) {
            $('.progs_wrapp ul').append(`
            <li>
                <a>${progs_list[k].name}</a>
                <div class="list_box">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </li>`);
            if (progs_list[k].path != `#`) {
              $('.progs_wrapp ul li').eq(k).append(`
                <div class="run launch">
                    Run
                </div>
              `);
            }
        }
    }
    function Recreate__Films() {
        $('.films_wrapp ul').empty();
        for (let k = 0; k < films_list.length; k++) {
            $('.films_wrapp ul').append(`
                <li>
                    <a>${films_list[k].name}</a>
                    <div class="list_box">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="run open_film">
                        Run
                    </div>
                </li>`);
            if (films_list[k].name.indexOf("***") > -1) {
                $(`.films_wrapp ul li:eq(${k})`).find(`.list_box`).remove();
                $(`.films_wrapp ul li:eq(${k})`).find(`.run`).remove();
                let replaced = films_list[k].name.replace(/[*]/g, '');
                $(`.films_wrapp ul li:eq(${k})`).find(`a`).text(replaced);
                $(`.films_wrapp ul li:eq(${k})`).addClass('category');
            }
        }
    }
    function Recreate__Mults() {
        $('.mults_wrapp ul').empty();
        for (let k = 0; k < mults_list.length; k++) {
            $('.mults_wrapp ul').append(`
                <li>
                    <a>${mults_list[k].name}</a>
                    <div class="list_box">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="run open_mult">
                        Run
                    </div>
                </li>`);
        }
    }
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
    function Delete__Veil() {
        $(`.veil`).hide();
        $(`.list_menu`).css({'display': 'none'});
        $(`.list_box`).css({'border': '1px solid rgba(122,122,122,0.3)'});
        $(`.list_box.box_borderless`).removeClass(`box_borderless`);
        $(`.list_menu.menu_borderless`).removeClass(`menu_borderless`);
    }

    $('.sidebar li').click(function () {
        id = $(this).attr(`id`);
    });
    ActualConfig();
    Recreate__Games();
    Recreate__Progs();
    Recreate__Films();
    Recreate__Mults();

////////////////////////////////////////////////////////////////////////////////
// conf_win
    let position_array = [];
    let position;
    $(`.config_window`).on('click', 'button.btn_add', function() {
        let name = $(`.inp_name`).val();
        let path = $(`.inp_path`).val();
            path = path.replace(/\\/g, '/');
        let dl_link = $(`.inp_dl_link`).val();
        let link = $(`.inp_link`).val();
        if ( name == '' ) { name = '#' }
        if ( path == '' ) { path = '#' }
        if ( dl_link == '' ) { dl_link = '#' }
        if ( link == '' ) { link = '#' }
        if ((id == `games`) || (id == `progs`)) {
            let new_elem = { name : `${name}`, path: `${path}`, dl_link : `${dl_link}` }
            eval(`${id}_list`).splice(0, 0, new_elem);
            let new_li = `
            <li>
                <a>${name}</a>
                <div class="list_box">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="run launch">
                    Run
                </div>
            </li>`
            $(`.${id}_wrapp li`).eq(0).before(new_li);
        }
        if ((id == `films`) || (id == `mults`)) {
            name = name.replace(/\(/g, '[').replace(/\)/g, ']');
            let new_elem = { name : `${name}`, link : `${link}` }
            eval(`${id}_list`).splice(0, 0, new_elem);
            let fixed_id = id.replace('s', '');
            let new_li = `
            <li>
                <a>${name}</a>
                <div class="list_box">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="run open_${fixed_id}">
                    Run
                </div>
            </li>`;
            $(`.${id}_wrapp li`).eq(0).before(new_li);
        }
        Recreate__Config();
        $('.config_window').css({'top': '-1000px', 'opacity': '0'});
    });
    $(`.config_window`).on('click', 'button.btn_edit', function() {
        let name = $(`.inp_name`).val();
        let path = $(`.inp_path`).val().replace(/\\/g, '/');
        let dl_link = $(`.inp_dl_link`).val().replace(/\s/g, '');
        let link = $(`.inp_link`).val();
        if ( name == '' ) { name = '#' }
        if ( path == '' ) { path = '#' }
        if ( dl_link == '' ) { dl_link = '#' }
        if ( link == '' ) { link = '#' }
        if ((id == `games`) || (id == `progs`)) {
            eval(`${id}_list`)[position].name = name;
            eval(`${id}_list`)[position].path = path;
            eval(`${id}_list`)[position].dl_link = dl_link;
            $(`.${id}_wrapp li a`).eq(position).text(name);
        }
        if ((id == `films`) || (id == `mults`)) {
            eval(`${id}_list`)[position].name = name;
            eval(`${id}_list`)[position].link = link;
            $(`.${id}_wrapp li a`).eq(position).text(name);
        }
        Recreate__Config();
        $('.config_window').css({'top': '-1000px', 'opacity': '0'});
    });
    $(`.config_window`).on('click', 'button.btn_cancel', function() {
        $('.config_window').css({'top': '-1000px', 'opacity': '0'});
    });
    $(`.config_window`).on('click', 'span', function () {
        let elem = $(this).closest('div');
        if ((elem.hasClass(`form_login`)) || (elem.hasClass(`form_pass`))) {
            let to_copy = elem.find('input').val();
            navigator.clipboard.writeText(to_copy);
        }
        else if (elem.hasClass(`form_path`)) {
            let input_val = elem.find('input').val();
            let defPath;
            input_val.match(/^[A-Z]{1}:\//) != null ?
                defPath = input_val.replace(/\//, '\\') :
                defPath = `C:\\`
            console.log(defPath);
            win.hide()
            let path = dialog.showOpenDialogSync({
                title: 'hmmmmm',
                defaultPath: defPath,
                filters: [
                    { name: 'Files', extensions: ['exe'] }
                ],
                properties: [`openFile`]
            });
            win.show()
            if (path != undefined) {
                path = path[0].replace(/\\/g, '/');
                elem.find('input').val(path)
            }
        }
        else {
            elem.find('input').val(``)
        }
    });
////////////////////////////////////////////////////////////////////////////////
// list_menu
    let index;
    $(`body`).on("click", ".list_box", function(e) {
        $(`.veil`).show();
        let elems = $(`.list_menu .open_folder, .list_menu .download`);
        if (id == `films` || id == `mults`) {
            elems.css({'display':'none'})
        }
        else {
            elems.css({'display':'flex'})
        }
        //////////////////////////////
        index = $(this).closest(`li`).index();
        $(this).addClass('box_borderless');
        $(`.list_menu`).addClass('menu_borderless');
        let y = $(this).offset().top;
        let padding = $(this).outerHeight();
        let menu_height = $(`.list_menu`).outerHeight() + (35 * $(`.list_menu div:visible`).length);

        let content_height = $(`.content`).outerHeight()
        if (content_height - 10 < y + menu_height) {
            $(`.list_menu`).css({'display': 'block', 'top': y - menu_height + 1});
        }
        else {
            $(`.list_menu`).css({'display': 'block', 'top': y + padding - 0.5});
        }
        let this_elem = document.getElementsByClassName(`${id}_wrapp`)[0];
        let this_ui = this_elem.getElementsByClassName(`ui-sortable`)[0];
        console.log(this_ui.offsetHeight); 
        if ( $(`.wrappers`).outerHeight() >= this_ui.offsetHeight) {
            $(`.list_menu`).css({'right': '19px'});
        }
        else {
            $(`.list_menu`).css({'right': '27px'});
        }
        //////////////
        let dl_link = eval(`${id}_list`)[index].dl_link;
        if (dl_link == `#`) {
            $(`.list_menu .download`).addClass('blocked')
        }
        else {
            $(`.list_menu .download`).removeClass('blocked')
        }
        //////////////

    });
    $(`body`).on("click", ".list_menu, .veil", function(e) {
        if (e.target.className != 'download blocked') {
            Delete__Veil()
        }
    });
// list_menu btn
    $('.content').on('click', '.launch', function () {
        index = $(this).closest(`li`).index();
        let cmd_line = `@start "" "${eval(`${id}_list`)[index].path}" %*`;
        let cwd = eval(`${id}_list`)[index].path.split(`/`);
          cwd.pop();
          cwd = cwd.join(`/`);
        exec(cmd_line, {cwd: cwd});
    });
    $('.content').on('click', '.open_film', function () {
        index = $(this).closest(`li`).index();
        opn(films_list[index].link);
    });
    $('.content').on('click', '.open_mult', function () {
        index = $(this).closest(`li`).index();
        opn(mults_list[index].link);
    });

    $('.list_menu').on('click', '.open_folder', function () {
        let folder_path = eval(`${id}_list`)[index].path;
          folder_path = folder_path.split('/');
          folder_path.pop();
          folder_path = folder_path.join('/');
        exec(`@start "" "${folder_path}" %*`, { cwd: folder_path });
    });
    $('.list_menu').on('click', '.download:not(.blocked)', function () {
        // document.location.href = eval(`${id}_list`)[index].dl_link
        win.hide();
        let dl_link = eval(`${id}_list`)[index].dl_link;
        let path = dialog.showOpenDialogSync({
            title: 'hmmmmm',
            defaultPath: 'C:\\',
            properties: [`openDirectory`]
        });
        win.show();
        if (path != undefined) {
            let load = new DownloaderHelper(dl_link, path[0]);
            load.on(`error`, function (callback) {
                eval(`${id}_list`)[index].dl_link = `#`;
                Recreate__Config();
                alert('Invalid download link!');
                return;
            })
            load.on(`timeout`, function (callback) {
                console.log('t');
            })
            load.start();
        }
    });
    $('.list_menu').on('click', '.edit', function() {
        ShowConfigWindow();
        $(`.btn_add`).css({"display": "none"});
        $(`.btn_edit`).css({"display": "block"});
        position = index;
        if ( id == 'games' ) {
            $(`.inp_name`).val(games_list[index].name);
            $(`.inp_path`).val(games_list[index].path);
            $(`.inp_dl_link`).val(games_list[index].dl_link);
        }
        if ( id == 'progs' ) {
            $(`.inp_name`).val(progs_list[index].name);
            $(`.inp_path`).val(progs_list[index].path);
            $(`.inp_dl_link`).val(progs_list[index].dl_link);
        }
        if ( id == 'films' ) {
            $(`.inp_name`).val(films_list[index].name);
            $(`.inp_link`).val(films_list[index].link);
        }
        if ( id == 'mults' ) {
            $(`.inp_name`).val(mults_list[index].name);
            $(`.inp_link`).val(mults_list[index].link);
        }
    });
    $('.list_menu').on('click', '.remove', function() {
        eval(`${id}_list`).splice(index, 1);
        $(`.${id}_wrapp li`).eq(index).remove();
        Delete__Veil();
        Recreate__Config();
    });
////////////////////////////////////////////////////////////////////////////////
// sortable
let ids_arr = [`games`, `progs`, `films`, `mults`];
let start_index = '';
    for (i = 0; i < ids_arr.length; i++) {
        let id = ids_arr[i];
        $(`.${id}_wrapp ul`).sortable({
            revert: 300,
            axis: "y",
            iframeFix: true,
            distance: 20,
            containment: $(`.${id}_wrapp ul`),
            tolerance:"pointer",
            cursorAt:{ left:5, top: 30 },
            start: function(event, ui) {
                $(`.${id}_wrapp`).on('wheel', function(e){
                    let currentScrollTop = $(`.${id}_wrapp`).scrollTop();
                    let wheel = e.originalEvent.wheelDelta;
                    let delta;
                    id == (`games`||`progs`) ?  delta = 90 : delta = 400
                    if (wheel < 0) {
                        $(`.${id}_wrapp`).scrollTop(currentScrollTop + delta);
                    }
                    if (wheel > 0) {
                        $(`.${id}_wrapp`).scrollTop(currentScrollTop - delta);
                    }
                });
                let interval = setInterval(function () {
                    let currentScrollTop = $(`.${id}_wrapp`).scrollTop();
                    let elem = document.getElementsByClassName('ui-sortable-helper')[0];
                    if (elem != `undefined`) {
                        let get = elem.getBoundingClientRect()
                        let top = get.top
                        if ( top > 480 ) {
                            $(`.${id}_wrapp`).scrollTop(currentScrollTop + 8);
                        }
                        if ( top < 80 ) {
                            $(`.${id}_wrapp`).scrollTop(currentScrollTop - 8);
                        }
                    }
                }, 10);
                $(window).mouseup(function () {
                    clearInterval(interval);
                    $(window).off('mouseup');
                    $(`.${id}_wrapp`).off('wheel')
                });
                start_index =  ui.item.index();
            },
            beforeStop: function(event, ui) {
                let clone_array = [];
                let list = eval(`${id}_list`);
                let end_index = ui.item.index();
                let elem = list[start_index];
                list.splice(start_index, 1);
                list.splice(end_index, 0, elem);
                Recreate__Config();
            }
        });

    }
});
