'use strict';

var gCanvas;
var gCtx;
// var gMeme;

function initMemeGenerator() {
    initCanvas();
    renderImages();
}

function initCanvas() {
    gCanvas = document.querySelector('#mem-canvas');
    gCtx = gCanvas.getContext('2d');
}

function renderImages() {
    var imgs = getImages();

    var strHTMLs = imgs.map(img => {
        return `<img src="${img.url}" class="img" onclick="onCreateMeme('${img.id}')" alt="">`
    });
    var elImgs = document.querySelector('.img-container');
    elImgs.innerHTML = strHTMLs.join('');
}

function onCreateMeme(imgId) {
    var meme = createMeme(imgId);
    renderMemeGen(meme);
}

function renderMemeGen(meme) {
    //hide gallery
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.grid').style.display = 'none';
    //show canvas editor
    document.querySelector('.main-canvas').classList.remove('hide');

    var imgDimension = renderCanvas(meme);
    renderCanvasSize(imgDimension, meme);
}

function renderCanvas(meme) {
    var img = getCurrImg(meme.selectedImgId);
    var imgCanvas = new Image();
    imgCanvas.src = img.url;
    imgCanvas.onload = function () {
        gCtx.beginPath();
        gCtx.drawImage(imgCanvas, 0, 0, gCanvas.width, gCanvas.height);

        meme.lines.forEach(function (line, index) {
            gCtx.font = `${line.size}px ${line.font}`;
            gCtx.textAlign = line.align;
            gCtx.strokeStyle = line.strokeColor;
            gCtx.fillStyle = line.textColor;
            gCtx.strokeText(line.txt, line.posX, line.posY);
            gCtx.fillText(line.txt, line.posX, line.posY);

            if (index === meme.selectedLineIdx) {
                gCtx.fillStyle = '#ff7f00';
                gCtx.font = "30px Impact";
                if(gCtx.textAlign === 'start') gCtx.fillText('🢂', 10, line.posY);
                if(gCtx.textAlign === 'end') gCtx.fillText('🢀', gCanvas.width - 10, line.posY);
                if(gCtx.textAlign === 'center') gCtx.fillText('🢃',  gCanvas.width - 100, line.posY);
            }
        })
        gCtx.closePath();
        gCtx.save();
    };
    return { width: imgCanvas.width, height: imgCanvas.height };
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

function onAddLine() {
    var meme = getCurrMem();
    if(meme.lines.length === 3) return;

    clearSettings();
    meme = addNewMemeLine(gCanvas.height);
    renderCanvas(meme);
}

function onDeleteLine() {
    clearSettings();
    var meme = deleteMemeLine();
    renderCanvas(meme);
}

function clearSettings(){
    document.getElementById('txt-input').value = '';
    document.getElementById('strokeColor').value = '#000000';
    document.getElementById('textColor').value = '#ffffff';
}

function onChangeLine() {
    document.getElementById('txt-input').value = '';
    var meme = changeCurrLine();

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
    // removeArrow();
    var imgContent = gCanvas.toDataURL('image/jpg');
    elLink.href = imgContent;
}

// function removeArrow(){
//     // console.log(gPosYArrow);
//     // console.log(gCtx.measureText('>>'));
//     // console.log(gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt));
//     // console.log()
//     var width = gCtx.measureText('>>').width;
//     console.log(width);
//     console.log(gMeme.lines[gMeme.selectedLineIdx].posY);
//     gCtx.clearRect(0, gMeme.lines[gMeme.selectedLineIdx].posY, 32, 30);
// }


function toggleMenu() {
    document.body.classList.toggle('menu-open');
}