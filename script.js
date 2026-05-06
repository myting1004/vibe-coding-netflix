(function () {
    'use strict';

    const POSTER_SIZE = 'w500';
    const BACKDROP_SIZE = 'original';

    const elements = {
        posters: document.getElementById('posters'),
        hero: document.getElementById('hero'),
        heroTitle: document.getElementById('heroTitle'),
        heroOverview: document.getElementById('heroOverview'),
        header: document.querySelector('.header')
    };

    function buildNowPlayingUrl(page = 1) {
        const params = new URLSearchParams({
            api_key: CONFIG.API_KEY,
            language: CONFIG.LANGUAGE,
            region: CONFIG.REGION,
            page: String(page)
        });
        return `${CONFIG.BASE_URL}/movie/now_playing?${params.toString()}`;
    }

    function getImageUrl(path, size) {
        if (!path) return '';
        return `${CONFIG.IMAGE_BASE_URL}/${size}${path}`;
    }

    async function fetchNowPlayingMovies() {
        const response = await fetch(buildNowPlayingUrl(1));
        if (!response.ok) {
            throw new Error(`API 요청 실패: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    }

    function renderHero(movie) {
        if (!movie) return;
        const backdrop = movie.backdrop_path || movie.poster_path;
        if (backdrop) {
            elements.hero.style.backgroundImage = `url(${getImageUrl(backdrop, BACKDROP_SIZE)})`;
        }
        elements.heroTitle.textContent = movie.title || movie.original_title || '제목 없음';
        elements.heroOverview.textContent = movie.overview || '소개 정보가 없습니다.';
    }

    function createPosterElement(movie) {
        const article = document.createElement('article');
        article.className = 'poster';
        article.setAttribute('role', 'button');
        article.setAttribute('tabindex', '0');
        article.setAttribute('aria-label', `${movie.title} 상세 보기`);

        const posterUrl = getImageUrl(movie.poster_path, POSTER_SIZE);
        const title = movie.title || movie.original_title || '제목 없음';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
        const releaseDate = movie.release_date || '';

        if (posterUrl) {
            const img = document.createElement('img');
            img.className = 'poster__img';
            img.src = posterUrl;
            img.alt = `${title} 포스터`;
            img.loading = 'lazy';
            article.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'poster__img poster__img--placeholder';
            placeholder.textContent = title;
            article.appendChild(placeholder);
        }

        const info = document.createElement('div');
        info.className = 'poster__info';
        info.innerHTML = `
            <h4 class="poster__title">${escapeHtml(title)}</h4>
            <div class="poster__meta">
                <span class="poster__rating">★ ${rating}</span>
                <span class="poster__date">${releaseDate}</span>
            </div>
        `;
        article.appendChild(info);

        article.addEventListener('click', () => onPosterClick(movie));
        article.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onPosterClick(movie);
            }
        });

        return article;
    }

    function onPosterClick(movie) {
        renderHero(movie);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderPosters(movies) {
        elements.posters.innerHTML = '';
        if (movies.length === 0) {
            elements.posters.innerHTML = '<div class="loading">표시할 영화가 없습니다.</div>';
            return;
        }
        const fragment = document.createDocumentFragment();
        movies.forEach((movie) => {
            fragment.appendChild(createPosterElement(movie));
        });
        elements.posters.appendChild(fragment);
    }

    function renderError(message) {
        elements.posters.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
        elements.heroTitle.textContent = '영화를 불러올 수 없습니다';
        elements.heroOverview.textContent = message;
    }

    function attachHeaderScrollEffect() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            window.requestAnimationFrame(() => {
                if (window.scrollY > 60) {
                    elements.header.classList.add('header--scrolled');
                } else {
                    elements.header.classList.remove('header--scrolled');
                }
                ticking = false;
            });
            ticking = true;
        });
    }

    async function init() {
        if (!CONFIG || !CONFIG.API_KEY) {
            renderError('API 키가 설정되지 않았습니다. config.js 를 확인해주세요.');
            return;
        }

        attachHeaderScrollEffect();

        try {
            const movies = await fetchNowPlayingMovies();
            if (movies.length === 0) {
                renderError('현재 상영 중인 영화 정보를 가져올 수 없습니다.');
                return;
            }
            renderHero(movies[0]);
            renderPosters(movies);
        } catch (error) {
            console.error(error);
            renderError(`데이터를 불러오는 중 오류가 발생했습니다. (${error.message})`);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
