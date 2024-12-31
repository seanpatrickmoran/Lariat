// const executeIPCfunction = () => {                   //ipc or local functions go here
    // window.api.func();
// };

function swapViews(msg){
    api.signalToMain('transmitMainSwapInspect', '')
};

function levelsView(msg){
    api.signalToMain('transmitMainLevels', '')
}


const clickMap = new Map();
clickMap.set("big-button",swapViews)
clickMap.set("levels-view-button", levelsView)


document.body.addEventListener('click', function (event) {
    const namedId = event.target.id;
    console.log(namedId)
    if (!(clickMap.has(namedId))){
        return
        }
    if (['big-button',"levels-view-button"].includes(namedId)){ //non routed function should be caught.
        console.log('click')
        clickMap.get(namedId)();
        return
    }
    console.log('not big button')
    api.send(`${clickMap.get(event.target.id)}`); //IPC routed functions
});


//createlevelsWindow


// clickMap.set("levelsBtn", toggleLevels)
