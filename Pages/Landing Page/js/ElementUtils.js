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

/**
 * Sets the height of an element to a percentage of the viewport height
 * @param {string} id - The element ID
 * @param {number} vhValue - The viewport height percentage (e.g., 100 for 100vh, 80 for 80vh)
 */
export function SetHeightToViewportHeight(id, vhValue)
{
    const element = document.getElementById(id);
    if (element) {
        const heightInPixels = (window.innerHeight * vhValue) / 100;
        element.style.height = heightInPixels + "px";
        element.style.minHeight = heightInPixels + "px";
    }
}

/**
 * Sets the width of an element to a percentage of the viewport width
 * @param {string} id - The element ID
 * @param {number} vwValue - The viewport width percentage (e.g., 100 for 100vw, 80 for 80vw)
 */
export function SetWidthToViewportWidth(id, vwValue)
{
    const element = document.getElementById(id);
    if (element) {
        const widthInPixels = (window.innerWidth * vwValue) / 100;
        element.style.width = widthInPixels + "px";
    }
}
