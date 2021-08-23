document.addEventListener('DOMContentLoaded', () => {
    let $places = document.querySelectorAll('[data-dnd-place]'),
        $draggable = document.querySelectorAll('[data-draggable]'),
        isDrag = false,
        $current = null,
        $last = null,
        startX = 0,
        startY = 0;

    $places.forEach(item => {
        item.addEventListener('mouseover', (e) => {
            $draggable = document.querySelectorAll('[data-draggable]');

            $draggable.forEach(item => {
                if (item === e.target) {
                    item.addEventListener('mousedown', (e) => {
                        isDrag = true;
                        $current = e.target.children;
                        $last = e.target;
                        startX = e.clientX;
                        startY = e.clientY;
                    });
                    item.addEventListener('mouseup', (e) => {
                        isDrag = false;
                    });
                }
            });

            //if drag and current drag != emmpty and content inside place is empty
            if (isDrag && $current[0] != null && !e.target.children[0]) {
                //Обнуление дата аттрибутов и присваение текущему
                $places.forEach(i => i.removeAttribute('data-draggable'));
                e.target.setAttribute('data-draggable', '');

                $current[0].style.transform = `translate(0, 0)`;

                e.target.append($current[0]);

                isDrag = false;
                $current = null;
            }
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDrag == true && $current[0]) {
            let posX = e.clientX,
                posY = e.clientY;

            $current[0].style.cssText = `
                transform: translate(${posX - startX}px, ${posY - startY}px);
            `;
        }
    });
});