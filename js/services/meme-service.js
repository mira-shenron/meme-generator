'use strict';


var gImgs;
var gMeme;
const startPosX = 60;
const startPosY = 60;

function createImages() {
    gImgs = [
        { id: '1', url: 'squareimgs/1.jpg', keywords: [] },
        { id: '2', url: 'squareimgs/2.jpg', keywords: [] },
        { id: '3', url: 'squareimgs/3.jpg', keywords: [] },
        { id: '4', url: 'squareimgs/4.jpg', keywords: [] },
        { id: '5', url: 'squareimgs/5.jpg', keywords: [] },
        { id: '6', url: 'squareimgs/6.jpg', keywords: [] },
        { id: '7', url: 'squareimgs/7.jpg', keywords: [] },
        { id: '8', url: 'squareimgs/8.jpg', keywords: [] },
        { id: '9', url: 'squareimgs/9.jpg', keywords: [] },
        { id: '10', url: 'squareimgs/10.jpg', keywords: [] },
        { id: '11', url: 'squareimgs/11.jpg', keywords: [] },
        { id: '12', url: 'squareimgs/12.jpg', keywords: [] },
        { id: '13', url: 'squareimgs/13.jpg', keywords: [] },
        { id: '14', url: 'squareimgs/14.jpg', keywords: [] },
        { id: '15', url: 'squareimgs/15.jpg', keywords: [] },
        { id: '16', url: 'squareimgs/16.jpg', keywords: [] },
        { id: '17', url: 'squareimgs/17.jpg', keywords: [] },
        { id: '18', url: 'squareimgs/18.jpg', keywords: [] }
    ];

    return gImgs;
}

function getImages() {
    if (!gImgs) {
        gImgs = createImages();
    }
    return gImgs;
}

function getCurrMem() {
    return gMeme;
}

function createMeme(imgId) {
    var img = getCurrImg(imgId);
    if (!img) return;

    gMeme = {
        selectedImgId: img.id,
        selectedLineIdx: 0,
        width: null,
        height: null,
        lines: [
            {
                txt: 'Enter text here',
                size: 30,
                align: 'start',
                textColor: '#ffffff',
                strokeColor: '#000000',
                font: 'Impact',
                posX: startPosX,
                posY: startPosY
            }
        ]
    }

    return gMeme;
}

function getCurrImg(imgId) {
    var img = gImgs.find(img => img.id == imgId);
    return img;
}

function deleteMemeLine() {

    if (gMeme.lines.length === 1) {
        resetLineSettings(gMeme.lines.length-1);
        return gMeme;
    }

    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = gMeme.selectedLineIdx - 1;
    return gMeme;
}

function addNewMemeLine(canvasHeight) {
    var newPosY = calculatePosY(canvasHeight);
    var line = {
        txt: 'Enter text here',
        size: 30,
        align: 'start',
        textColor: '#ffffff',
        strokeColor: '#000000',
        font: 'Impact',
        posX: startPosX,
        posY: newPosY
    }
    gMeme.lines.push(line);
    return gMeme;
}

function changeCurrLine() {
    if (gMeme.lines.length > 1) {
        gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length;
    }
    console.log(gMeme.selectedLineIdx);
    return gMeme;
}

function calculatePosY(canvasHeight) {
    var posY = canvasHeight - startPosY;

    if (gMeme.lines.length === 1) {
        gMeme.selectedLineIdx = 1;
        return posY;
    }
    if (gMeme.lines.length === 2) {
        posY = (gMeme.lines[0].posY + gMeme.lines[1].posY) / 2;
        gMeme.selectedLineIdx = 2;

        return posY;
    }

    //doesnt`t support currently more than 3
    if (gMeme.lines.length > 2) return;
}

function alignCurrLineText(alignTo, canvasWidth) {
    gMeme.lines[gMeme.selectedLineIdx].align = alignTo;

    if (alignTo === 'center') gMeme.lines[gMeme.selectedLineIdx].posX = canvasWidth / 2;
    if (alignTo === 'end') gMeme.lines[gMeme.selectedLineIdx].posX = canvasWidth - startPosX;
    if (alignTo === 'start') gMeme.lines[gMeme.selectedLineIdx].posX = startPosX;

    return gMeme;
}

function changeCurrLineFontSize(diff) {
    if (diff > 0) {
        if (gMeme.lines[gMeme.selectedLineIdx].size < 50) gMeme.lines[gMeme.selectedLineIdx].size += 10;
    } else if (gMeme.lines[gMeme.selectedLineIdx].size > 20) gMeme.lines[gMeme.selectedLineIdx].size -= 10;

    return gMeme;
}

function changeCurrLineTextColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].textColor = color;
    return gMeme;
}

function changeCurrLineStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color;
    return gMeme;
}

function changeCurrLineFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
    return gMeme;
}

function moveCurrLine(diff, canvasHeight) {
    if (diff < 0) {
        if (gMeme.lines[gMeme.selectedLineIdx].posY - 10 > startPosY) {
            gMeme.lines[gMeme.selectedLineIdx].posY -= 10;
        }
    } else if (gMeme.lines[gMeme.selectedLineIdx].posY + 10 < canvasHeight - startPosY) {
        gMeme.lines[gMeme.selectedLineIdx].posY += 10;
    }
    return gMeme;
}

function resetLineSettings(lineIdx){
    gMeme.lines[lineIdx].txt = 'Enter text here';
    gMeme.lines[lineIdx].size = 30;
    gMeme.lines[lineIdx].align = 'start';
    gMeme.lines[lineIdx].posX = startPosX;
    gMeme.lines[lineIdx].posY = startPosY;
    gMeme.lines[lineIdx].textColor = '#ffffff';
    gMeme.lines[lineIdx].strokeColor = '#000000';
    gMeme.lines[lineIdx].font = 'Impact';
}