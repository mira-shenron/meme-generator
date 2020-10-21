'use strict';

var gCanvas;
var gCtx;

function initMemeGenerator(){
    initCanvas();
    renderImages();
}

function initCanvas(){
    gCanvas = document.querySelector('#mem-canvas');
    gCtx = gCanvas.getContext('2d');
}

function renderImages(){
    var imgs = getImages();

    var strHTMLs = imgs.map(img => {
        return `<img src="${img.url}" class="img" onclick="onCreateMeme('${img.id}')" alt="">`
    });
    var elImgs = document.querySelector('.img-container');
    elImgs.innerHTML = strHTMLs.join('');
}

function onCreateMeme(imgId){
    var meme = createMeme(imgId);
    renderMemeGen(meme);
}

function renderMemeGen(meme){
    //hide gallery
    document.querySelector('.gallery').style.display = 'none';
    document.querySelector('.grid').style.display = 'none';
    //show canvas editor
    document.querySelector('.main-canvas').classList.remove('hide');

    var imgDimension = renderCanvas(meme);
    renderCanvasSize(imgDimension,meme);
}

function renderCanvas(meme){
    var img = getCurrImg(meme.selectedImgId);
    var imgCanvas = new Image();
    imgCanvas.src = img.url;
    imgCanvas.onload = function () {
        gCtx.drawImage(imgCanvas, 0, 0, gCanvas.width, gCanvas.height);
        meme.lines.forEach(function (line) {
            gCtx.strokeText(line.txt, 30, 30);
        })
    };

    return {width: imgCanvas.width, height: imgCanvas.height};
}

function renderCanvasSize(imgDimsObj,meme){
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


function onShowGallery(){
        //show gallery
        document.querySelector('.gallery').style.display = 'block';
        document.querySelector('.grid').style.display = 'grid';
        //hide canvas editor
        document.querySelector('.main-canvas').classList.add('hide');
}