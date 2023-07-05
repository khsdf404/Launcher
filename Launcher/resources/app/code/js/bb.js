window.$ = window.jQuery = require("jquery");
const fs = require('fs');
const exec = require('child_process').exec;
$('document').ready(function() {
    let field_size = 0;
    function GetPos(s) {
        for (i = 0; i < field_size*field_size; i++) {
            if ($(`.bb_case${i}`).text() == s) {
                return i;
            }
        }
    }
    function RecreateField(elem) {
        function FillField() {
            field_size = 3 +  $(elem).index() +  $(elem).parent().index() * $(`.bb_sizes div:eq(0) div`).length;
            $('.bb_wrapp .bb_field').empty();
            for (i = 0; i < field_size*field_size; i++) {
                $('.bb_wrapp .bb_field').append(`
                    <div class="bb_case bb_case${i}">${(i+1)%(field_size*field_size)}</div>
                `);
            }
            $(`.bb_case${field_size*field_size-1}`).addClass('zero');
        }
        function CssCases() {
          // пиздец тут тонкий рассчёт лучше не трогай
          let case_h = (($(`.bb_wrapp .bb_field`).outerWidth() * 0.97 - 2 - 2*field_size)/ field_size)*(1-(field_size/100)+0.01*(field_size-Math.ceil((field_size+1)/2)));
          $(`.bb_case`).css({'max-width': case_h, 'min-width': case_h});
          $(`.bb_case`).css({'max-height': case_h, 'min-height': case_h});
          $(`.bb_case`).css({'font-size': `${(30-field_size*2)*2}px`});
        }
        FillField(elem);
        CssCases();
    }
    function CaseClick() {
      $(`.bb_field div`).click('click', function () {
          let classs = $(this).attr('class');
          let pos = parseInt(classs.replace(/\D+/g, ``));
          let d = pos-GetPos('0');

          function Swap(pos, anim) {
                  if (anim) {
                    if ($(`.bb_wrapp .bb_anim`).length == 0) {
                      let zp = GetPos('0');
                      let old_text = $(`.bb_case${pos}`).text();
                      let case_h = ((($(`.bb_wrapp .bb_field`).outerWidth() * 0.97 * 0.97) - (2*field_size))/ field_size);
                      $(`.bb_wrapp`).append(`<div class="bb_anim"></div>`)
                      $(`.bb_anim`).css({'top': $(`.bb_case${pos}`).offset().top - $(`.bb_wrapp`).offset().top, 'left': $(`.bb_case${pos}`).offset().left - $(`.bb_wrapp`).offset().left});
                      $(`.bb_anim`).css({'height': case_h, 'width': case_h});
                      $(`.bb_anim`).css({'display': 'inline-flex'});
                      $(`.bb_anim`).css({'font-size': `${(33-field_size*2)*2}px`});
                      $(`.bb_anim`).text($(`.bb_case${pos}`).text());

                      $(`.bb_case${pos}`).addClass('zero').text('0');
                      $(`.bb_steps`).text(`Steps: ${(parseInt($(`.bb_steps`).text().replace(/\D+/g, ``))+1)}`);

                      //let modd = (pos-GetPos('0'))/(pos-GetPos('0'));
                      let modd = 0;
                      pos-zp > 0 ? modd = -1 : modd = 1;
                      setTimeout(function () {
                        (pos-zp)*(pos-zp) > 1 ?
                            $(`.bb_anim`).css({'top': $(`.bb_case${pos}`).offset().top - $(`.bb_wrapp`).offset().top+(2+case_h)*modd }) :
                            $(`.bb_anim`).css({'left': $(`.bb_case${pos}`).offset().left - $(`.bb_wrapp`).offset().left+(2+case_h)*modd });
                      }, 1)
                      let speed;
                      ai_success ? speed = 175 : speed = 1;
                      setTimeout(function () {
                          $(`.bb_case${zp}`).removeClass('zero').text(old_text);
                          $(`.bb_wrapp div.bb_anim`).remove();
                          //$(`.bb_anim`).css({'display': 'none'});
                      }, speed)
                  }
                  }
                  else {
                    $(`.bb_case${GetPos('0')}`).removeClass('zero').text($(`.bb_case${pos}`).text());
                    $(`.bb_case${pos}`).addClass('zero').text('0');
                    $(`.bb_steps`).text(`Steps: ${(parseInt($(`.bb_steps`).text().replace(/\D+/g, ``))+1)}`);
                  }
          }
          function isClickable() {
              if (pos > field_size-1) {
                  if (d == field_size) {
                      return true;
                  }
              }
              if (d == -1 && pos%field_size != field_size) {
                return true;
              }
              if (d == 1 && pos%field_size != 0) {
                return true;
              }
              if (pos < field_size*field_size-field_size) {
                  if (d == -1*field_size) {
                      return true;
                  }
              }
              return false;
          }
          function ErrorAnimation(elem) {
              $(elem).css({'transition': '.07s background', 'background': 'rgba(255, 77, 77)'});
              setTimeout(function () {
                  $(elem).css({'transition': '0s', 'background': 'rgba(255, 255, 255, 0.8)'});
              }, 100);
          }

          isClickable() ? Swap(pos, anim) : ErrorAnimation(this);
      });

      $(`.bb_field div`).on('mousedown', function () {
          stopAI();
      });
    }

    $(`.bb_not_field .bb_sizes div div`).click(function () {
        RecreateField(this);
        CaseClick();

        stopAI();
        clearTimeout(bb_timer);
        $(`.bb_timer`).text(`00:00:00`);
        $(`.bb_steps`).text(`Steps: 0`);
        timerValue = 0;
    });

    let bb_timer;
    let timerValue;
    let anim = true;
    let case_h = 0;
    let ai_timer;
    let ai_success = true;
    let cycle = false;

    function fieldProperties() {
          let h = $(`.bb_wrapp .bb_field`).outerWidth() * 0.97 * 0.97;
          $(`.bb_field`).css({'max-width': h, 'min-width': h});
          $(`.bb_field`).css({'max-height': h, 'min-height': h});
          $(`.bb_not_field`).css({'max-height': h+12, 'min-height': h+12});
          $(`.bb_size div div`).css({'max-width': $(`.bb_size div div`).outerHeight()*1.5});
    }
    function ResetBB() {
        $(`.bb_controls .bb_redo`).on('click', function () {
            $(`.bb_wrapp .bb_win`).remove();

            function ShuffleBB(field_size) {
                anim = false;
                let rnd_arr = [];
                let chaos_counter = 0;

                function Shuffle() {
                    for (i = 0; i < field_size*field_size; i++) {
                        rnd_arr.push(i)
                    }
                    let chaos_counter = 0;
                    rnd_arr.sort(() => Math.random() - 0.5 );
                    rnd_arr.sort(() => Math.random() - 0.5 );
                    for (j = 0; j < rnd_arr.length-1; j++) {
                        for (k = j + 1; k < rnd_arr.length; k++)  {
                            if (rnd_arr[k] < rnd_arr[j]) {
                                chaos_counter++
                            }
                        }
                        if (rnd_arr[j] == 0 && field_size%2==0) {
                            chaos_counter+= Math.floor(j/field_size) + 1;
                        }
                    }
                    chaos_counter -= $.inArray(0, rnd_arr)

                    if (chaos_counter%2==1) {
                        let a = $.inArray(15, rnd_arr);
                        let b = $.inArray(14, rnd_arr);
                        [rnd_arr[a], rnd_arr[b]] = [rnd_arr[b], rnd_arr[a]]
                    }

                    $(`.bb_field div`).removeClass(`zero`);
                    for (i = 0; i < field_size*field_size; i++) {
                       $(`.bb_case${i}`).text(`${rnd_arr[i]}`);
                       rnd_arr[i] == 0 ? $(`.bb_case${i}`).addClass(`zero`) : field_size = field_size;
                    }
                }
                Shuffle();

                anim = true;
            }
            function isWin() {
                let isWin = false;
                for (i = 0; i < field_size*field_size-1; i++) {
                   if ($(`.bb_case${i}`).text() != `${(i+1)%(field_size*field_size)}`) {
                       break;
                   }
                   i==field_size*field_size-2 ? isWin = true : isWin;
                }
                if (isWin) {
                   let cycle_text = "";
                   cycle ? cycle_text = 'Stop Cycle' : cycle_text = 'Cycle';
                   clearTimeout(bb_timer);
                   bb_timer = 0;
                   $(`.bb_field`).append(`
                       <div class="bb_win">
                           <span><a>YOU HAVE WON OOH MYY GOOOD</a></span>
                           <div>
                             <span>${cycle_text}</span>
                             <span>ok and...</span>
                           </div>
                       </div>
                    `);
                    $(`.bb_wrapp div.bb_win div span:first`).text() == `Stop Cycle` ? cycle = true : cycle = false;
                    $(`.bb_wrapp div.bb_win div span:first`).click( function () {
                        if ($(this).text() == `Cycle`) {
                            cycle = true;
                            $(`.bb_redo`).trigger(`click`);
                            setTimeout(function () {
                                    $(`.bb_ai`).trigger(`click`);
                            }, 300);
                        }
                        else {
                            cycle = false;
                            Cycle();
                        }
                    });
                    cycle ? Cycle() : cycle;
                    $(`.bb_wrapp div.bb_win div span:last`).click( function () {
                        cycle = false;
                        $(`.bb_wrapp .bb_win`).remove();
                    });
                  return true;
               }
                return isWin;
            }

            function setTimer() {
                timerValue = 0;
                bb_timer = setTimeout(function tick() {
                   timerValue++;
                   if (isWin()) { return; }
                   let h = `${Math.floor(timerValue/3600)}`;
                   let m = `${Math.floor((timerValue - h*3600)/60)}`;
                   let s = `${timerValue - h*3600 - m*60}`;
                   h.length == 1 ? h = `0${h}` : h = `${h}`;
                   m.length == 1 ? m = `0${m}` : m = `${m}`;
                   s.length == 1 ? s = `0${s}` : s = `${s}`;
                   $(`.bb_timer`).text(`${h}:${m}:${s}`);
                   bb_timer = setTimeout(tick, 1000);
               }, 1000);
            }
            function stopTimer() {
                 clearTimeout(bb_timer);
                 $(`.bb_timer`).text(`00:00:00`);
                 timerValue = 0;
             }

            if (ai_success && !$(`.bb_field`).is(':empty')) {
                ShuffleBB(field_size);
                stopTimer();
                setTimer();
                $(`.bb_steps`).text(`Steps: 0`);
            }

            let cycle_saver = cycle;
            $(this).find(`i`).hasClass(`fad fa-pause-circle`) ? cycle_saver = false : cycle_saver;
            stopAI();
            cycle = cycle_saver;
         });
    }
    function bb_AI(speed) {
        $(`.bb_controls .bb_ai`).click(function () {
            if (ai_success && !$(`.bb_field`).is(':empty')) {
                ai_success = false;
                $(`.bb_redo i`).hasClass(`fal fa-redo`)
                    ? $(`.bb_redo i`).removeClass().addClass(`fad fa-pause-circle`)
                    : case_h = case_h;
                let stats;
                function toCPP() {
                  let clicks = "";
                  let positions = "";
                  for (i = 0; i < field_size*field_size; i++) {
                      positions += $(`.bb_case${i}`).text() + " ";
                  }
                  fs.writeFileSync(`${__dirname}\\code\\bb.txt`, positions);
                  stats = fs.statSync(`${__dirname}\\code\\bb.txt`);
                }
                function fromCPP(speed) {
                    setTimeout(function () {
                        clicks = fs.readFileSync(`${__dirname}\\code\\bb.txt`, {encoding:'utf8', flag:'r'});
                        clicks = clicks.split(' ');
                        clicks.pop();
                        let cc = 0;
                        ai_timer = setTimeout(function tick() {
                              $(`.bb_anim`).css({'transition': `${speed}s all`});
                              $(`.bb_case${GetPos(`${clicks[cc]}`)}`).trigger('click');
                              cc++;
                              if (cc == clicks.length) {
                                  let cycle_saver = cycle;
                                  stopAI();
                                  cycle = cycle_saver;
                                  return;
                              }
                              ai_timer = setTimeout(tick, speed*1000);
                        }, 1);
                    }, 1000);
                }

                toCPP();
                exec(`start "" "${__dirname}\\code\\BarleyBrick.exe"`, {cwd: `${__dirname}\\code\\`});
                let file_timer = setTimeout(function tick() {
                    if (stats.size != fs.statSync(`${__dirname}\\code\\bb.txt`).size) {
                      clearTimeout(file_timer);
                      fromCPP(speed);
                      return;
                    }
                    file_timer = setTimeout(tick, 10);
                }, 10);
            }
        });
    }
    function stopAI() {
        ai_success = true;
        clearTimeout(ai_timer);
        $(`.bb_anim`).css({'transition': '.2s all'});
        $(`.bb_redo i`).hasClass(`fad fa-pause-circle`)
            ? $(`.bb_redo i`).removeClass().addClass(`fal fa-redo`)
            : case_h = case_h;
        cycle = false;
    }


    let z_timer;
    function Cycle() {
        function CycleTimerAnim() {
            let count = 3;
            let cycle_timer = setTimeout(function tick() {
                if (cycle) {
                    count--;
                    $(`.bb_field .bb_win`).children('span').find(`div`).fadeIn(50);
                    $(`.bb_field .bb_win`).children('span').find(`div`).fadeOut(1000);
                    $(`.bb_field .bb_win`).children('span').find(`div`).text(`${count}...`);
                    if (count == 1) {
                        return;
                    }
                    cycle_timer = setTimeout(tick, 1000);
                }
                else {
                    clearTimeout(cycle_timer);
                    return;
                }
            }, 1000);
        }
        if (cycle) {
            $(`.bb_wrapp div.bb_win div span:first`).text(`Stop Cycle`);
            $(`.bb_field .bb_win`).children('span').append(`<div>3...</div>`);
            $(`.bb_field .bb_win`).children('span').find(`div`).fadeIn(50);
            $(`.bb_field .bb_win`).children('span').find(`div`).fadeOut(1000);
            CycleTimerAnim();
        }
        else {
            $(`.bb_wrapp div.bb_win div span:first`).text(`Cycle`);
            $(`.bb_field .bb_win`).children('span').find('div').remove();
            clearTimeout(z_timer);
        }
        z_timer = setTimeout(function () {
            if (cycle && $(`.bb_win`).length != 0)  {
                $(`.bb_redo`).trigger(`click`);
                setTimeout(function () {
                    if (cycle) {
                        $(`.bb_ai`).trigger(`click`);
                    }
                }, 300);
            }
            else {
                $(`.bb_wrapp div.bb_win div span:first`).text(`Cycle`);
                $(`.bb_field .bb_win`).children('span').find('div').remove();
                clearTimeout(z_timer);
            }
        }, 3000);
    }





    fieldProperties();
    ResetBB();
    bb_AI(0.001);
});
