document.addEventListener("DOMContentLoaded", () => {

  // 1. 모든 페이지 공통 기능 실행
  initTopbarScroll();
  initScrollTopButton(); 
  initBackgroundMusic();

  // 2. 사이드바가 있는 페이지(About, Library)에서만 실행
  if (document.querySelector(".sidebar")) {
    initScrollSpy();
  }
  
  // 3. 등장 애니메이션 실행
  initScrollReveal();
});

/**
 * 1. 상단바 스크롤 스타일 제어
 */
function initTopbarScroll() {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      topbar.style.background = "rgba(15, 23, 42, 0.95)";
      topbar.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
    } else {
      topbar.style.background = "rgba(15, 23, 42, 0.9)";
      topbar.style.boxShadow = "none";
    }
  });
}

/**
 * 2. 사이드바 스크롤 스파이 (Scroll Spy)
 */
function initScrollSpy() {
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const sections = document.querySelectorAll(".content-section");

  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - window.innerHeight / 3) {
        currentSectionId = section.getAttribute("id");
      }
    });

    sidebarLinks.forEach((link) => {
      link.classList.remove("active-section");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active-section");
      }
    });
  });
}

/**
 * 3. 스크롤 등장 애니메이션 (Intersection Observer)
 */
function initScrollReveal() {
  const targetCards = document.querySelectorAll(".card-section, .library-card, .topic-card, .home-card");
  
  targetCards.forEach(card => card.classList.add("reveal"));

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targetCards.forEach(card => cardObserver.observe(card));
}

/**
 * 4. 맨 위로 가기 (Top) 버튼 제어
 */
function initScrollTopButton() {
  const topBtn = document.getElementById("scrollTopBtn");
  if (!topBtn) return; 

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      topBtn.classList.add("show");
    } else {
      topBtn.classList.remove("show");
    }
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/**
 * 5. 웹사이트 배경음악(BGM) 토글 및 볼륨 제어
 */
function initBackgroundMusic() {
  const bgm = document.getElementById('bgm-audio');
  const toggleBtn = document.getElementById('btn-toggle-play');
  const statusText = document.getElementById('music-status-text');
  const volumeSlider = document.getElementById('volume-slider');

  if (!bgm || !toggleBtn || !volumeSlider || !statusText) return;

  // 초기 볼륨 설정 (슬라이더의 기본값인 0.5로 설정)
  bgm.volume = volumeSlider.value;

  // 재생 상태를 업데이트하는 함수
  const updatePlayerUI = (isPlaying) => {
    if (isPlaying) {
      toggleBtn.innerHTML = "❚❚"; // 일시정지 아이콘 모양
      statusText.textContent = "지금 재생 중...";
      statusText.style.color = "#38bdf8";
    } else {
      toggleBtn.innerHTML = "▶"; // 재생 아이콘 모양
      statusText.textContent = "일시정지됨";
      statusText.style.color = "#94a3b8";
    }
  };

  // 1. 재생/일시정지 버튼 클릭 이벤트
  toggleBtn.addEventListener('click', () => {
    if (bgm.paused) {
      bgm.play()
        .then(() => updatePlayerUI(true))
        .catch((error) => console.log("재생 차단:", error));
    } else {
      bgm.pause();
      updatePlayerUI(false);
    }
  });

  // 2. 볼륨 슬라이더 조절 이벤트 (실시간 반영)
  volumeSlider.addEventListener('input', (e) => {
    bgm.volume = e.target.value;
  });

  // 3. 안전장치: 브라우저 차단을 대비해 사용자가 화면을 처음 클릭할 때 자동 재생 시도
  const playOnFirstClick = () => {
    if (bgm.paused) {
      bgm.play()
        .then(() => {
          updatePlayerUI(true);
          document.removeEventListener('click', playOnFirstClick);
        })
        .catch(() => {});
    }
  };
  document.addEventListener('click', playOnFirstClick);
}