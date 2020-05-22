import Core from 'checheza_core';
import DropBarSound from '../assets/drop_bar.ogg';
import WrongBarSound from '../assets/wrong_bar.ogg';
import CorrectBarSound from '../assets/correct_bar.ogg';
import RoundWinSound from '../assets/round_win.ogg';
import LevelWinSound from '../assets/level_win.ogg';
import BackgroundLoop from '../assets/background.ogg';
import levels from './levels.json';
import $ from 'jquery';
import 'jquery-ui-bundle';
import _ from 'lodash';
import plankLeft from '../assets/plank-left.png';
import plankLeft2 from '../assets/plank-left2.png';
import plankMiddleRight from '../assets/plank-middle-right.png';
import blockOverlay from '../assets/block-overlay.png';
import wave1 from '../assets/wave1.png';
import wave2 from '../assets/wave2.png';
import wave3 from '../assets/wave3.png';
import wave4 from '../assets/wave4.png';
import wave5 from '../assets/wave5.png';

class MainDomain {
    constructor(widget) { 
        this.widget = widget;
    }

    // method called after render, add logics, event listeners etc. here
    start() {
        this.blockmatch = new BlockmatchClass(levels, 0);
        Core.utils.adjustAspectRatio();

        setTimeout(() => {
            this.blockmatch.init();
        }, 1000);
    }

    // return markup here.
    render() { 
        return `
        <style>
        .wrapper {
            font-family: 'Lara';
            display: block;
            overflow: hidden;
            position: relative;
            width:100%;
            height: 100%;
            background-color: #82E9FF;
        }
        
        .scene {
            display: block;
            position: absolute;
            min-width: 100%;
            height: 100%;
            z-index: 10;
        }
        
        .level_indicator {
            display: block;
            position: absolute;
            top:30px;
            left:30px;
            z-index: 11;
            font-size: 51px;
        }
        
        .current_number {
            display: block;
            position: absolute;
            top:50%;
            left:calc(50% - 15px);
            z-index: 12;
            width:60px;
            height:60px;
            text-align: center;
            background-color: #A6F7FD;
            border-radius: 30px;
        }
        .current_number_nr {
            display: block;
            position: absolute;
            z-index: 13;
            font-size: 63px;
            width:100%;
            text-align: center;
            color:#333333;
            line-height: 0;
            top:48%;
        }
        
        .waves {
            display: block;
            position: absolute;
            min-width: 100%;
            height: 100%;
            z-index: 1;
        }
        
        .waves .wave {
            display: block;
            position: absolute;
            min-width: 100%;
            height: 100%;
            z-index: 8;
            background-size: auto auto;
            background-repeat: no-repeat;
            opacity:0.5;
        }
        
        .waves .wave.wave_1 {
            background-image: url(${wave1});
            z-index: 8;
            background-position-y: -10%;
            width:200vw;
            animation: wave_a 35s infinite ease;
        }
        @keyframes wave_a {
            0% {
                -webkit-transform: translateX(0%); 
                opacity:0;
            }
            35% {
                -webkit-transform: translateX(20%); 
                opacity:1;
            }
            100% {
                -webkit-transform: translateX(120%); 
                opacity:0;
            }
        }
        
        .waves .wave.wave_2 {
            background-image: url(${wave2});
            z-index: 9;
            background-position-y: 40%;
            width:200vw;
            animation: wave_b 21s infinite ease;
        }
        @keyframes wave_b {
            0% {
                -webkit-transform: translateX(-40%); 
                opacity:0;
            }
            70% {
                -webkit-transform: translateX(90%); 
                opacity:1;
            }
            100% {
                -webkit-transform: translateX(120%); 
                opacity:0;
            }
        }
        
        .waves .wave.wave_3 {
            background-image: url(${wave3});
            z-index: 1;
            background-position: 10% 80%;
            width:200vw;
            animation: wave_c 23s infinite ease;
        }
        @keyframes wave_c {
          0%   {
            -webkit-transform: translateX(-30%); 
            opacity:0;
          }
          70%  {
            -webkit-transform: translateX(30%); 
            opacity:1;
          }
          100%  {
            -webkit-transform: translateX(-40%); 
            opacity:0;
          }
        }
        
        .waves .wave.wave_4 {
            background-image: url(${wave4});
            z-index: 6;
            background-position: 80% 10%;
            animation: wave_d 30s infinite cubic-bezier(0.705, 0.005, 0.360, 1.000);
        }
        @keyframes wave_d {
          0%   {
              background-position: 10% 10%;
          }
          40%  {
              background-position: 100% 30%;
          }
          100%  {
              background-position: 10% 10%;
          }
        }
        
        .waves .wave.wave_5 {
            background-image: url(${wave5});
            z-index: 2;
            background-position: 90% center;
        }
        
        .scene .background {
            position: absolute;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .column_holder_left {
            width:30%;
            height:95%;
            position:inherit;
            bottom:5%;
            left:10%;
        }
        
        .column_holder_right {
            width:30%;
            height:95%;
            position:inherit;
            bottom:5%;
            right:10%;	
        }
        .column_holder .column,
        .column_holder_left .drop_column {
            width:100%;
            height:100%;
            position:inherit;
            bottom:5%;
        }
        
        .column_holder .drop_column .bar {
            z-index: 200;
        }
        .column.drop_column .bar.dropped .segment.filled {
            visibility: hidden;
        }
        .column {
            width:100%;
            height:80%;
            position:absolute;
        }
        .column.left {
            bottom:5%;
        }
        .column.right {
            bottom:5%;
            right:10%;
        }
        .column .bar {
            position:absolute;
            padding: 0 5px 0 35px;
            margin: 0;
            background-image: url(${plankLeft2});
            background-position: left;
            background-size: auto 100%;
            background-repeat: no-repeat;
        }
        
        .column .bar.dropped {
            position:absolute;
            margin: 0;
        }
        
        .column.right .bar.hiddenbarright .chunk .segment {
            visibility:hidden;
        }
        .column.right .bar.numbers .chunk .segment {
            visibility:hidden;
        }
        
        .column.right .bar.numbers.ui-draggable-dragging .chunk .segment {
            visibility:visible;
        }
        
        .column.right .bar.bars .nr {
            visibility:hidden;
        }
        
        .column.right .bar.numbers.bars .chunk .segment {
            visibility:visible;
        }
        .column.right .bar.numbers.bars .nr {
            visibility:visible;
        }
        
        .column .bar .inner,
        .drop_column .bar .inner {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            border-radius: 4px;
            background-image: url(${plankMiddleRight});
            background-position: right;
            background-size: auto 100%;
            background-repeat: no-repeat;
            z-index: 100;
        }
        
        .column .bar.dropped .inner {
            
        }
        
        .column .bar .plank_left {
            display: block;
            position: absolute;
            width: 30%;
            height: 100%;
            padding: 0;
            margin: 0;
            z-index: 80;
            background-image: url(${plankLeft});
            background-position: left;
            background-size: auto 100%;
            background-repeat: no-repeat;
            z-index: 101;
        }
        
        .drop_column .waves_ {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
            opacity:0;
                z-index: 200;
                -webkit-transform: translateY(-40%);
            -ms-transform: translateY(-40%);
            transform: translateY(-40%);
        }
        .drop_column .waves_ .bubble {
            display: block;
            position: absolute;
            width: 50px;
            height: 50px;
            top:50%;
            background-color:#ffffff;
            animation: anim_bubble 1s forwards linear;
            animation-iteration-count: 1;
                opacity:0;
                border-radius: 50%;
        }
        .drop_column .waves_.animated {
            opacity:0.7;
        }
        @keyframes anim_bubble
        {
          0%   {
              opacity:0;
              transform: scale(0);
          }
          30%  {
              opacity:0.7;
              transform: scale(1.2);
          }
          100%  {
              opacity:0;
              transform: scale(0);
          }
        }
        
        @-webkit-keyframes anim_bubble /* Safari and Chrome - necessary duplicate */
        {
          0%   {background: #42cef4;}
          20%  {background: #afeeff;}
          30%  {background: #ffffff;}
          60%  {background: #00bfff;}
          80%  {background: #afeeff;}
        }
        .drop_column .waves_.show {
            opacity:1;
        }
        
        .column .bar.nr20 .inner {
            height: calc(100% - 6px);
            padding: 3px;
        }
        .column .bar.nr15 .inner {
            height: calc(100% - 6px);
            padding: 3px;
        }
        .column .bar.nr10 .inner {
            height: calc(100% - 6px);
            padding: 3px;
        }
        
        .column .bar .nr {
            position:absolute;
            left:-3px;
            top:50%;
            z-index:1;
            width: 24px;
            padding:12px 0;
            transform: translate(-100%,-50%);
            -webkit-transform: translate(-100%,-50%);
            -ms-transform: translate(-100%,-50%);
            text-align: center;
            font-size: 40px;
            line-height: 0;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNc9v1vGgAH5wMC1P3AaAAAAABJRU5ErkJggg==);
            border-radius: 20px;
        }
        .column .bar.first {
            position:absolute;
        }
        .column .bar.dropped {
            background-color: transparent;
            z-index: 100;
        }
        .column .bar.dropped .segment {
            -moz-box-shadow: none;
                -webkit-box-shadow: none;
                box-shadow: none;
                background-color: #444444;
        }
        .column .bar .segment {
            height: 80%;
            top: 10%;
            float:left;
            z-index:2;
        }
        .column .bar .chunk {
            float:left;
            height: 100%;
            padding: 0 3px;
        }
        .column .bar .chunk.single {
            padding: 0;
        }
        .column .bar .chunk.full {
            float:left;
            border-right: 4px solid #333;
        }
        .column .bar .chunk.full.last {
            border-right: 0px solid #333;
        }
        .timer {
            position:absolute;
            top:15px;
            left:50%;
            width: 50%;
            height:20px;
            background-color: #fff;
            -webkit-transform: translateX(-50%);
            -ms-transform: translateX(-50%);
            transform: translateX(-50%);
            border-radius: 7px;
            overflow:hidden;
            background-color: #55CDD0;
            opacity: 0.9;
        }
        .timer ._bar {
            position:absolute;
            top:0;
            left:0;
            width: 0;
            height:20px;
            background-color: #4B2B2B;
            border-radius: 7px;
        }
        
        .segment {
            display: block;
            position: relative;
            margin: 0;
            border-radius: 5px;
            overflow: hidden;
        }
        
        .segment:before {
            content: "";
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            overflow: hidden;
            background-image: url(${blockOverlay});
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        
        .column.right .segment.filled {
            background-color: transparent;
            background-color: #666;
            -webkit-box-shadow: inset -2px -2px 0px 0px rgba(0,0,0,0.25);
            -moz-box-shadow: inset -2px -2px 0px 0px rgba(0,0,0,0.25);
            box-shadow: inset -2px -2px 0px 0px rgba(0,0,0,0.25);
        }
        .column.right .segment {
            background-color: transparent;
        }
        .column.right .segment.filled {
            background-color: #444444;
        }
        .bar.dropped .segment {
            background-color: #aaa;
        }
        .bar.dropped .segment.filled {
            background-color: #666;
        }
        
        .column.left .segment.filled {
            background-color: transparent;
        }
        
        .column.left .bar:not(.done) .segment.filled {
            background-color: transparent!important;
        }
        
        .column.left .bar.done .segment.filled {
            background-color: #444444;
        }
        .column.left .bar.done.dropped .segment.filled {
            background-color: #aaaaaa;
        }
        .rightcolumn_inner {
            position: absolute;
            bottom: 0;
            width:100%;
        }
        
        
        
        .level_select {
            position: absolute;
            width:70%;
            height: 70%;
            top:15%;
            left:15%;
            z-index: 100000;
        }
        .level_select input {
            padding:9px;
            font-size: 24px;
        }
        .level_select button {
            padding:9px;
            font-size: 24px;
            border:none;
        }
        
        
        </style>
        <div class="wrapper">

		<!--
		<div class="level_select">
			<input type="number" name="level_select" value="0" />
			<button type="button" class="start_on_level">Start blockmatch</button>
		</div>
		-->

		<div class="waves">
			<div class="wave wave_1"></div>
			<div class="wave wave_2"></div>
			<div class="wave wave_3"></div>
			<!-- <div class="wave wave_4"></div>
			<div class="wave wave_5"></div> -->
		</div>

		<div class="noMouseCover"></div>

        <div class="scene">

        <div class="level_indicator"></div>
        <div class="current_number"><div class="current_number_nr"></div></div>

        <div class="timer"><div class="_bar timerbar"></div></div>
        <div class="column_holder_left">	
            <div class="column left leftcolumn"></div>
            <div class="drop_column column"></div>
        </div>

        <div class="column_holder_right">
            <div class="column right rightcolumn">
                <div class="rightcolumn_inner"></div>
            </div>
        </div>
        
    </div>
		
	</div>`
    }
}

class BlockmatchClass {

	constructor(levelsJSON, currentLevel) {
		this.colorSets = [
			{ left: '#E9731C', right: '#1344D8' },
			{ left: '#18CD1A', right: '#E86BFF' },
			{ left: '#F1E334', right: '#8422DB' },
			{ left: '#0BF3C4', right: '#FE3A3A' }
		];

		this.sounds = [];


		this.level = parseInt(currentLevel);
		this.currentNumber = null;
		this.nrBarsPerRound = 11;
		this.secondsPerBar = 7;
		this.previousNumbers = [];

		this.barsArray = [];
		this.usedNumbers = [];

		this.timer = 0;
		this.interval = null;

		this.levelsJSON = levelsJSON;

		this.currentLevel = null;

		this.nrBarWins = 0;
		this.nrRoundWins = 0;
		this.nrRoundFails = 0;

		this.wrapper = document.getElementsByClassName('wrapper')[0];
		this.columnLeft = document.getElementsByClassName('leftcolumn')[0];
		this.dropColumn = document.getElementsByClassName('drop_column')[0];
		this.columnRight = document.getElementsByClassName('rightcolumn_inner')[0];
		this.timerbar = document.getElementsByClassName('timerbar')[0];
		this.waves = document.getElementsByClassName('waves')[0];
		this.levelIndicator = document.getElementsByClassName('level_indicator')[0];
		this.currentNumberElement = document.getElementsByClassName('current_number_nr')[0];
	}

	renderNextBar() {
		var that = this;

		this.currentNumber = this.makeRandomNumber();

		var nrBarsAlreadyInPlace = $(this.columnLeft).find('.bar').not('.dropped').length;
		var columnHeight = $(this.columnLeft).outerHeight();

		var bar = this.makeBar(this.currentNumber, 'left');
		$(this.columnLeft).prepend(bar);

		var columnHeight = $(this.columnLeft).outerHeight();

		var barHeight = this.getBarHeight();

		$(this.columnLeft).find('.bar:first').animate({
			bottom: barHeight * nrBarsAlreadyInPlace + 'px'
		}, 800, 'easeInOutCubic', function () {

		});
	}

	getBarHeight() {
		//var barHeight = $(this.columnLeft).height() / this.nrBarsPerRound;
		//barHeight = barHeight > 40 ? 40 : barHeight;
		//return barHeight;
		var barHeight = ($(this.columnLeft).height()-90) / this.nrBarsPerRound;
		barHeight = barHeight > 40 ? 40 : barHeight;
		return barHeight;
	}

	renderRightColumn() {
		var that = this;

		$('.rightcolumn .bar').draggable('destroy');
		$('.rightcolumn .bar').remove();

		var columnHeight = $(this.columnLeft).height();
		var posIterator = 0;

		var barHeight = this.getBarHeight();

		var html = '';
		for (var i = 0; i < parseInt(this.currentLevel.maxValueRange) + 1; i++) {
			var bar = $(this.makeBar(i, 'right'));
			bar.css({ 'bottom': posIterator + 'px', 'height': barHeight + 'px' });
			$(bar).prependTo(this.columnRight).draggable({
				revert: 'invalid'
			});
			posIterator = (posIterator + (barHeight+10));
		}
	}

	// barType 

	// BARS - show the bar with number boxes 
	// NUMBERS - show bar with the number 
	//         - also show number on leftside 
	// 2COLOR - different color boxes on left and right side 
	// HIDDENBARIGHT/NUMBERS - hide boxes on current bar, only show number but show boxen when done 
	// 						 - numbers only in right column 

	getLevelClassName() {

		var classNames = '';
		if (this.currentLevel.barType.indexOf('HIDDENBARIGHT/NUMBERS') !== -1) {
			return ' hiddenbarright numbers ';
		}
		if (this.currentLevel.barType.indexOf('2COLOR') !== -1) {
			classNames += ' twocolor ';
		}
		if (this.currentLevel.barType.indexOf('BARS') !== -1) {
			classNames += ' bars ';
		}
		if (this.currentLevel.barType.indexOf('NUMBERS') !== -1) {
			classNames += ' numbers ';
		}

		return classNames;
	}

	makeBar(nr, type, dropPosition) {
		var that = this;

		var nrChunks = Math.ceil(that.currentLevel.maxValueRange / that.currentLevel.chunking);
		if (!Number.isFinite(nrChunks)) {
			nrChunks = 0;
		}

		var columnWidth = $(this.columnRight).outerWidth();
		var columnHeight = $(this.columnLeft).outerHeight();

		var segmentWidth = 'width:' + ((parseInt(columnWidth) / parseInt(this.currentLevel.maxValueRange))) + 'px;';
		var barStyle = '';
		var segmentStyle = '';
		var barClass = '';
		if (type === 'left') {
			barClass = 'first';
			barStyle = 'position:absolute;bottom:100%';
			segmentStyle = 'float:left;';
		}
		if (type === 'right') {
			segmentStyle = 'float:left;';
		}
		if (type === 'dropped') {
			var _bar = $(this.columnLeft).find('.bar:first').not(".dropped");
			var barHeight = _bar.height();
			var currentDropLimit = _bar.offset().top - barHeight;
			if ((currentDropLimit-50) < dropPosition) {
				var bottom = ((columnHeight - currentDropLimit) - barHeight)+50;
			} else {
				var bottom = (columnHeight - dropPosition) - barHeight;
			}

			var dropPosition = 'bottom:' + bottom + 'px';
			barClass = 'dropped';
			barStyle = 'position:absolute;' + dropPosition;
			segmentStyle = 'float:left;';
		}
		var chunkerArrayAll = [];
		var chunkI = 0;

		if (type === 'left' || type === 'dropped') {
			var barColorLeft = type === 'dropped' ? this.currentColorSet.right : this.currentColorSet.left;
			var barColorRight = type === 'dropped' ? this.currentColorSet.left : this.currentColorSet.right;
			for (var i = 0; i < this.currentLevel.maxValueRange; i++) {
				if (i < nr) {
					chunkerArrayAll.push('<div style="' + segmentWidth + ' ' +
						segmentStyle + ';background-color:' + barColorLeft + '" class="segment"></div>');
				} else {
					chunkerArrayAll.push('<div style="' + segmentWidth + ' ' +
						segmentStyle + ';background-color:' + barColorRight + '" class="segment filled"></div>');
				}
			}
		}

		if (type === 'right') {
			for (var i = 0; i < this.currentLevel.maxValueRange; i++) {
				if (i < nr) {
					chunkerArrayAll.push('<div style="' + segmentWidth + ' ' +
						segmentStyle + '" class="segment"></div>');
				} else {
					chunkerArrayAll.push('<div style="' + segmentWidth + ' ' +
						segmentStyle + ';background-color:' + this.currentColorSet.right + '" class="segment filled"></div>');
				}
			}
		}

		if (type == 'dropped') {
			chunkerArrayAll.reverse();
		}

		var chunkerArray = [];
		chunkerArray[chunkI] = [];

		_.each(chunkerArrayAll, function (item, i) {
			if (i % that.currentLevel.chunking === 0 && i !== 0) {
				chunkI++;
				chunkerArray[chunkI] = [];
			}
			chunkerArray[chunkI].push(item);
		});

		var levelClassName = this.getLevelClassName();

		var displayNr = nr;
		if (type == 'right') {
			var displayNr = this.currentLevel.maxValueRange - nr;
		}

		var barHeight = this.getBarHeight();

		var html = '<div style="height:' + barHeight + 'px;width:100%;' + barStyle + '" class="bar nr' + this.currentLevel.maxValueRange + ' ' + barClass + levelClassName + '">';

		if (type == 'dropped') {
			html += '<div class="waves_"></div>';
		}

		html += '<div class="inner">';

		html += '<div class="nr">' + displayNr + '</div>';

		_.each(chunkerArray, function (items, i) {

			var chunkStyle = items.length === parseInt(that.currentLevel.chunking) ? 'full' : '';

			var is_one_chunk = (chunkerArray.length === 1 ? 'single ' : '');
			if (i !== chunkerArray.length - 1) {
				html += '<div class="chunk ' + chunkStyle + ' ' + is_one_chunk + '">';
			} else {
				html += '<div class="chunk last ' + chunkStyle + ' ' + is_one_chunk + '">';
			}

			_.each(items, function (_html, ii) {
				html += _html;
			});

			html += '</div>';
		});

		html += '</div></div>';

		return html;
	}

	makeRandomNumber() {
		var found = false;
		var randomNr;

		while (found === false) {
			randomNr = Math.floor(Math.random() * this.currentLevel.maxValueRange);
			if (this.previousNumbers[this.previousNumbers.length - 1] !== randomNr) {
				found = true;
			}
		}

		this.previousNumbers.push(randomNr);

		return randomNr;
	}

	roundFail() {
		this.nrRoundFails = this.nrRoundFails + 1;
	}

	redoBar() {

	}

	winAnimation() {

	}

	startTimer() {
		var that = this;

		this.interval = setInterval(function () {
			that.updateTimerBar();
			if (that.timer == (that.nrBarsPerRound * that.secondsPerBar)) {
				clearInterval(that.interval);
				that.roundFail();
				that.resetGame();
				that.runLevel();
			}
			that.timer++;
		}, 1000);
	}

	updateTimerBar() {
		this.timerbar.style.width = ((this.timer / (this.nrBarsPerRound * this.secondsPerBar)) * 100) + '%';
	}

	runRound() {
		this.renderNextBar();
	}

	setRandomColorSet() {
		this.currentColorSet = this.colorSets[Math.floor(Math.random() * this.colorSets.length)];
	}

	resetGame() {
		this.nrBarWins = 0;
		$(this.columnLeft).find('.bar').remove();
		this.timer = 0;
	}

	renderCurrentNumber() {
		$(this.currentNumberElement).html(this.currentLevel.maxValueRange);
	}

	renderLevelIndicator() {
		$(this.levelIndicator).html(this.level);
	}

	runLevel() {
		var that = this;
        Core.utils.adjustAspectRatio();
		this.setRandomColorSet();

		this.currentLevel = this.getCurrentLevel();

        Core.utils.adjustAspectRatio();
		this.renderRightColumn();
		this.renderLevelIndicator();
		this.renderCurrentNumber();
		this.runRound();
		this.startTimer();
	}



	getCurrentLevel() {
		var that = this;
		console.log(this.levelsJSON,that.level);
		return _.find(this.levelsJSON, function (item, i) { return item.level == that.level; });
	}

	barDrop(columnLeft, event, ui) {
		var that = this;

		Core.audio.play(DropBarSound);

		var nrBarsAlreadyInPlace = $(this.columnLeft).find('.bar').length;

		this.renderRightColumn();

		var columnHeight = $(this.columnLeft).outerHeight();

		var nrAnswer = $(ui.draggable).find('.segment.filled').length;

		// $(ui.draggable).remove();

		var bar = this.makeBar(nrAnswer, 'dropped', ui.offset.top - $(event.target).offset().top);

		$(this.dropColumn).append(bar);

		var rightAnswer = this.rightOrWrong(nrAnswer, that.currentNumber);

		var barHeight = this.getBarHeight();

		if (rightAnswer) {
			var animateTo = barHeight * (nrBarsAlreadyInPlace - 1);
			$(that.dropColumn).find('.dropped').find('.waves_').addClass('show');
			setTimeout(() => {
				$(this.dropColumn).find('.dropped').css({ background: 'none' });
				$(this.dropColumn).find('.dropped').find('.inner').css({ background: 'none' });
			}, 900);
		} else {
			var animateTo = barHeight * nrBarsAlreadyInPlace;
		}

		if (rightAnswer) {
			setTimeout(() => {
				Core.audio.play(CorrectBarSound);
			}, 500);
			setTimeout(() => {
				that.barWin();
			}, 1100);
		} else {
			setTimeout(() => {
				that.barFail($(this.dropColumn).find('.dropped'));
			}, 1100);
		}

		$(this.dropColumn).find('.dropped').animate({
			bottom: animateTo + 'px'
		}, 1300, 'easeInOutCubic',function () {

		});
	}

	rightOrWrong(nrAnswer, currentNumber) {
		var that = this;

		if (this.currentLevel.maxValueRange == (nrAnswer + parseInt(currentNumber))) {
			return true;
		} else {
			return false;
		}
	}

	barWin() {
		var that = this;

		this.nrBarWins = this.nrBarWins + 1;


		$(this.columnLeft).find('.bar:first').addClass('done');

		var dropped = $(that.dropColumn).find('.dropped');

		//this.animateBubbles(dropped.find('.waves_'), () => {
			dropped.find('.waves_').animate({
				opacity: 0
			}, 410, () => {
				dropped.remove();
			});
		//});

		if (this.nrBarWins === this.nrBarsPerRound) {
			clearInterval(this.interval);
			this.nrRoundWins = this.nrRoundWins + 1;
			if (this.nrRoundWins === 3) {
				this.nrRoundWins = 0;
				this.level = this.level + 1;
				setTimeout(() => {
					that.resetGame();
					that.runLevel();
				}, 6800);
				Core.audio.play(LevelWinSound);
			} else {
				setTimeout(() => {
					that.resetGame();
					that.runLevel();
				}, 3300);
				Core.audio.play(RoundWinSound);
			}
			
		} else {
			setTimeout(() => {
				that.renderNextBar();
			}, 300);
		}
	}

	animateBubbles(dropped, callback) {
		var go = true;
		var x = 0;
		var barWidth = $(this.columnLeft).find('.bar:first').width();
		var diameter = 50;
		var bubble;
		var time;
		var animDuration = 1;
		var color_iterator = 0;
		var global_interator = 0;

		var colors = ['#42d9f4', '#bceaf2', '#ffffff'];

		function animate() {
			time = getRandomInt(50, 110);
			setTimeout(() => {

				diameter = getRandomInt(25, 60 - (global_interator * 4));
				animDuration = getRandomInt(90, 140) / 100;

				bubble = $('<div class="bubble"></div>');
				bubble.css({
					'background-color': colors[color_iterator],
					left: x + 'px',
					width: diameter + 'px',
					height: diameter + 'px',
					'animation-duration': animDuration + 's'
				});
				dropped.append(bubble);
				x = x + 29;
				if (x < barWidth) {
					color_iterator++;
					global_interator++;
					if (color_iterator > colors.length) {
						color_iterator = 0;
					}
					animate();
				} else {
					setTimeout(() => {
						callback();
					}, 100);
				}

			}, time);
		}

		animate()

		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		//callback();
	}

	barFail(dropped_bar) {
		var that = this;

		Core.audio.play(WrongBarSound);

		dropped_bar.effect("shake");

		setTimeout(function () {
			dropped_bar.remove();
		}, 1000);
	}

	startWaveAnimation() {
		var that = this;

		var waves = $(this.waves).find('.wave');
		waves.each(function (i, elem) {
			that.waveAnimation(elem);
		});
	}

	waveAnimation(elem) {
		elem.animate({
			background: "toggle"
		}, 5000, function () {
			// Animation complete.
		});
		//easeInOutBack
	}

	init() {
		var that = this;
        Core.utils.adjustAspectRatio();
		$(this.columnLeft).droppable({
			accept: ".bar",
			tolerance: "intersect",
			drop: function (event, ui) {
				that.barDrop(this, event, ui);
			}
		});

		/*
		$('.level_select button.start_on_level').on('click', (event) => {
			var level_ =  $('.level_select input[name=level_select]').val();
			this.level = parseInt(level_);
			$('.level_select').css({'display':'none'});
			setTimeout( function() {
				that.runLevel();
			},200);
		});
		*/

		this.startWaveAnimation();
		this.runLevel();
	}
}

function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function dragMoveListener(event) {
	var target = event.target,
		// keep the dragged position in the data-x/data-y attributes
		x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
		y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	// translate the element
	target.style.webkitTransform =
		target.style.transform =
		'translate(' + x + 'px, ' + y + 'px)';

	// update the posiion attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
};

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

function csvJSON(csv) {
	var lines = csv.split("\n");
	var result = [];

	var headers = lines[0].split("\t");

	for (var i = 1; i < lines.length; i++) {
		var obj = {};
		var currentline = lines[i].split("\t");
		for (var j = 0; j < headers.length; j++) {
			obj[headers[j]] = currentline[j];
		}
		result.push(obj);
	}

	return result;
}

export default MainDomain;