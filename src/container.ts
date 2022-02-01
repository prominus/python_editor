
const container = document.getElementById("container")! as HTMLDivElement;
if (container) {
    container.addEventListener('keydown', KeyCheck);
}
function KeyCheck(this: HTMLDivElement, ev: KeyboardEvent) {
    // console.log(`${ev.key}`);
    if (ev.key === "Enter" && ev.altKey === true) {
        ev.preventDefault();

        // TODO! add logic to exported text
        console.log(this.innerText);
        // const innerDialog = document.querySelector("#container > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text");
        // const elementsCount = innerDialog?.childElementCount;
        // const newLineStr = `<div style="top:${19*((elementsCount ? elementsCount : 1)-1)}px;height:19px;" class="view-line"><span><span></span></span></div>`;
        // const div = new DOMParser().parseFromString(newLineStr, "text/html")?.body.firstChild;
        // console.log(div);
        // console.log(innerDialog);
        // if (innerDialog && div) {
        //     innerDialog.appendChild(div);
        // }
    }
}
