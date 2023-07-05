window.$ = window.jQuery = require("jquery");
$('document').ready(function() {

    $(`.test_wrapp`).append(`<div class="test-question">Ходишь на одну лекцию в среду??</div>`);
    $(`.test_wrapp`).append(`<div class="test-passed-button">Да, конечно</div>`);
    $(`.test_wrapp`).append(`<div class="test-fail-button">Нет, я хочу отчислиться</div>`);


    let parentWidth = $(`.test_wrapp`).outerWidth();
    let parentHeight = $(`.test_wrapp`).outerHeight();
    let childWidth = $(`.test_wrapp .test-fail-button`).outerWidth();
    let childHeight = $(`.test_wrapp .test-fail-button`).outerHeight();


    function setNewPos() {
        let childX, childY;
        function getNewPos() {
            childX = (Math.random()*(parentWidth-childWidth));
            childY =  (Math.random()*(parentHeight-childHeight));
        }
        getNewPos();
        $(`.test_wrapp .test-fail-button`).css({"top": childY, "left": childX});
        setTimeout(function () {
            let arrt = Array.prototype.slice.call(document.querySelectorAll(":hover"));
            if (arrt[arrt.length-1] == document.getElementsByClassName(`test-fail-button`)[0]) {
                setNewPos();
            }
        }, 20)

    }


    $(`.test_wrapp .test-fail-button`).on('mouseover', function(e) {
        setNewPos();
    });

    $(`.test_wrapp .test-passed-button`).click(function () {
        $(`.test-question, .test-fail-button, .test-passed-button`).css({'opacity': '0'});
        $(`.test_wrapp`).append(`<div class="test-passed-content">test failed succesfully<div class="test-passed-contentExitBnt">Oh... Ok.</div></div>`);
        $(`.test_wrapp .test-passed-contentExitBnt`).click(function () {
            $(`.test-passed-content`).remove();
            $(`.test-question, .test-fail-button, .test-passed-button`).css({'opacity': '1'});
        });

    });


});
