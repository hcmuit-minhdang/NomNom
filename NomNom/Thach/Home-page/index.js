const track = document.getElementById('track');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');

let currentIndex = 0;
const totalSlides = document.querySelectorAll('.slide').length;

function updateSlidePosition() {
  // Pulls the track up on the Y axis
  track.style.transform = `translateY(-${currentIndex * 100}%)`;
}

downBtn.addEventListener('click', () => {
  // If we haven't reached the end, go to the next slide normally
  if (currentIndex < totalSlides - 1) {
    currentIndex++;
  } else {
    // If we are at the last slide, loop back to the first one (index 0)
    currentIndex = 0;
  }
  updateSlidePosition();
});

upBtn.addEventListener('click', () => {
  // If we haven't reached the start, go up normally
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    // If we are at the first slide (index 0), jump to the last slide
    currentIndex = totalSlides - 1;
  }
  updateSlidePosition();
});