'use strict';


var gImgs;
var gMeme;


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
    if(!img) return;

    var meme = {
        selectedImgId: img.id,
        selectedLineIdx: 0,
        width: null,
        height: null,
        lines: [
            {   
                id: null,
                txt: 'Demo text',
                size: 20,
                align: 'left',
                color: 'red',
                posX: 30,
                posY: 30
            }
        ]
    }

    return meme;
}

function getCurrImg(imgId){
    var img = gImgs.find(img => img.id == imgId);
    return img;
}