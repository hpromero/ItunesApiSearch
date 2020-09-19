

const buttonSrh = document.getElementById('buttonSrh');
const inputSrh = document.getElementById('inputSrh');
const list = document.getElementById('list');
const divplayer1 = document.getElementById('divplayer1');
const divplayer2 = document.getElementById('divplayer2');
let items;
let prevIndex;
let ActualIndex;
let starttouchX;






buttonSrh.addEventListener('click',()=>{
    fetch('https://itunes.apple.com/search?term='+inputSrh.value,{method:'POST'})
    .then(response => response.json())
    .then((data) => {
        items = data.results
        createList();
        console.log(items.length);
        console.log(items[0].trackName);
        console.log(items[items.length-1].trackName+"CorrectaSeguro");
        console.log(items[length-1].trackName+"Erronea?");
        console.log(items[items.length-1].trackName+"CorrectaSeguro");
    });
});


function createList() {
    items.sort(compare_kind);
    divplayer1.innerHTML='';
    divplayer2.innerHTML='';
    let listContent = '';
    items.forEach((cur, index) => { 
        if (items[index].kind == 'song' || items[index].kind == 'feature-movie'||items[index].kind == 'music-video') {
            listContent += '<div class="parentDiv" ><div class="divli" id="divData'+index+'"> <li class="liClass" id='+index+'>';

            if (items[index].kind == 'song'){
                listContent += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>';
            }else if(items[index].kind == 'feature-movie'){
                listContent += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
            }else if(items[index].kind == 'music-video'){
                listContent += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03c-.02 1.64-1.35 2.97-3 2.97-1.66 0-3-1.34-3-3z"/></svg>';
            }

            listContent += '<h3>'+cur.trackName+'</h3> <p>'+cur.artistName+'</p></li></div><div id="divDel'+index+'" class="divliDel"><h3 class="divliDelh3" >Borrar</h3></div></div>';
        }
    });
    list.innerHTML = listContent;


    const itemLiList = document.querySelectorAll('li');
    itemLiList.forEach((item, index) => {
        item.addEventListener('click',()=>{ ActualIndex=index; playSong(); });
        item.addEventListener('touchstart', touchstart);
        item.addEventListener('touchend', (event) => { touchend(event,index)});
        
    });

    function compare_kind(a, b){
        if(a.kind < b.kind){
                return 1;
        }else if(a.kind > b.kind){
                return -1;
        }else{
                return 0;
        }
    }

    function playSong(){
        let autoplay = document.getElementById('autoplay').checked;
        let item = document.getElementById(ActualIndex);
        let prevItem = document.getElementById(prevIndex);
            if (prevItem!=null) prevItem.className="liClass";
            prevIndex=ActualIndex;
            if (item!=null) item.className="liSelected";
            if (items[ActualIndex].kind == 'song'){
                if(autoplay==true){
                    divplayer1.innerHTML='<audio id="player" controls autoplay> <source src="'+items[ActualIndex].previewUrl+'"> </audio>'
                }else{
                    divplayer1.innerHTML='<audio id="player" controls> <source src="'+items[ActualIndex].previewUrl+'"> </audio>'
                }

                let player = document.getElementById('player');
                player.addEventListener("ended",function(){endedSong();},true);
                divplayer2.innerHTML='<div class="artwork"><img class="artwork" src="'+items[ActualIndex].artworkUrl100+'"></div><div class="data" <h3>'+items[ActualIndex].trackName+'</h3> <p>'+items[ActualIndex].artistName+'</p></div>';     
            }else if(items[ActualIndex].kind == 'feature-movie'||items[ActualIndex].kind == 'music-video'){
                divplayer2.innerHTML='<video width="100%" height"auto" controls> <source src="'+items[ActualIndex].previewUrl+'"> </video>'
                divplayer1.innerHTML='<div class="data" <h3>'+items[ActualIndex].trackName+'</h3> <p>'+items[ActualIndex].artistName+'</p></div>';  

            }
            

    }

    function endedSong(){
        let autoplay = document.getElementById('autoplay').checked;
        if(autoplay==true) {
            ActualIndex += 1;
            playSong();
        }
    }

    function touchstart(event) {
        starttouchX = event.touches[0].clientX;
    }

    function touchend(event,index) {
        const change = starttouchX - event.changedTouches[0].clientX;
        const divData = document.getElementById("divData"+index);
        const divDel = document.getElementById("divDel"+index);
        if (change > screen.width/3){
            divData.classList.add('swipe');
            divDel.classList.add('swipe');
            divDel.addEventListener('click',()=>{ deleteItem(index);}) ;
            
        }else{
            divDel.classList.remove('swipe');
            divData.classList.remove('swipe');
            
        }
        setTimeout(function(){ 
            let divHeight= divData.offsetHeight;
            divDel.style.height = divHeight+"px";
        }, 500);
        
    }

    function deleteItem(index){
        items.splice(index,1);
        createList();
    }

    


}
