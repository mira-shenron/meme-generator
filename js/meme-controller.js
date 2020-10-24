'use strict';

var gCanvas;
var gCtx;
var gIsDragging = false;
var gCurrPos = {};
var gPrevPos = {};

function initMemeGenerator() {
    initCanvas();
    renderKeywords();
    renderImages();
}

function initCanvas() {
    gCanvas = document.querySelector('#mem-canvas');
    gCtx = gCanvas.getContext('2d');
}

function renderImages(sortBy = 'none') {
    var imgs = getImages(sortBy);

    var strHTMLs = imgs.map(img => {
        return `<img src="${img.url}" class="img" onclick="onCreateMeme('${img.id}')" alt="">`
    });
    var elImgs = document.querySelector('.img-container');
    elImgs.innerHTML = strHTMLs.join('');
}

function renderKeywords() {
    var keywords = getKeywords();
    var strKeywordsHTMLs = keywords.map(keyword => {
        return `<span onclick="onSearchByKeyword(this)" class="flex keyword" style="font-size:${keyword.count}px">${keyword.word}</span>`
    });
    var elKeywords = document.querySelector('.search-keywords');
    elKeywords.innerHTML = strKeywordsHTMLs.join('');
}

function onCreateMeme(imgId) {
    var meme = createMeme(imgId);
    renderMemeGen(meme);
}


function onSearchByKeyword(elKeyword) {
    renderImages(elKeyword.innerText);
    increaseKeywordCount(elKeyword.innerText);
    renderKeywords();
}

function renderMemeGen(meme) {
    //hide gallery
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.grid').style.display = 'none';
    document.querySelector('.search-container').style.display = 'none';
    //show canvas editor
    document.querySelector('.main-canvas').classList.remove('hide');

    var imgDimension = renderCanvas(meme);
    renderCanvasSize(imgDimension, meme);
}

function renderStickers(meme) {
    meme.stickers.forEach(function (sticker) {
        var stickerCanvas = new Image();
        stickerCanvas.src = sticker.stickerUrl;
        stickerCanvas.onload = function () {
            gCtx.drawImage(stickerCanvas, sticker.posX, sticker.posY, sticker.stickerWidth, sticker.stickerHeight);
        }
    })
}

function renderLines(meme, noArrow){
    meme.lines.forEach(function (line, index) {
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.textAlign = line.align;
        gCtx.strokeStyle = line.strokeColor;
        gCtx.fillStyle = line.textColor;
        gCtx.strokeText(line.txt, line.posX, line.posY);
        gCtx.fillText(line.txt, line.posX, line.posY);

        if (index === meme.selectedLineIdx && noArrow === undefined) {
            gCtx.fillStyle = '#ff7f00';
            gCtx.font = "30px Impact";
            if (gCtx.textAlign === 'start') gCtx.fillText('🢂', 10, line.posY);
            if (gCtx.textAlign === 'end') gCtx.fillText('🢀', gCanvas.width - 10, line.posY);
            if (gCtx.textAlign === 'center') gCtx.fillText('🢃', gCanvas.width - 100, line.posY);
        }
    })
}

function renderCanvas(meme, noArrow) {
    var img = getCurrImg(meme.selectedImgId);
    var imgCanvas = new Image();
    imgCanvas.src = img.url;
    imgCanvas.onload = function () {
        gCtx.beginPath();
        gCtx.drawImage(imgCanvas, 0, 0, gCanvas.width, gCanvas.height);

        renderStickers(meme);
        renderLines(meme,noArrow);

        gCtx.closePath();
        gCtx.save();
    };
    return { width: imgCanvas.width, height: imgCanvas.height };
}

function onDragLine(ev) {
    if (!gIsDragging) return;
    var pos = getMousePos(ev);
    dragLine(pos);
}

function dragLine(pos) {
    const [offsetX, offsetY] = [pos.x, pos.y];
    gCurrPos.x = offsetX;
    gCurrPos.y = offsetY;

    var x = gCurrPos.x - gPrevPos.x;
    var y = gCurrPos.y - gPrevPos.y;

    changePosX(x);
    changePosY(y);
    gPrevPos.x = offsetX;
    gPrevPos.y = offsetY;

    var meme = getCurrMem();
    renderCanvas(meme);
}

function onStopDragging(ev) {
    gIsDragging = false;
}

function getMousePos(ev) {
    return { x: ev['offsetX'], y: ev['offsetY'] };
}

function canvasClicked(ev) {
    const { offsetX, offsetY } = ev;
    var meme = getCurrMem();

    const clickedLine = meme.lines.find(line => {
        if (line.align === 'start') return offsetX > line.posX && offsetX < line.posX + gCtx.measureText(line.txt).width && offsetY > line.posY && offsetY < line.posY + line.size + 30;
        if (line.align === 'end') return offsetX < line.posX + 20 && offsetX > line.posX - gCtx.measureText(line.txt).width && offsetY > line.posY && offsetY < line.posY + line.size + 30;
        if (line.align === 'center') return offsetX > line.posX - gCtx.measureText(line.txt).width/2  && offsetX < line.posX + gCtx.measureText(line.txt).width/2 && offsetY > line.posY && offsetY < line.posY + line.size + 30;
    })

    if (clickedLine) {
        gPrevPos.x = offsetX;
        gPrevPos.y = offsetY;
        onChangeLine(clickedLine.id);
        gIsDragging = true;
    }
}


function renderCanvasSize(imgDimsObj, meme) {
    gCanvas.width = 500;
    gCanvas.height = 500;
    var ratio = imgDimsObj.width / imgDimsObj.height;
    if (imgDimsObj.width > imgDimsObj.height) {
        if (imgDimsObj.width > gCanvas.width) {
            imgDimsObj.height = gCanvas.width * (1 / ratio);
            gCanvas.height = imgDimsObj.height;
        } else {
            var widthRatio = gCanvas.width / imgDimsObj.width;
            imgDimsObj.width = gCanvas.width;
            imgDimsObj.height *= widthRatio;
        }
    } else {
        if (imgDimsObj.height > gCanvas.height) {
            gCanvas.height = gCanvas.width;
            imgDimsObj.width = gCanvas.height * ratio;
            gCanvas.width = imgDimsObj.width;
        } else {
            var heightRatio = gCanvas.height / imgDimsObj.height;
            imgDimsObj.height = gCanvas.height;
            imgDimsObj.width *= heightRatio;
        }
    }
    gCtx.fillStyle = 'rgb(239, 245, 243)';
    gCtx.fillRect(0, 0, imgDimsObj.width, imgDimsObj.height);
    meme.width = imgDimsObj.width;
    meme.height = imgDimsObj.height;
}


function onShowGallery() {
    //show gallery
    document.querySelector('.search-container').style.display = 'flex';
    document.querySelector('.gallery').style.display = 'block';
    document.querySelector('.grid').style.display = 'grid';

    //hide canvas editor
    document.querySelector('.main-canvas').classList.add('hide');
    document.body.classList.remove('menu-open');
}

function onTxtInsert(elLine) {
    var meme = getCurrMem();
    var lineIdx = meme.selectedLineIdx;
    meme.lines[lineIdx].txt = elLine.value;
    renderCanvas(meme);
}

function onSearchInsert(searchText) {
    var searchBy = searchText.value;
    renderImages(searchBy);
}

function onAddLine() {
    var meme = getCurrMem();
    if (meme.lines.length === 3) return;

    clearSettings();
    meme = addNewMemeLine(gCanvas.height);
    renderCanvas(meme);
}

function onDeleteLine() {
    clearSettings();
    var meme = deleteMemeLine();
    renderCanvas(meme);
}

function clearSettings() {
    document.getElementById('txt-input').value = '';
    document.getElementById('strokeColor').value = '#000000';
    document.getElementById('textColor').value = '#ffffff';
}

function onChangeLine(lineId) {
    document.getElementById('txt-input').value = '';
    var meme = changeCurrLine(lineId);

    document.getElementById('strokeColor').value = meme.lines[meme.selectedLineIdx].strokeColor;
    document.getElementById('textColor').value = meme.lines[meme.selectedLineIdx].textColor;
    renderCanvas(meme);
}

function onAlign(alignTo) {
    var meme = alignCurrLineText(alignTo, gCanvas.width);
    renderCanvas(meme);
}

function onFontSizeChange(diff) {
    var meme = changeCurrLineFontSize(diff);
    renderCanvas(meme);
}

function onFontChange() {
    var meme = changeCurrLineFont(document.getElementById('font-choise').value);
    renderCanvas(meme);
}

function changeStrokeColor() {
    var meme = changeCurrLineStrokeColor(document.getElementById('strokeColor').value);
    renderCanvas(meme);
}

function changeTextColor() {
    var meme = changeCurrLineTextColor(document.getElementById('textColor').value);
    renderCanvas(meme);
}

function onMoveLine(diff) {
    var meme = moveCurrLine(diff, gCanvas.height);
    renderCanvas(meme);
}

function downloadAsImg(elLink) {
    var meme = getCurrMem();
    renderCanvas(meme,true);
    var imgContent = gCanvas.toDataURL('image/jpg');
    elLink.href = imgContent;
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();

    var data = ev.dataTransfer.getData("text");
    var elSticker = document.getElementById(data);

    addStickerToMeme(elSticker.src, ev.offsetX - 50, ev.offsetY - 50, 60, 60);
    renderCanvas(getCurrMem());
}










