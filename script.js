document.addEventListener("DOMContentLoaded", function () {
    var noise = new SimplexNoise();
    let isAnimating = false;
    let animationFrameId = null;
    var group = new THREE.Group();
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    let context = null;
    let analyser = null;
    let wave = null;
    let dataArray;
    let plane;
    let plane2;
    let ball;
    let sceneCreated = false;

    let playlist = [
        { name: "Across the Stars", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Across+the+Stars.mp3" },
        { name: "Alien Planet Showdown", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Alien+Planet+Showdown.wav" },
        { name: "Back Against the Wall", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Back+Against+the+Wall.mp3" },
        { name: "Back to the Wall", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Back+to+the+Wall.wav" },
        { name: "Back Room of Space", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Back+Room+of+Space.mp3" },
        { name: "Back Room of Space", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Back+Room+of+Space.wav" },
        { name: "Binary Love", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Binary+Love.mp3" },
        { name: "Cosmic Boss", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Cosmic+Boss.mp3" },
        { name: "Dark Matter Dreams", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Dark+Matter+Dreams.mp3" },
        { name: "Draw Something", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Draw+Something.mp3" },
        { name: "Draw Something", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Draw+Something.wav" },
        { name: "Drifting Away", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Drifting+Away.mp3" },
        { name: "Echoes in the Void", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Echoes+in+the+Void.mp3" },
        { name: "Fangs and Fire Acoustic", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Fangs+and+Fire+Acoustic.mp3" },
        { name: "Fangs and Fire", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Fangs+and+Fire.mp3" },
        { name: "Five Faction War", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Five+Faction+War.mp3" },
        { name: "Five Faction War", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Five+Faction+War.wav" },
        { name: "Future World", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Future+World.mp3" },
        { name: "Future World", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Future+World.mp3" },
        { name: "Galactic Chicas", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Galactic+Chicas.mp3" },
        { name: "Galactic Flex", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Galactic+Flex.mp3" },
        { name: "Guitars and Blades", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Guitars+and+Blades.wav" },
        { name: "Hyperion Matter Drive", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Hyperion+Matter+Drive.mp3" },
        { name: "Let's Take a Spacewalk", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Let%E2%80%99s+Take+a+Spacewalk.mp3" },
        { name: "Let's Take a Space Walk", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Let's+Takes+a+Space+Walk.wav" },
        { name: "Lightspeed Flow", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Lightspeed+Flow.mp3" },
        { name: "Lower Bright City", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Lower+Bright+City.mp3" },
        { name: "Marauder Space Marauder", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Marauder+space+marauder.mp3" },
        { name: "March of the Stars Acoustic", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/March+of+the+Stars+Acoustic.mp3" },
        { name: "March of the Stars", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/March+of+the+Stars.mp3" },
        { name: "Metal Rebellion Acoustic", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Metal+Rebellion+Acoustic.mp3" },
        { name: "Metal Rebellion", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Metal+Rebellion.mp3" },
        { name: "Neon Dominion Acoustic", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Neon+Dominion+Acoustic.mp3" },
        { name: "Neon Dominion", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Neon+Dominion.mp3" },
        { name: "Pre Third War", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Pre+Third+War.wav" },
        { name: "Run the Stars", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Run+the+Stars.mp3" },
        { name: "Scars and Stardust", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Scars+and+Stardust.mp3" },
        { name: "Sci-fi City Groove", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Sci-fi+city+groove.mp3" },
        { name: "Sci-Fi City Groove", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Sci-Fi+City+Groove.wav" },
        { name: "Smoke and Lasers", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Smoke+and+Lasers.mp3" },
        { name: "Smoke and Lasers", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Smoke+and+Lasers.wav" },
        { name: "Solar Flare", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Solar+Flare.mp3" },
        { name: "Space Babes", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Space+Babes.mp3" },
        { name: "Spaceship Porch", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Spaceship+Porch.mp3" },
        { name: "Spaceship Porch", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Spaceship+Porch.wav" },
        { name: "Spkied Hair and Cowboy Boots", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Spkied+Hair+and+Cowboy+Boots.wav" },
        { name: "Starlight Renegade", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Starlight+Renegade.mp3" },
        { name: "Starlit Rendezvous", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Starlit+Rendezvous.mp3" },
        { name: "The Ballad of the Starborn Crew", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/The+Ballad+of+the+Starborn+Crew.mp3" },
        { name: "The Second War", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/The+Second+War.wav" },
        { name: "Vibes of Tomorrow", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Vibes+of+Tomorrow.mp3" },
        { name: "Vibes of Tomorrow", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Vibes+of+Tomorrow.wav" },
        { name: "Wayfarer's Light Acoustic", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wayfarer%E2%80%99s+Light+Acoustic.mp3" },
        { name: "Wayfarer's Light", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wayfarer%E2%80%99s+Light.mp3" },
        { name: "Weightless", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Weightless.mp3" },
        { name: "Wild Wild Space", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wild+Wild+Space.mp3" },
        { name: "Wild Wild Space", src: "https://the-tales.s3.us-east-1.amazonaws.com/NewMusic/Wild+Wild+Space.wav" }

    ];

    let currentTrackIndex = 0;
    const audio = document.getElementById("audio");
    const nowPlaying = document.getElementById("nowPlaying");
    const upNext = document.getElementById("upNext");
    const playlistElement = document.getElementById("playlist");
    const playlistUL = document.getElementById("playlistUL");
    const playlistCount = document.querySelector(".songCount");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    let playlistTimeout;
    let volumeTimeout;
    audio.crossOrigin = "anonymous";
    function loadPlaylist() {
        playlistUL.innerHTML = "";
        playlistCount.innerHTML = playlist.length;
        playlist.forEach((track, index) => {
            if (index !== currentTrackIndex) {
                const li = document.createElement("li");
                li.textContent = track.name;
                li.onclick = () => playTrack(index);
                playlistUL.appendChild(li);
            }
        });
    }

    // Load first track on page load
    function loadTrack(index) {
        currentTrackIndex = index;
        audio.src = playlist[index].src;
        nowPlaying.textContent = playlist[index].name;
        updateUpNext();
        loadPlaylist();
    }

    function playTrack(index = currentTrackIndex) {
        if (audio.src !== playlist[index].src) {
            loadTrack(index);
        }
        audio.play();
    }
    let seekSlider = document.getElementById("seek-slider");
    let currentTimeDisplay = document.getElementById("current-time");
    let totalTimeDisplay = document.getElementById("total-time");
    const volumeButton = document.getElementById("volume-button");
    const volumeIcon = document.getElementById("volume-icon");
    const volumeSlider = document.getElementById("volume-slider");
    const volumeContainer = document.getElementById("volume");
    let sliderVisible = false; // Tracks if the slider is visible
    let previousVolume = 50; // Stores last volume before muting
    audio.volume = 0.5; // Example: Start at 50% volume
    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeIcon.src = "media/volume-x.svg"; // Speaker with X
        } else if (volume > 0 && volume <= 33) {
            volumeIcon.src = "media/volume.svg"; // Speaker with 1 sound wave
        } else if (volume > 33 && volume <= 66) {
            volumeIcon.src = "media/volume-1.svg"; // Speaker with 2 sound waves
        } else {
            volumeIcon.src = "media/volume-2.svg"; // Speaker with 3 sound waves
        }
    }

    // Handle volume slider changes
    volumeSlider.addEventListener("input", function () {
        let volume = parseInt(volumeSlider.value, 10);

        if (volume === 0) {
            previousVolume = 50; // Store last non-zero volume
        }

        updateVolumeIcon(volume);
        setAudioVolume(volume);
    });

    function toggleVolumeSlider() {
        if (!sliderVisible) {
            // Show slider
            volumeContainer.classList.add("show");
            sliderVisible = true;
            startVolumeCloseTimer();
        } else {
            // If the slider is visible, check if mute should be triggered
            if (volumeSlider.value > 0) {
                previousVolume = volumeSlider.value; // Save volume before muting
                volumeSlider.value = 0;
            } else {
                volumeSlider.value = previousVolume; // Restore previous volume
            }
            setAudioVolume(parseInt(volumeSlider.value, 10));
            updateVolumeIcon(parseInt(volumeSlider.value, 10));

            // Hide slider
            volumeContainer.classList.remove("show");
            sliderVisible = false;
        }
    }
    function startVolumeCloseTimer() {
        clearTimeout(volumeTimeout); // Clear any existing timeout
        volumeTimeout = setTimeout(() => {
            volumeContainer.classList.remove('show');
            sliderVisible = false; // Hide the playlist after timeout
        }, 5000); // 3 seconds
    }
    // Handle volume button click
    volumeButton.addEventListener("click", toggleVolumeSlider);

    function setAudioVolume(volume) {
        const audio = document.getElementById("audio");
        audio.volume = volume / 100; // Convert to range 0-1
    }

    // Initialize icon
    updateVolumeIcon(parseInt(volumeSlider.value, 10));



    // Update total duration once audio is loaded
    audio.addEventListener("loadedmetadata", function () {
        totalTimeDisplay.textContent = formatTime(audio.duration);
        seekSlider.max = Math.floor(audio.duration); // Set slider max to song duration
    });

    // Update seek slider and current time as song plays
    audio.addEventListener("timeupdate", function () {
        if (!audio.duration) return;
        seekSlider.value = audio.currentTime; // Move slider
        currentTimeDisplay.textContent = formatTime(audio.currentTime); // Update time
    });

    // Seek when user moves the slider
    seekSlider.addEventListener("input", function () {
        audio.currentTime = seekSlider.value;
    });

    // Format time in mm:ss
    function formatTime(seconds) {
        let min = Math.floor(seconds / 60);
        let sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    }
    // Set default volume on page load
    window.togglePlayPause = function () {
        if (audio.paused || audio.stopped) {
            pauseIcon.style.display = "block";
            playIcon.style.display = "none";
            playTrack();
        } else {
            pauseIcon.style.display = "none";
            playIcon.style.display = "block";
            audio.pause();
        }
    }
    function updateUpNext() {
        let nextIndex = (currentTrackIndex + 1) % playlist.length;
        upNext.textContent = playlist[nextIndex].name;
    }
    window.playNext = function () {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        pauseIcon.style.display = "block";
        playIcon.style.display = "none";
        audio.play();

    }

    window.playPrevious = function () {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        pauseIcon.style.display = "block";
        playIcon.style.display = "none";
        audio.play();

    }

    window.shufflePlaylist = function () {
        playlist.sort(() => Math.random() - 0.5);
        loadTrack(0);
        pauseIcon.style.display = "block";
        playIcon.style.display = "none";
        audio.play();

    }

    // Toggle the playlist visibility
    window.togglePlaylist = function () {
        const playlist = document.getElementById('playlist');
        playlist.classList.toggle('show');

        // If the playlist is being opened, set a timeout to close it automatically after 5 seconds
        if (playlist.classList.contains('show')) {
            clearTimeout(playlistTimeout); // Clear any previous timeout
            startAutoCloseTimer();
        } else {
            playlist.classList.add('show');
            startAutoCloseTimer(); // Start the auto-close timer
        }
    }
    // Function to start the auto-close timer
    function startAutoCloseTimer() {
        clearTimeout(playlistTimeout); // Clear any existing timeout
        playlistTimeout = setTimeout(() => {
            playlistElement.classList.remove('show'); // Hide the playlist after timeout
        }, 3000); // 3 seconds
    }
    // Reset timer on scroll
    playlistElement.addEventListener('scroll', () => {
        startAutoCloseTimer(); // Restart the timer when scrolling
    });
    audio.onended = () => playNext(); // Auto-play next when a track ends

    // Load and display the first track on page load
    loadTrack(0);


    audio.onplay = function () {
        document.getElementById('waveform').style.display = 'block';
        isAnimating = true;
        play();
        startAnimation();
    }
    audio.onpause = function () {
        document.getElementById('waveform').style.display = 'none';
        isAnimating = false;
        stopAnimation();
    }
    function play() {
        if (!context) {
            context = new AudioContext();
            var src = context.createMediaElementSource(audio);
            analyser = context.createAnalyser();
            src.connect(analyser);
            analyser.connect(context.destination);
            analyser.fftSize = 512;
            var bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            console.log(dataArray);
        }
        camera.position.set(0, 0, 100);
        camera.lookAt(scene.position);
        scene.add(camera);
        renderer.setSize(window.innerWidth, window.innerHeight);
        if (!sceneCreated) {
            var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
            var planeMaterial = new THREE.MeshLambertMaterial({
                color: 0x6904ce,
                side: THREE.DoubleSide,
                wireframe: true
            });

            plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.rotation.x = -0.5 * Math.PI;
            plane.position.set(0, 30, 0);
            group.add(plane);

            plane2 = new THREE.Mesh(planeGeometry, planeMaterial);
            plane2.rotation.x = -0.5 * Math.PI;
            plane2.position.set(0, -30, 0);
            group.add(plane2);

            var icosahedronGeometry = new THREE.IcosahedronGeometry(10, 4);
            var lambertMaterial = new THREE.MeshLambertMaterial({
                color: 0xff00ee,
                wireframe: true
            });

            ball = new THREE.Mesh(icosahedronGeometry, lambertMaterial);
            ball.position.set(0, 0, 0);
            group.add(ball);

            var ambientLight = new THREE.AmbientLight(0xaaaaaa);
            scene.add(ambientLight);

            var spotLight = new THREE.SpotLight(0xffffff);
            spotLight.intensity = 0.9;
            spotLight.position.set(-10, 40, 20);
            spotLight.lookAt(ball);
            spotLight.castShadow = true;
            scene.add(spotLight);

            scene.add(group);
            sceneCreated = true;
        }
        document.getElementById('out').appendChild(renderer.domElement);

        window.addEventListener('resize', onWindowResize, false);

        // Setup the "waveform" animation.
        if (!wave) {
            wave = new SiriWave({
                container: waveform,
                width: window.innerWidth,
                height: window.innerHeight * 0.3,
                cover: true,
                speed: 0.03,
                amplitude: 0.7,
                frequency: 2
            });
        }
        wave.start();
        render();
    };
    function render() {
        if (!isAnimating) return; // Stop rendering if animation is stopped

        analyser.getByteFrequencyData(dataArray);

        var lowerHalfArray = dataArray.slice(0, (dataArray.length / 2) - 1);
        var upperHalfArray = dataArray.slice((dataArray.length / 2) - 1, dataArray.length - 1);

        var overallAvg = avg(dataArray);
        var lowerMax = max(lowerHalfArray);
        var lowerAvg = avg(lowerHalfArray);
        var upperMax = max(upperHalfArray);
        var upperAvg = avg(upperHalfArray);

        var lowerMaxFr = lowerMax / lowerHalfArray.length;
        var lowerAvgFr = lowerAvg / lowerHalfArray.length;
        var upperMaxFr = upperMax / upperHalfArray.length;
        var upperAvgFr = upperAvg / upperHalfArray.length;

        makeRoughGround(plane, modulate(upperAvgFr, 0, 1, 0.5, 4));
        makeRoughGround(plane2, modulate(lowerMaxFr, 0, 1, 0.5, 4));

        makeRoughBall(ball, modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8), modulate(upperAvgFr, 0, 1, 0, 4));

        group.rotation.y += 0.005;

        renderer.render(scene, camera);

        // Assign requestAnimationFrame to animationFrameId
        animationFrameId = requestAnimationFrame(render);

    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        var height = window.innerHeight * 0.3;
        var width = window.innerWidth;
        wave.height = height;
        wave.height_2 = height / 2;
        wave.MAX = wave.height_2 - 4;
        wave.width = width;
        wave.width_2 = width / 2;
        wave.width_4 = width / 4;
        wave.canvas.height = height;
        wave.canvas.width = width;
        wave.container.style.margin = -(height / 2) + 'px auto';
    }

    function makeRoughBall(mesh, bassFr, treFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var offset = mesh.geometry.parameters.radius;
            var amp = 7;
            var time = window.performance.now();
            vertex.normalize();
            var rf = 0.00001;
            var distance = (offset + bassFr) + noise.noise3D(vertex.x + time * rf * 7, vertex.y + time * rf * 8, vertex.z + time * rf * 9) * amp * treFr;
            vertex.multiplyScalar(distance);
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }

    function makeRoughGround(mesh, distortionFr) {
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var amp = 2;
            var time = Date.now();
            var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
            vertex.z = distance;
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
    }
    function startAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            audio.play(); // Ensure audio starts
            render();
        }
    }

    function stopAnimation() {
        isAnimating = false; // Stop animation flag

        // Stop the animation loop properly
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        // Reset rotation
        group.rotation.y = 0;
        renderer.render(scene, camera); // Force re-render to apply changes

        // Pause and reset audio
        if (audio) {
            audio.pause();
        }

        // Stop waveform animation (if applicable)
        if (wave) {
            wave.stop();
        }

        console.log("Animation and audio stopped.");
    }
});
document.body.addEventListener('touchend', function (ev) { context.resume(); });





function fractionate(val, minVal, maxVal) {
    return (val - minVal) / (maxVal - minVal);
}

function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

function avg(arr) {
    var total = arr.reduce(function (sum, b) { return sum + b; });
    return (total / arr.length);
}

function max(arr) {
    return arr.reduce(function (a, b) { return Math.max(a, b); })
}