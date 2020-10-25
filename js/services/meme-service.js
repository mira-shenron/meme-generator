'use strict';

var gImgs;
var gMeme;
var gKeywords;
var gStickers;
var gCurrStickersPage = 0;

const startPosX = 60;
const startPosY = 60;

function createImages() {
    gImgs = [
        { id: '1', url: 'squareimgs/1.jpg', keywords: ['people'] },
        { id: '2', url: 'squareimgs/2.jpg', keywords: ['dogs', 'animals'] },
        { id: '3', url: 'squareimgs/3.jpg', keywords: ['dogs', 'animals', 'children', 'people'] },
        { id: '4', url: 'squareimgs/4.jpg', keywords: ['animals'] },
        { id: '5', url: 'squareimgs/5.jpg', keywords: ['children', 'people'] },
        { id: '6', url: 'squareimgs/6.jpg', keywords: ['seople', 'smiles'] },
        { id: '7', url: 'squareimgs/7.jpg', keywords: ['children', 'people'] },
        { id: '8', url: 'squareimgs/8.jpg', keywords: ['people', 'smiles'] },
        { id: '9', url: 'squareimgs/9.jpg', keywords: ['children', 'smiles'] },
        { id: '10', url: 'squareimgs/10.jpg', keywords: ['people', 'smiles'] },
        { id: '11', url: 'squareimgs/11.jpg', keywords: ['people'] },
        { id: '12', url: 'squareimgs/12.jpg', keywords: ['people'] },
        { id: '13', url: 'squareimgs/13.jpg', keywords: ['people', 'smiles', 'movies'] },
        { id: '14', url: 'squareimgs/14.jpg', keywords: ['people', 'movies'] },
        { id: '15', url: 'squareimgs/15.jpg', keywords: ['people', 'movies'] },
        { id: '16', url: 'squareimgs/16.jpg', keywords: ['people', 'smiles', 'movies'] },
        { id: '17', url: 'squareimgs/17.jpg', keywords: ['people'] },
        { id: '18', url: 'squareimgs/18.jpg', keywords: ['smiles', 'movies'] }
    ];

    return gImgs;
}

function createStickers() {
    gStickers = [
        { id: 'apple', url: 'stickers/apple.png'},
        { id: 'crown', url: 'stickers/crown.png'},
        { id: 'fire', url: 'stickers/fire.png'},
        { id: 'panda', url: 'stickers/panda.png'},
        { id: 'lollilop', url: 'stickers/lollilop.png'},
        { id: 'rock', url: 'stickers/rock.png'},
        { id: 'ok', url: 'stickers/ok.png'},
        { id: 'omg', url: 'stickers/omg.png'},
        { id: 'rainbow', url: 'stickers/rainbow.png'}
    ];
}

function getStickers(pageIdx=0){
    if(!gStickers){
        createStickers();
    }

    var currPageStickers = [];
    if(gCurrStickersPage + pageIdx < 0 || gCurrStickersPage + pageIdx > gStickers.length-4) return currPageStickers;
    gCurrStickersPage += pageIdx;
    currPageStickers.push(gStickers[gCurrStickersPage]);
    currPageStickers.push(gStickers[gCurrStickersPage+1]);
    currPageStickers.push(gStickers[gCurrStickersPage+2]);
    currPageStickers.push(gStickers[gCurrStickersPage+3]);
    return currPageStickers;
}


function createKeywords() {
    gKeywords = [
        { word: 'people', count: 12 },
        { word: 'dogs', count: 28 },
        { word: 'animals', count: 22 },
        { word: 'children', count: 14 },
        { word: 'smiles', count: 23 },
        { word: 'movies', count: 16 },
        { word: 'All', count: 30 }
    ];
}

function getKeywords() {
    if (!gKeywords) createKeywords();
    return gKeywords;
}

function getImages(sortBy) {
    if (!gImgs) gImgs = createImages();
    if (sortBy === 'none' || sortBy === '' || sortBy === 'All') return gImgs;
    else return sortImgs(sortBy);
}

function increaseKeywordCount(keyword) {
    if (keyword === 'All') return;
    var kWord = gKeywords.find(kWord => kWord.word === keyword);
    if (kWord.count < 35) kWord.count++;
}

function sortImgs(sortBy) {
    var sortedImgs = gImgs.filter(img => {
        return img.keywords.find(word => word.startsWith(sortBy.toLowerCase()))
    })
    return sortedImgs;
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
        stickers: [],
        lines: [
            {
                id: makeId(),
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
        resetLineSettings(gMeme.lines.length - 1);
        return gMeme;
    }

    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = gMeme.selectedLineIdx - 1;
    return gMeme;
}

function addNewMemeLine(canvasHeight) {
    var newPosY = calculatePosY(canvasHeight);
    var line = {
        id: makeId(),
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

function changeCurrLine(id) {
    if (gMeme.lines.length > 1 && (!id)) {
        gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length;
    }
    if (id) {
        var lineIdx = gMeme.lines.findIndex(line => line.id === id)
        gMeme.selectedLineIdx = lineIdx;
    }
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

function resetLineSettings(lineIdx) {
    gMeme.lines[lineIdx].txt = 'Enter text here';
    gMeme.lines[lineIdx].size = 30;
    gMeme.lines[lineIdx].align = 'start';
    gMeme.lines[lineIdx].posX = startPosX;
    gMeme.lines[lineIdx].posY = startPosY;
    gMeme.lines[lineIdx].textColor = '#ffffff';
    gMeme.lines[lineIdx].strokeColor = '#000000';
    gMeme.lines[lineIdx].font = 'Impact';
}

function changePosY(diff) {
    gMeme.lines[gMeme.selectedLineIdx].posY += diff;
}

function changePosX(diff) {
    gMeme.lines[gMeme.selectedLineIdx].posX += diff;
}

function addStickerToMeme(stickerUrl, posX, posY, stickerWidth, stickerHeight) {
    var sticker = {
        id: makeId(),
        stickerUrl,
        posX,
        posY,
        stickerWidth,
        stickerHeight
    }

    gMeme.stickers.push(sticker);
}