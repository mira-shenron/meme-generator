'use strict';

const MEMES_DB = 'memes';
var gSavedMemes = [];


function saveMeme(imgDataURL) {
    var newMeme = {
        id: makeId(),
        imgDataURL
    }
    gSavedMemes.push(newMeme);
    saveToStorage(MEMES_DB,gSavedMemes);
}

function getMemeById(memeId){
    var meme = gSavedMemes.find(meme => meme.id === memeId);
    return meme;
}

function deleteMeme(memeId){
    var memeIdx = gSavedMemes.findIndex(meme => meme.id === memeId);
    gSavedMemes.splice(memeIdx,1);
    saveToStorage(MEMES_DB,gSavedMemes);
    return gSavedMemes;
}

function getSavedMemes(){
    gSavedMemes = loadFromStorage(MEMES_DB);
    return gSavedMemes;
}

