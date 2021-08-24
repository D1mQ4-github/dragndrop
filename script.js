document.addEventListener('DOMContentLoaded', () => {

    const createLevel = ({ settings }) => {
        const $wrapper = document.querySelector('[data-dnd-wrapper]'), //get parent element of drop places
            $objectsWrapper = document.querySelector('[data-dnd-objects]'), //get the game objects wrapper
            $objectsFinal = document.querySelector('[data-dnd-final]');

        //draw the game items
        settings.forEach(item => {
            //make a template for game object
            const tmpStart = `
                <div class="place" data-dnd-place data-draggable>
                    <div class="box" data-dnd-is="${item.object_name}">
                        <img src="${item.object_src}" />
                    </div>
                </div>
            `;

            const tmpFinal = `
                <div class="place" data-dnd-place data-dnd-is="${item.object_name}" style="filter: brightness(0);background-image: url(${item.object_src});">
                </div>
            `;

            //append to the game object container
            $objectsWrapper.innerHTML += tmpStart;
            //
            $objectsFinal.innerHTML += tmpFinal;
        });

        let $places = document.querySelectorAll('[data-dnd-place]'), //get all drop places
            isDrag = false, //drag indicator on mousedown
            $current = null, //content dropped item
            $last = null, //last position of dropped item for back to last place when user drop outside of places
            startX = 0, //first click position X
            startY = 0; //first click position Y

        const onMouseUp = (e) => {
            const target = e.target;

            isDrag = false;

            //if dragged content is not empty and place where we try to set is empty
            if ($current != null && !target.children[0]) {

                //set current place data-attr
                target.setAttribute('data-draggable', '');

                //set content pos to current place
                $current[0].style.transform = `translate(0, 0)`;
                $current[0].style.animation = `stacked .4s`;

                //push content to current place
                target.append($current[0]);

                //if current pos data-is = the same data name that place
                if (target.children[0].getAttribute('data-dnd-is') == target.getAttribute('data-dnd-is')) {
                    target.style.filter = 'brightness(1)';
                    target.style.background = 'none';
                    target.removeAttribute('data-draggable');
                    console.log(target);
                }

                //check if game is end (if data-draggable length <= 1)
                if (document.querySelectorAll('[data-draggable]').length <= 1) {
                    $wrapper.style.transition = '.4s';
                    $wrapper.style.opacity = '0';

                    setTimeout(() => {
                        $wrapper.style.opacity = '1';
                        $wrapper.innerHTML = `<h1 style="text-align: center">Level complete</h1>`;
                    }, 1000);
                }

                //reset settings
                isDrag = false;
                $current = null;
            }

            //return to prev position if try to drop in the non-empty place
            if (target.getAttribute('data-draggable') != null && $current != null) {
                $current[0].style.transform = `translate(0, 0)`;
            }

            //return back if mouseup in non-place elements
            if (!target.getAttribute('data-dnd-place') && $current != null) {
                $current[0].style.transform = `translate(0, 0)`;
            }

            //Clear all prev places
            $places.forEach(i => {
                if (!i.children[0]) {
                    i.removeAttribute('data-draggable');
                }
            });
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
            }
        }

        //mousedown listener
        $wrapper.addEventListener('mousedown', onMouseDown);

        document.addEventListener('mouseup', onMouseUp);
    }

    createLevel({
        settings: [{
                object_name: 'cow',
                object_src: './images/cow.svg'
            },
            {
                object_name: 'duck',
                object_src: './images/duck.svg'
            },
            {
                object_name: 'chicken',
                object_src: './images/chicken.svg'
            },
            {
                object_name: 'chicken',
                object_src: './images/chicken.svg'
            }
        ]
    });
});