/**
 * Get offset of element relative to document.
 * 
 * @param {element} el 
 * @return {Object} The top and left offset of the element relative to the document
 */
export function getElementOffset(el) {
    let top = 0;
    let left = 0;
    let element = el;

    // Loop through the DOM tree
    // and add it's parent's offset to get page offset
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top,
        left
    };
}

/**
 * Remove the specified parameter from the current URL.
 * 
 * @param {string} name  
 */
export function removeParameterFromUrl(name) {
    let url = window.location.href,
        newUrl = url.split("?")[0],
        param,
        params_arr = [],
        queryString = (url.indexOf("?") !== -1) ? url.split("?")[1] : "";

    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (let i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === name) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) {
            newUrl = newUrl + "?" + params_arr.join("&");
        }
    }
    
    window.history.replaceState({path: newUrl}, '', newUrl);
}

export function setContentHeight() {
    const headerElement = document.querySelector('.header-wrapper');
    const headerBottom = headerElement.offsetTop + headerElement.offsetHeight;
    document.querySelector(':root').style.setProperty('--content-height', window.innerHeight - headerBottom + 'px');
}

export function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Wrapper for Object.fromEntries to work on older browsers
 */
export const fromEntries = Object.fromEntries||function(e){for(var r,n=("entries"in e?e.entries():e),t={};(r=n.next())&&!r.done;){var i=r.value;Object.defineProperty(t,i[0],{configurable:!0,enumerable:!0,writable:!0,value:i[1]})}return t};