window.$ = window.jQuery = require("jquery");
$('document').ready(function() {
    const electron = require('electron');
    const win = electron.remote.getCurrentWindow();
    let storage_one = JSON.parse(storage_one_json);
    let storage_two = JSON.parse(storage_two_json);
    let fs = require('fs');
    let trash;
    let id = '';
        $('.sidebar li').click(function () {
            id = $(this).attr(`id`);
        });
    // .shuffleLetters( { "text": answer } );
    let games_list, progs_list, films_list, mults_list;
    function RecreatePass() {
        $(`.pass_wrapp .column1`).empty();
        $(`.pass_wrapp .column2`).empty();
        for (i = 0; i < storage_one.length; i++) {
            $('.pass_wrapp .column1').append(`
                <div class="p_case">
                    <div class="p_name"> <a>${storage_one[i].name}</a> <i class="fas fa-pen pass_edit"></i></div>
                    <div class="p_login">Login</div>
                    <div class="p_password">Password</div>
                </div>
            `);
        }
        for (i = 0; i < storage_two.length; i++) {
            $('.pass_wrapp .column2').append(`
                <div class="p_case">
                    <div class="p_name"><a>${storage_two[i].name}</a><i class="fas fa-pen pass_edit"></i></div>
                    <div class="p_login">Login</div>
                    <div class="p_password">Password</div>
                </div>
            `);
        }
    }

    function ActualConfig() {
        let config = fs.readFileSync(`${__dirname}\\code\\config.json`).toString();
        let elem;
            elem = config.split(`games_json = `)[1];
            elem = elem.split('\n')[0];
            elem = elem.replace(/'/g, ``).replace(/;/g,'');
        games_list = JSON.parse(elem)
            elem = config.split(`progs_json = `)[1];
            elem = elem.split('\n')[0];
            elem = elem.replace(/'/g, ``).replace(/;/g,'');
        progs_list = JSON.parse(elem)
            elem = config.split(`films_json = `)[1];
            elem = elem.split('\n')[0];
            elem = elem.replace(/'/g, ``).replace(/;/g,'');
        films_list = JSON.parse(elem)
            elem = config.split(`mults_json = `)[1];
            elem = elem.split('\n')[0];
            elem = elem.replace(/'/g, ``).replace(/;/g,'');
        mults_list = JSON.parse(elem)
    }
    function Recreate__Config() {
        ActualConfig()
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

    function Encrypt(column, storage, type) {
        for (u=0; u < storage.length; u++) {
            // ↓ creating array of binary key's letters (already 8 bit) ↓
            let key = $(`#pass_input`).val();
            let key_arr = new Array();
            for (i=0; i < key.length; i++) {
                let key_split = key.split('');
                let key_letters = key_split[i].charCodeAt(0).toString(2);
                if (key_letters.length == 7)
                    { key_letters = "0" + key_letters; }
                else
                    { key_letters = "0" + "0" + key_letters; }
                key_arr.push( key_letters );
            }
            //  creating array of binary cipher's letters (already 8 bit)
            let cipher = eval('storage[u].' + type)
            let cipher_arr = new Array();
            for (i=0; i < (cipher.length/8); i++) {
                let cipher_split = cipher.split(' ');
                let cipher_binary_letters = cipher_split[i];
                cipher_arr.push( cipher_binary_letters );
            }
            cipher_arr.pop();   //  trash, idk why the last element appears
            //  changing kay's array size (now kay_array.length = cipher_arr.length )
            let length_cipher = cipher_arr.length
            let length_key = key_arr.length
            let length_key_const = key_arr.length
            if (length_key < length_cipher) { // more
                for (length_key; length_key < length_cipher; length_key++) {
                    let need = length_key - length_key_const;
                    key_arr.push(key_arr[need])
                }
            }
            else if (length_key > length_cipher) {  // less
                for (length_key; length_key > length_cipher; length_key--)
                    { key_arr.pop(); }
            }
            //  creating array with symbols of key's & cipher's letters
            let symbols_cipher_arr = new Array();
            let symbols_key_arr = new Array();
            let binary_answer_array = new Array();
            for (i=0; i < cipher_arr.length; i++) {
                let letter_cipher = String(cipher_arr[i]);
                let symbol_cipher = letter_cipher.split('');
                for (k=0; k < symbol_cipher.length; k++)
                    { symbols_cipher_arr.push(symbol_cipher[k]); }
                let letter_key = String(key_arr[i]);
                let symbol_key = letter_key.split('');
                for (m=0; m < symbol_key.length; m++)
                    { symbols_key_arr.push(symbol_key[m]); }
            }
            //  getting the array of answers
            for (i=0; i < symbols_key_arr.length; i++) {
                let answer_symbol =  symbols_cipher_arr[i] - symbols_key_arr[i];
                if  (answer_symbol == -1)
                    { answer_symbol = 1; }
                let str = String(answer_symbol);
                binary_answer_array.push(str);
            }
            //  making string from array of answers
            let binary_answer = "";
            for (i=0;  i < binary_answer_array.length;  i++)
                { binary_answer = binary_answer_array[i] + binary_answer; }
            //  reverse and fix "NaN"
            let reversed =  binary_answer.split("").reverse().join("");
            let fixed = reversed.split("");
            for (i=0; i < fixed.length; i++) {
                if ( (fixed[i] == "N") || (fixed[i] == "a") )
                    { fixed.splice(i, i); }
            }
            fixed = fixed.join("");
            //  conversion binary string in normal word
            let answer = '';
            for (i=0; i < (fixed.length/8); i++) {
                let perem = fixed.substr(i*8,8);
                perem = parseInt(perem,2);
                answer += String.fromCharCode(perem);
            }
            // хуй знает зачем эти let но без них не работает
            let n = column;
            let o = $(`.pass_wrapp .column${n}`);
            let z =  $(`.pass_wrapp .column${column}`).find(`.p_case`).find(`.p_login`);
            if (type == 'login') {
                $(`.pass_wrapp .column${column}`).find(`.p_case`).eq(u).find(`.p_login`).text(answer);
                $(`.pass_wrapp .column${column}`).find(`.p_case`).eq(u).find(`.p_login`);
            }
            else {
                $(`.pass_wrapp .column${column}`).find(`.p_case`).eq(u).find(`.p_password`).text( answer);
                $(`.pass_wrapp .column${column}`).find(`.p_case`).eq(u).find(`.p_password`);
            }
        }

    }
    function Decrypt(word, key) {
        let word_binar = new Array();
        for (i=0; i < word.length; i++) {
            var word_split = word.split('');
            var words_numbers = Number.parseInt(word_split[i].charCodeAt(0).toString(2)); // letters to binary code ASCII
            word_binar.push( words_numbers );
        }
        // ↓ creating a binary key ↓
        let key_binar = new Array();
        for (i=0; i < key.length; i++) {
            var key_split = key.split('');
            var keys_numbers = Number.parseInt(key_split[i].charCodeAt(0).toString(2));  // letters to binary code ASCII
            key_binar.push( keys_numbers );
        }
        // ↓ key.length == word.length ↓
        var length_word = word_binar.length;
        var length_key = key_binar.length;
        var length_const = key_binar.length;

        if (length_key < length_word) {
            for (length_key; length_key < length_word; length_key++) {
                var add = length_key - length_const;
                key_binar.push(key_binar[add])
            }
        }
        else if (length_key > length_word) {
            for (length_key; length_key > length_word; length_key--)
                { key_binar.pop(); }
        }
        // ↓ binary answer array ↓
        let array_code = new Array();
        for (i=0; i < word_binar.length; i++) {
            var summ = word_binar[i] + key_binar[i]
            array_code.push( summ );
        }
        let normal_cipher = array_code.join(',').replace(/2/g, '0').replace(/,/g, ' 0');
        normal_ans = (0 + normal_cipher);
        return normal_ans;
    }
    function Shuffle() {
        for (i = 0; i < $(`.column1 a`).length; i++) {
            $(`.column1 a`).eq(i).shuffleLetters( { "text": $(`.column1 a`).eq(i).text() } );
        }
        for (i = 0; i < $(`.column2 a`).length; i++) {
            $(`.column2 a`).eq(i).shuffleLetters({ "text": $(`.column2 a`).eq(i).text() });
        }
    }
    function PassInput() {
        $('#pass_input').click( function() {
            $('#pass_input').val("");
            this.type = 'password';
            $(this).keyup(function (e) {
                if (e.keyCode == 13) {
                    Encrypt(1, storage_one, `login`);
                    Encrypt(1, storage_one, `password`);
                    Encrypt(2, storage_two, `login`);
                    Encrypt(2, storage_two, `password`);
                    Shuffle();
                }
                let en_val = $('#pass_input').val().replace(/[а-яА-Я]/g, "");
                $('#pass_input').val(en_val);
            });
        });
    }

    function Show__LoginPass() {
        $(`.pass_wrapp`).on('click', '.p_case', function (e) {
            if ((e.target.className != `fas fa-pen pass_edit`) &&
                (e.target.className != `p_login`) &&
                (e.target.className != `p_login blur`) &&
                (e.target.className != `p_password blur`) &&
                (e.target.className != `p_password`)) {
                let hasClass = $(this).hasClass('pass_active')
                $('.p_case').removeClass('pass_active');
                $('.p_case').find('.p_login, .p_password').css({"opacity": "0"});
                if (!hasClass) {
                    $(this).addClass(`pass_active`);
                    $(this).find('.p_login, .p_password').css({"opacity": "1"});
                }
                else {
                  $(this).removeClass(`pass_active`);
                  $(this).find('.p_login, .p_password').css({"opacity": "0"});
                }
            }
        });
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
    function EditPassword() {
        let column;
        let storage;
        let isEmpty;
        let pass_position;
        $(`.pass_wrapp`).on('click', '.pass_edit', function () {
            ShowConfigWindow();
            $(`.btn_pass_add`).css({"display": "none"});
            $(`.btn_pass_edit`).css({'display':'block'});
            column = $(this).closest(`.column`).attr(`class`).split(` `)[1];
            column == 'column1' ? storage = storage_one : storage = storage_two;
            let index = $(this).closest(`.p_case`).index();
            pass_position = index;
            $(`.inp_name`).val(storage[index].name);
            $(`.inp_login`).val( $(this).closest(`.p_case`).find(`.p_login`).text() );
            $(`.inp_pass`).val( $(this).closest(`.p_case`).find(`.p_password`).text() );
            $(`.inp_key`).val( $('#pass_input').val() );
        });
        $(`body`).on('click', '.btn_pass_edit', function () {
            let name = $(`.inp_name`).val().replace(/\s/g, '');
            let login = $(`.inp_login`).val().replace(/\s/g, '');
            let password = $(`.inp_pass`).val().replace(/\s/g, '');
            let key = $(`.inp_key`).val().replace(/\s/g, '');
            name != '' ?
                storage[pass_position].name = name :
                storage[pass_position].name = storage[pass_position].name;
            login != '' ?
                storage[pass_position].login = Decrypt(login, key) :
                storage[pass_position].login = storage[pass_position].login;
            password != '' ?
                storage[pass_position].password = Decrypt(password, key) :
                storage[pass_position].password = storage[pass_position].password;
            $(`.${column} a`).eq(pass_position).text(name);
            $(`.${column}`).find(`.p_login`).eq(pass_position).text(login);
            $(`.${column}`).find(`.p_password`).eq(pass_position).text(password);
            Recreate__Config();
            $('.config_window').css({'top': '-1000px', 'opacity': '0'});
            Encrypt(1, storage_one, `login`);
            Encrypt(1, storage_one, `password`);
            Encrypt(2, storage_two, `login`);
            Encrypt(2, storage_two, `password`);
            Shuffle();
        });
    }

    PassInput();
    Show__LoginPass();
    EditPassword();
    RecreatePass();

    // copy
    $(`body`).on('click', '.p_login, .p_password', function () {
        navigator.clipboard.writeText( $(this).text() );
    });
});
