window.addEventListener('scroll', () => {
    let scrollProgress = document.getElementById('scroll-progress-bar');
    let scrollTop = window.scrollY;
    let docHeight = document.body.offsetHeight;
    let winHeight = window.innerHeight;
    let scrollPercent = scrollTop / (docHeight - winHeight);
    scrollProgress.style.width = `${scrollPercent * 100}%`;
});