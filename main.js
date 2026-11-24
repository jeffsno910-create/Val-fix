/*
 * Shared interaction engine for the Valentine website.
 * Each feature is initialized only on the page that contains its elements.
 */
(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const body = document.body;
    const START_DATE = new Date(2025, 1, 24, 0, 0, 0).getTime();
    const VIDEO_COUNT = 70;

    function safePlay(videoOrAudio) {
        if (!videoOrAudio || typeof videoOrAudio.play !== "function") return;
        const playAttempt = videoOrAudio.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
            playAttempt.catch(() => {
                // Browsers may block autoplay. The visible media controls remain available.
            });
        }
    }

    function updateElapsedTimer(target, label = "") {
        if (!target) return;

        const elapsed = Math.max(0, Date.now() - START_DATE);
        const days = Math.floor(elapsed / 86400000);
        const hours = Math.floor((elapsed / 3600000) % 24);
        const minutes = Math.floor((elapsed / 60000) % 60);
        const seconds = Math.floor((elapsed / 1000) % 60);

        if (label === "main") {
            target.textContent = `💗 ${days} Days  💞 ${hours} Hours  💘 ${minutes} Minutes  💓 ${seconds} Seconds`;
        } else {
            target.textContent = `${days} Days  ${hours} Hours  ${minutes} Minutes  ${seconds} Seconds`;
        }
    }

    function addStyle(cssText) {
        const style = document.createElement("style");
        style.textContent = cssText;
        document.head.appendChild(style);
    }

    function makeFloatingEmoji(emoji, options = {}) {
        const item = document.createElement("span");
        item.textContent = emoji;
        item.setAttribute("aria-hidden", "true");
        Object.assign(item.style, {
            position: "fixed",
            left: `${Math.random() * 94}%`,
            top: options.fromTop ? "-30px" : (options.fromBottom ? "auto" : `${Math.random() * 90}%`),
            bottom: options.fromBottom ? "-30px" : "auto",
            fontSize: `${options.size || 18 + Math.random() * 16}px`,
            opacity: options.opacity || "0.85",
            pointerEvents: "none",
            zIndex: String(options.zIndex || 50),
            transition: `transform ${options.duration || 4}s linear, opacity ${options.duration || 4}s linear`
        });
        document.body.appendChild(item);

        requestAnimationFrame(() => {
            item.style.transform = options.fromTop
                ? `translateY(${window.innerHeight + 80}px) rotate(${Math.random() * 40 - 20}deg)`
                : `translateY(-${window.innerHeight + 80}px) rotate(${Math.random() * 40 - 20}deg)`;
            item.style.opacity = "0";
        });
        window.setTimeout(() => item.remove(), (options.duration || 4) * 1000 + 100);
        return item;
    }

    /* -----------------------------
       Shared intro and secret button
    ------------------------------ */
    const introOverlay = $("#introOverlay");
    const enterButton = $("#enterUniverseBtn");

    if (introOverlay && enterButton) {
        enterButton.addEventListener("click", () => {
            introOverlay.style.opacity = "0";
            introOverlay.setAttribute("aria-hidden", "true");
            window.setTimeout(() => {
                introOverlay.style.display = "none";
            }, 1000);
        });
    }

    const secretButton = $("#secretButton");
    const secretMessage = $("#secretMessage");
    if (secretButton && secretMessage) {
        secretButton.addEventListener("click", () => {
            secretMessage.style.display = "block";
            secretMessage.style.animation = "fadeIn 1s ease";
            secretButton.setAttribute("aria-expanded", "true");
        });
    }

    addStyle(`
        @keyframes floatUp {
            0% { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-110vh); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(.8); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes rainFall {
            from { transform: translateY(0); }
            to { transform: translateY(110vh); }
        }
    `);

    function emojiBurst() {
        const emojis = ["💗", "💞", "💘", "💕", "💓", "💝", "🎀", "✨"];
        for (let i = 0; i < 25; i += 1) {
            makeFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)], {
                size: 20 + Math.random() * 25,
                duration: 2,
                opacity: "1",
                zIndex: 900
            });
        }
    }

    function rainEffect() {
        for (let i = 0; i < 35; i += 1) {
            const drop = document.createElement("span");
            drop.textContent = "🌧️";
            drop.setAttribute("aria-hidden", "true");
            Object.assign(drop.style, {
                position: "fixed",
                left: `${Math.random() * 100}%`,
                top: "-30px",
                fontSize: "14px",
                pointerEvents: "none",
                zIndex: "900",
                animation: `rainFall ${3 + Math.random() * 2}s linear forwards`
            });
            document.body.appendChild(drop);
            window.setTimeout(() => drop.remove(), 5200);
        }
    }

    document.addEventListener("keydown", (event) => {
        const target = event.target;
        if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;

        const key = event.key.toLowerCase();
        if (key === "p") {
            window.alert("💗 P is for Pritikah. P is for Perfect. P is for My Person. 💗");
            emojiBurst();
        } else if (key === "b") {
            body.classList.toggle("blue-mode");
            window.alert(body.classList.contains("blue-mode")
                ? "💙 Blue mode activated for Ammu 💙"
                : "💗 Pink mode restored 💗");
        } else if (key === "r") {
            rainEffect();
        }
    });

    if (body.classList.contains("main-page")) {
        const loveTimer = $("#love-timer");
        const updateMainTimer = () => updateElapsedTimer(loveTimer, "main");
        updateMainTimer();
        window.setInterval(updateMainTimer, 1000);

        // Keep the ambient effects light so they do not overwhelm the page on phones.
        const ambienceEmojis = ["🥺", "💗", "💞", "💘", "💕", "✨", "🎀", "💙"];
        window.setInterval(() => makeFloatingEmoji("💗", {
            fromBottom: true, duration: 6, size: 15 + Math.random() * 18, opacity: "0.75", zIndex: 40
        }), 1450);
        window.setInterval(() => makeFloatingEmoji("✨", {
            duration: 5, size: 12 + Math.random() * 8, opacity: "0.45", zIndex: 35
        }), 2300);
        window.setInterval(() => {
            const emoji = ambienceEmojis[Math.floor(Math.random() * ambienceEmojis.length)];
            makeFloatingEmoji(emoji, { fromBottom: true, duration: 3, size: 18, opacity: "0.45", zIndex: 40 });
        }, 5200);

        const song = $("#loveSong");
        if (song) {
            let attemptedPlayback = false;
            document.addEventListener("pointerdown", () => {
                if (attemptedPlayback || !song.paused) return;
                attemptedPlayback = true;
                safePlay(song);
            }, { once: true, passive: true });
        }
    }

    if (body.classList.contains("main-page")) {
        document.addEventListener("dblclick", () => {
            window.alert("🥺 You double clicked? That means double love!");
            emojiBurst();
        });

        if (new Date().getDate() === 26) {
            window.setTimeout(emojiBurst, 700);
        }
    }

    /* -----------------------------
       Constellation / star page
    ------------------------------ */
    const skyVideo = $("#skyVideoPlayer");
    if (skyVideo) {
        const constellationNodes = $$(".constellation-node");
        const starGrid = $(".star-counter-grid");
        const moon = $(".moon");
        const portal = $(".portal-frame");
        const skyField = $(".sky-field");

        // The page promises 70 stars; fill any missing indicators in the original markup.
        if (starGrid) {
            const currentCount = $$(".star-indicator", starGrid).length;
            for (let number = currentCount + 1; number <= VIDEO_COUNT; number += 1) {
                const star = document.createElement("span");
                star.className = "star-indicator";
                star.dataset.edit = String(number);
                star.setAttribute("aria-label", `Memory ${number}`);
                starGrid.appendChild(star);
            }
        }
        const starIndicators = $$(".star-indicator", starGrid || document);

        function igniteStars(index) {
            starIndicators.forEach((star) => {
                star.classList.toggle("active", Number(star.dataset.edit) === index);
            });
        }

        function cosmicPulse() {
            if (!portal) return;
            portal.classList.add("portal-pulse");
            window.setTimeout(() => portal.classList.remove("portal-pulse"), 850);
        }

        function createStarExplosion(originNode) {
            if (!originNode || !skyField) return;
            const fieldRect = skyField.getBoundingClientRect();
            const nodeRect = originNode.getBoundingClientRect();
            const centerX = nodeRect.left - fieldRect.left + nodeRect.width / 2;
            const centerY = nodeRect.top - fieldRect.top + nodeRect.height / 2;

            for (let i = 0; i < 18; i += 1) {
                const spark = document.createElement("span");
                spark.textContent = "✨";
                spark.setAttribute("aria-hidden", "true");
                Object.assign(spark.style, {
                    position: "absolute",
                    left: `${centerX}px`,
                    top: `${centerY}px`,
                    fontSize: `${10 + Math.random() * 18}px`,
                    pointerEvents: "none",
                    zIndex: "3",
                    transition: "transform 900ms ease, opacity 900ms ease"
                });
                skyField.appendChild(spark);
                requestAnimationFrame(() => {
                    spark.style.transform = `translate(${Math.random() * 180 - 90}px, ${Math.random() * 180 - 90}px) scale(0)`;
                    spark.style.opacity = "0";
                });
                window.setTimeout(() => spark.remove(), 950);
            }
        }

        function playRandomEdit() {
            const selectedEdit = Math.floor(Math.random() * VIDEO_COUNT) + 1;
            skyVideo.src = `videos/edit${selectedEdit}.mp4`;
            skyVideo.load();
            safePlay(skyVideo);
            igniteStars(selectedEdit);
            cosmicPulse();
            return selectedEdit;
        }

        constellationNodes.forEach((node) => {
            node.addEventListener("click", () => {
                node.classList.add("selected");
                window.setTimeout(() => node.classList.remove("selected"), 650);
                playRandomEdit();
                createStarExplosion(node);
            });
        });

        function createShootingStar() {
            const star = document.createElement("span");
            star.textContent = "🌠";
            star.setAttribute("aria-hidden", "true");
            Object.assign(star.style, {
                position: "fixed",
                left: `${Math.random() * 95}%`,
                top: "0",
                fontSize: "20px",
                pointerEvents: "none",
                zIndex: "20",
                transition: "transform 2s linear, opacity 2s linear"
            });
            document.body.appendChild(star);
            requestAnimationFrame(() => {
                star.style.transform = "translate(-180px, 65vh)";
                star.style.opacity = "0";
            });
            window.setTimeout(() => star.remove(), 2100);
        }

        function floatingCosmicDust() {
            makeFloatingEmoji("✨", {
                duration: 2.5,
                size: 10 + Math.random() * 6,
                opacity: "0.35",
                zIndex: 15
            });
        }

        if (moon) {
            skyVideo.addEventListener("play", () => moon.classList.add("moon-awake"));
            skyVideo.addEventListener("pause", () => moon.classList.remove("moon-awake"));
        }

        document.addEventListener("keydown", (event) => {
            const target = event.target;
            if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
            const key = event.key.toLowerCase();

            if (key === "a") {
                window.alert("💗 Ammu Mode Activated 💗");
                createStarExplosion(constellationNodes[0]);
            } else if (key === "m" && moon) {
                moon.classList.add("moon-awake");
                window.alert("🌙 Moon Glow Intensified 🌙");
            } else if (key === "s") {
                playRandomEdit();
            }
        });

        // A small initial shower, then occasional stars; avoid flooding low-powered phones.
        for (let i = 0; i < 7; i += 1) {
            window.setTimeout(createShootingStar, i * 260);
        }
        window.setInterval(createShootingStar, 4600);
        window.setInterval(floatingCosmicDust, 1900);
    }

    /* -----------------------------
       70-edit cinema page
    ------------------------------ */
    const loveFilmPlayer = $("#loveFilmPlayer");
    if (loveFilmPlayer) {
        let currentEdit = 1;
        const cinemaFrame = $(".film-cinema-frame");
        const nextVideoPreloader = document.createElement("video");
        nextVideoPreloader.preload = "metadata";
        let advancing = false;

        function pulseFrame() {
            if (!cinemaFrame) return;
            cinemaFrame.classList.add("film-frame-pulse");
            window.setTimeout(() => cinemaFrame.classList.remove("film-frame-pulse"), 900);
        }

        function createFloatingReaction() {
            const reactions = ["💗", "💞", "💘", "🎀", "💟", "✨"];
            makeFloatingEmoji(reactions[Math.floor(Math.random() * reactions.length)], {
                fromBottom: true, duration: 4, size: 24, opacity: "0.8", zIndex: 30
            });
        }

        function preloadVideo(index) {
            const nextIndex = index > VIDEO_COUNT ? 1 : index;
            nextVideoPreloader.src = `videos/edit${nextIndex}.mp4`;
            nextVideoPreloader.load();
        }

        function playCurrentEdit() {
            if (advancing) return;
            advancing = true;
            if (currentEdit > VIDEO_COUNT) currentEdit = 1;

            const playingIndex = currentEdit;
            currentEdit += 1;
            loveFilmPlayer.src = `videos/edit${playingIndex}.mp4`;
            loveFilmPlayer.load();
            safePlay(loveFilmPlayer);
            pulseFrame();
            createFloatingReaction();

            if (cinemaFrame) {
                cinemaFrame.classList.toggle("edit-26-glow", playingIndex === 26);
            }
            preloadVideo(currentEdit);
            window.setTimeout(() => { advancing = false; }, 500);
        }

        loveFilmPlayer.addEventListener("ended", playCurrentEdit);
        loveFilmPlayer.addEventListener("error", () => {
            advancing = false;
            // Keep the page usable if a video has not been uploaded yet.
        });

        const startCinema = () => {
            if (!loveFilmPlayer.dataset.started) {
                loveFilmPlayer.dataset.started = "true";
                playCurrentEdit();
            }
        };
        if (document.readyState === "complete") startCinema();
        else window.addEventListener("load", startCinema, { once: true });

        window.setInterval(createFloatingReaction, 6500);
    }

    /* -----------------------------
       Surprise page interactions
    ------------------------------ */
    if (body.classList.contains("surprise-body")) {
        const timerParts = {
            days: $("#surpriseDays"),
            hours: $("#surpriseHours"),
            minutes: $("#surpriseMinutes"),
            seconds: $("#surpriseSeconds")
        };

        function updateSurpriseTimer() {
            const elapsed = Math.max(0, Date.now() - START_DATE);
            if (timerParts.days) timerParts.days.textContent = Math.floor(elapsed / 86400000);
            if (timerParts.hours) timerParts.hours.textContent = Math.floor((elapsed / 3600000) % 24);
            if (timerParts.minutes) timerParts.minutes.textContent = Math.floor((elapsed / 60000) % 60);
            if (timerParts.seconds) timerParts.seconds.textContent = Math.floor((elapsed / 1000) % 60);
        }
        updateSurpriseTimer();
        window.setInterval(updateSurpriseTimer, 1000);

        function createConfetti() {
            const options = ["💗", "🎀", "💞", "✨", "🎁", "💘"];
            makeFloatingEmoji(options[Math.floor(Math.random() * options.length)], {
                fromTop: true, duration: 4, size: 20 + Math.random() * 8, opacity: "0.9", zIndex: 100
            });
        }

        for (let i = 0; i < 24; i += 1) {
            window.setTimeout(createConfetti, i * 130);
        }

        $$(".gift-box").forEach((box) => {
            box.addEventListener("click", () => {
                for (let i = 0; i < 8; i += 1) createConfetti();
                box.classList.add("gift-box-open");
                window.setTimeout(() => box.classList.remove("gift-box-open"), 450);
            });
        });

        const letter = $(".letter-card");
        if (letter) {
            letter.addEventListener("click", () => {
                letter.classList.add("letter-glow");
                window.setTimeout(() => letter.classList.remove("letter-glow"), 850);
            });
        }

        const teddySection = $(".teddy-grid");
        if (teddySection) {
            teddySection.addEventListener("click", () => {
                teddySection.classList.add("teddy-bounce");
                window.setTimeout(() => teddySection.classList.remove("teddy-bounce"), 450);
            });
        }

        let lastScrollHeart = 0;
        window.addEventListener("scroll", () => {
            const now = Date.now();
            if (now - lastScrollHeart < 900) return;
            lastScrollHeart = now;
            makeFloatingEmoji("💗", {
                fromTop: true, duration: 5, size: 18 + Math.random() * 5, opacity: "0.8", zIndex: 100
            });
        }, { passive: true });

        const loveMessages = [
            "You are my forever 💗",
            "My blue sky 💙",
            "My rainy season 🌧",
            "My sweet vanilla 🍦",
            "Bike rides with you 🏍",
            "Ammu forever 🎀"
        ];

        function randomLovePopup() {
            // Avoid stacking multiple messages on slower phones.
            const previous = $(".random-love-popup");
            if (previous) previous.remove();

            const popup = document.createElement("div");
            popup.className = "random-love-popup";
            popup.textContent = loveMessages[Math.floor(Math.random() * loveMessages.length)];
            document.body.appendChild(popup);
            requestAnimationFrame(() => popup.classList.add("visible"));
            window.setTimeout(() => popup.classList.remove("visible"), 3800);
            window.setTimeout(() => popup.remove(), 4800);
        }

        window.setTimeout(randomLovePopup, 9000);
        window.setInterval(randomLovePopup, 18000);
    }
})();
