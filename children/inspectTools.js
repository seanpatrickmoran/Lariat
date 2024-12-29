// const executeIPCfunction = () => {                   //ipc or local functions go here
    // window.api.func();
// };

function swapViews(msg){
    api.signalToMain('transmitMainSwapInspect', '')
};


const clickMap = new Map();
clickMap.set("big-button",swapViews)
document.body.addEventListener('click', function (event) {
    const namedId = event.target.id;
    console.log(namedId)
    if (!(clickMap.has(namedId))){
        return
        }
    if (['big-button',"other_button_name"].includes(namedId)){ //non routed function should be caught.
        console.log('click')
        clickMap.get(namedId)();
        return
    }
    console.log('not big button')
    api.send(`${clickMap.get(event.target.id)}`); //IPC routed functions
});



