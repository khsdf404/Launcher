
window.$ = window.jQuery = require("jquery");
$('document').ready(function() {
    let card_suits = [ "fad fa-heart", "fad fa-spade", "fad fa-diamond", "fad fa-club" ];
    let cards_value = [ "2", "3", "4", "5", "6", "7", "8", "9", "10", "В", "Д", "К", "Т" ];




    function showArray(fieldArray, fieldSize) {
        for (h = 0; h < fieldSize; h++) {
            arr2 = [fieldArray[h*fieldSize], fieldArray[h*fieldSize+1],fieldArray[h*fieldSize+2],fieldArray[h*fieldSize+3]];
        }
    }
    function zeroAside(fieldSize, arr, side) {
        let arr8 = [];
        for (za = 0; za < fieldSize; za++) {
            if (arr[za]!=0) {
                arr8.push(arr[za]);
            }
        }
        while(arr8.length!=4) {
            arr8.unshift(0);
        }

        return arr8;
    }
    function createArrayLine(fieldArray, fieldSize, isVertical, isReverse, lineNumber) {
        let tempArray = [];
        for (t = 0; t < fieldSize; t++) {
            let vertIndex = isVertical*(t*fieldSize+lineNumber);
            let horizIndex = !isVertical*(lineNumber*fieldSize+t);
            tempArray.push(fieldArray[vertIndex+horizIndex]);
        }
        isReverse ?
            tempArray.reverse() :
            tempArray = zeroAside(fieldSize, tempArray);
        for (t = 0 ; t < fieldSize; t++) {
            let vertIndex = isVertical*(t*4+lineNumber);
            let horizIndex = !isVertical*(lineNumber*4+t);
            fieldArray[vertIndex+horizIndex] = tempArray[t];
        }
        return fieldArray;
    }
    function putNew2(fieldArray, fieldSize) {
        let zeroIndexArray = [];
        for (i = 0; i < fieldSize*fieldSize; i++) {
            if (fieldArray[i]==0) {
                zeroIndexArray.push(i);
            }
        }
        let tempRandom = Math.floor(Math.random()*(zeroIndexArray.length-1));
        let fourRandom = Math.random();
        fourRandom < 0.95 ?
            fieldArray[zeroIndexArray[tempRandom]] = 2 :
            fieldArray[zeroIndexArray[tempRandom]] = 4;
        return fieldArray;
    }



    function Move(fieldArray, fieldSize, isVertical, isReverse) {
        showArray(fieldArray, fieldSize);

    	for (k = 0; k < fieldSize; k++) {
            isReverse ?
                fieldArray = createArrayLine(fieldArray, fieldSize, isVertical, true, k) :
                null;
        	for (i = fieldSize-1; i > 0; i--) {
            	let this_index, next_index;
                !isVertical ?
                    this_index = i+(k*fieldSize) :
                    this_index = k+(i*fieldSize);
                next_index = this_index - !isVertical - (fieldSize*isVertical);

                fieldArray = createArrayLine(fieldArray, fieldSize, isVertical, false, k);
                if (fieldArray[this_index] == fieldArray[next_index]) {
                	fieldArray[this_index] = 2*fieldArray[this_index];
                    t_nI = next_index;
                    t_tI = next_index-(this_index-next_index);
                    while(t_nI < 0 ) {
                    	fieldArray[t_nI] = fieldArray[t_tI];
                        t_nI -= (this_index-next_index);
                    }
                    fieldArray[t_nI] = 0;
                }
                //fieldArray = zeroAside(fieldSize, fieldArray, 1)
    		}
            isReverse ?
                fieldArray = createArrayLine(fieldArray, fieldSize, isVertical, true, k) :
                null;
    	}
        fieldArray = putNew2(fieldArray, fieldSize);

        showArray(fieldArray, fieldSize);
    }
    //var fieldArray = [16,16,0,16,2,4,4,8,4,4,4,4,2,0,0,2];
    var fieldArray = [0,0,0,0,0,0,0,0,2,8,8,0,0,0,0,0];
    Move(fieldArray, Math.sqrt(fieldArray.length), false, false);


































    for (k = 0; k < 4; k++) {
        $('.cards_wrapp').append('<ul class="cards_ul' + k + ' "> </ul>')
        for (i = 0; i < 13; i++) {
            if ( i < 4 )
                { $('.cards_ul' + k).append(`<li class="hide_cards">${cards_value[i]}<i class="${card_suits[k]}"></i></li>`); }
            if ( i == 4 )
                { $('.cards_ul' + k).append(`<li class="new_fc">${cards_value[i]}<i class="${card_suits[k]}"></i></li>`); }
            if ( ( 4 < i) && (i < 8) )
                { $('.cards_ul' + k).append(`<li>${cards_value[i]}<i class="${card_suits[k]}"></i></li>`); }
            if ( i == 8 )
                { $('.cards_ul' + k).append(`<li class="cards_10">${cards_value[i]}<i class="${card_suits[k]}"></i></li>`); }
            if ( i > 8 )
              { $('.cards_ul' + k).append(`<li>${cards_value[i]}<i class="${card_suits[k]}"></i></li>`); }
        }
    }
    $(".hide_cards").css({ "display": "none" });
    $('.cards_wrapp').on('click', 'ul li', function () {
        let opacity_val = $(this).css('opacity');
        if ( opacity_val == "1" )  { $(this).css({ "opacity": "0" });   }
        else { $(this).css({"opacity": "1"});  }
    });
});
