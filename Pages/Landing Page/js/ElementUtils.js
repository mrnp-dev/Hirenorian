export function SetMaxWidthToWindowWidth(id)
{
    const element = document.getElementById(id);
    element.style.maxWidth = window.innerWidth + "px";
}

export function SetMaxHeightToWindowHeight(id)
{
    const element = document.getElementById(id);
    element.style.maxHeight = window.innerHeight + "px";
}