document.addEventListener('DOMContentLoaded', () => {
    let $wrapper = document.querySelector('[data-dnd-place]').parentElement, //get parent element of drop places
        $places = document.querySelectorAll('[data-dnd-place]'), //get all drop places
        isDrag = false, //drag indicator on mousedown
        $current = null, //content dropped item
        $last = null, //last position of dropped item for back to last place when user drop outside of places
        startX = 0, //first click position X
        startY = 0; //first click position Y

    const onMouseOver = (e) => {
        const target = e.target;

        // if user is drag and current drag el != empty and content inside place is empty
        if (isDrag && $current[0] != null && !target.children[0]) {
            //Clear all prev places
            $places.forEach(i => i.removeAttribute('data-draggable'));
            //set current place data-attr
            target.setAttribute('data-draggable', '');

            //set content pos to current place
            $current[0].style.transform = `translate(0, 0)`;

            //push content to current place
            target.append($current[0]);

            //reset settings
            isDrag = false;
            $current = null;
        }
    }

    const onMouseUp = (e) => {
        const target = e.target;

        isDrag = false;

        if (target == $wrapper && $current != null) {
            $current[0].style.transform = `translate(0, 0)`;
        }
        $wrapper.removeEventListener('mouseover', onMouseOver);
    }

    const onMouseDown = (e) => {
        const target = e.target;

        //if mousedown on item with content (dropped)
        if (target.getAttribute('data-draggable') != null) {
            //switch to true for checking in mousemove
            isDrag = true;
            $current = target.children;
            $last = target;
            startX = e.clientX;
            startY = e.clientY;

            const onMouseMove = (e) => {
                //checking if we mousedown on drapped item and our item have content
                if (isDrag == true && $current != null) {
                    //calculating position with first click pos and pos of an mousemove
                    let posX = e.clientX - startX,
                        posY = e.clientY - startY;

                    $current[0].style.cssText = `
                            transform: translate(${posX}px, ${posY}px);
                        `;
                }
            }

            //starts working with isDrag === true
            //move the dragged content inside wrapper area
            $wrapper.addEventListener('mousemove', onMouseMove);

            //Checking which place is empty for drop
            $wrapper.addEventListener('mouseover', onMouseOver);
        }
    }

    //mousedown listener
    $wrapper.addEventListener('mousedown', onMouseDown);

    document.addEventListener('mouseup', onMouseUp);
});