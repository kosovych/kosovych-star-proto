import gsap from 'gsap';

const menuBtn = document.getElementById('menu');
const constellation = document.getElementById('constellation');


const state = {
    isMenuStateBig: true,
    currentScale: 1,
    currentX: null,
    currentY: null,
    focusedStarId: null,
};

function setDOMReacts() {
    console.log('test');
    
    Array.from(document.querySelectorAll('.star')).forEach(star => {
        const id = star.id;
        const DOMReact = star.getBoundingClientRect();
        state[id] = DOMReact;
    });
}
setDOMReacts();

goToStar(document.getElementById('star-1'), 0);
constellation.addEventListener('click', starHandler, true)

menuBtn.addEventListener('click', () => {
    state.isMenuStateBig && minimyzeConstellation();
});

function starHandler(event) {
    let star = event.target.closest('.star');
    if (!star) return;
    if (!constellation.contains(star)) return;
    if(state.isMenuStateBig) return;
    goToStar(star);
}

function goToStar(star, duration = 0.5) {
    state.focusedStarId !== star.id
    state.focusedStarId = star.id
    const originalDOMReact = state[star.id];
    let newX;
    state.currentScale = 1;
    state.currentY =  - originalDOMReact.y + (window.innerHeight / 2 - 150);
    const transformObject = {
        scale: state.currentScale,
        y: state.currentY,
        duration,
        onComplete: () => {
            if(!state[`gsap${state.focusedStarId}`]) {
                state[`gsap${star.id}`] = gsap.to(
                    `#${state.focusedStarId} .star-inner`,
                    {
                        boxShadow: '0 0 18px 5px rgba(256, 256, 256, 1), 0 0 18px 150px rgba(256, 256, 256, 1)',
                        duration: 1,
                        repeat: -1,
                        opacity: '0'
                    }
                    );
            } else {
                state[`gsap${state.focusedStarId}`] = state[`gsap${state.focusedStarId}`].play();
            }
        }
    }

    if(originalDOMReact.x > 0) {
        newX = (window.innerWidth - originalDOMReact.x * 2) / 2 - 150;
    } else {
        newX = (Math.abs(originalDOMReact.x) + window.innerWidth / 2) - 150;
    }
    transformObject.x = newX;
    state.isMenuStateBig = true;
    gsap.to('#constellation', transformObject);
}

function minimyzeConstellation() {
    const windowInnerHeight = window.innerHeight;
    const constellationHeight = constellation.offsetHeight;
    const difference = 1 / (constellationHeight / windowInnerHeight);
    state.currentScale = difference;
    state.isMenuStateBig = false;
    state.currentX = 0;
    state.currentY = 0;
    console.log(state[`gsap${state.focusedStarId}`]);
    state[`gsap${state.focusedStarId}`] = state[`gsap${state.focusedStarId}`].pause();
    return gsap.to('#constellation', {scale: state.currentScale, x: state.currentX, y:state.currentY, duration: 0.5});
}