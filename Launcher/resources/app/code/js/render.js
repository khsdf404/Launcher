window.$ = window.jQuery = require("jquery");
$('document').ready(function() {
    const electron = require('electron');
    const win = electron.remote.getCurrentWindow();
    const { ipcRenderer } = electron;
    const { remote } = electron;
    const { Tray, Menu, MenuItem } = remote;
    const exec = require('child_process').exec;
    const fs = require('fs')
    const path = require('path');
    const rimraf = require("rimraf");
    const MenuTemplate = []
    let tray = new Tray(path.join('', 'tray.ico'));
///////////////////////////////////////////////////////////////////////////////////
    const configDir =  (electron.app || electron.remote.app).getPath('userData');
    rimraf(configDir, function () { console.log("cache was cleaned"); });
    win.webContents.session.clearCache();
    win.webContents.session.clearStorageData();
///////////////////////////////////////////////////////////////////////////////////
    let exe_path = __dirname;
        exe_path = exe_path.split(`\\`);
        exe_path.pop();
        exe_path.pop();
        exe_path = exe_path.join(`\\`);
    function Anti_SecondWindow() {
        fs.writeFileSync(`${__dirname}\\created.txt`, `window has created.`);
        setInterval(function () {
            let data = fs.readFileSync(`${__dirname}\\created.txt`).toString();
            if (data == `was a try to launch 2nd window.`) {
                fs.writeFileSync(`${__dirname}\\created.txt`, `window has created.`);
                Min__Restore();
            }
        }, 1);
    }
    function CreateTray(which) {
        let trayMenu = Menu.buildFromTemplate(MenuTemplate);
        if (which == 0) {
            trayMenu.append(new MenuItem({ label: 'Hide', click() {
                Min__Restore();
            } }))
            trayMenu.append(new MenuItem({ label: 'Folder', click() { exec(`start ${__dirname}`) } }))
            trayMenu.append(new MenuItem({ label: 'DevTools', click() { win.webContents.openDevTools() } }))
            trayMenu.append(new MenuItem({ label: 'Close', click() { win.close() } }))
        }
        else {
            trayMenu.append(new MenuItem({ label: 'Show', click() {
                Min__Restore();
            } }))
            trayMenu.append(new MenuItem({ label: 'Folder', click() { exec(`start ${__dirname}`) } }))
            trayMenu.append(new MenuItem({ label: 'DevTools', click() { win.webContents.openDevTools() } }))
            trayMenu.append(new MenuItem({ label: 'Close', click() { win.close() } }))
        }
        tray.setContextMenu(trayMenu);
    }
    function Min__Restore() {
        let duration = 150
        let bounds = win.getBounds();   
        let need_x = ((window.screen.width * window.devicePixelRatio) - bounds.width)/2;
        let need_y = ((window.screen.height * window.devicePixelRatio) - bounds.height)/2;
        if ( win.isMinimized() == false ) {
            $(`#home`).trigger('click');
            $(".greeting").css({'transition': '0s'}).css({'opacity': '0'})
            $(".sidebar").css({'transition': '0s'}).css({'opacity': '0'})
            Delete__Veil();
            for (i = 0; i < duration; i++) {
                win.setBounds({x: bounds.x - 1, y: bounds.y + 1})
                bounds = win.getBounds()
                win.setOpacity((1-(i/duration)));
            }
            win.setBounds({x: need_x - duration, y: need_y + duration}); // for center restore
            CreateTray(1);
            win.minimize(); 
        }
        else  { 
            win.restore();
            CreateTray(0);
            for (i = 0; i < duration+1; i++) {
                win.setBounds({x: bounds.x + 1, y: bounds.y - 1})
                bounds = win.getBounds()
                for (k = 0; k < 6; k++) {
                    let math_round = (Math.round((i/duration)*100))/100;
                    win.setOpacity(math_round);
                }
            }
            setTimeout(function () {
                $(".greeting").css({'transition': '1s opacity'}).css({'opacity': '1'})
            }, 100)
            setTimeout(function () {
                $(".sidebar").css({'transition': 'flex .15s, opacity 1.5s'}).css({'opacity': '1'})
            }, 400)
        }
    }
    function Delete__Veil() {
        $(`.veil`).hide();
        $(`.list_menu`).css({'display': 'none'});
        $(`.list_box`).css({'border': '1px solid rgba(122,122,122,0.3)'});
        $(`.list_box.box_borderless`).removeClass(`box_borderless`);
        $(`.list_menu.menu_borderless`).removeClass(`menu_borderless`);
    }

    //Anti_SecondWindow();
    CreateTray(0);
    exec(`start "" "${exe_path}\\lnk.vbs"`, {cwd: exe_path});
    tray.on('click', function() {
        Min__Restore();
    });
///////////////////////////////////////////////////////////////////////////////////
// rain background
    // $(`.pseudo_body`).addClass(`back-row-toggle splat-toggle`)
    // //clear out everything
    // $('.rain').empty();
    // var increment = 0;
    // var drops = "";
    // var backDrops = "";
    // while (increment < 100) {
    // var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
    // var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
    // increment += randoFiver;
    // // animation-duration: 0.95
    // drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 60) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.9' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.9' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.9' + randoHundo + 's;"></div></div>';
    // backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 60) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.9' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.9' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.9' + randoHundo + 's;"></div></div>';
    // }
    // $('.rain.front-row').append(drops);
    // $('.rain.back-row').append(backDrops);
});
