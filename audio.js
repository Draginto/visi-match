var recordBtn = document.querySelector(".record");
var stopBtn = document.querySelector(".stop");
var soundClips = document.querySelector(".sound-clips");
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia Supported.");
    navigator.mediaDevices
        .getUserMedia({
        audio: true
    })
        .then(function (stream) {
        var mediaRecorder = new MediaRecorder(stream);
        console.log(mediaRecorder);
        recordBtn.addEventListener("click", function () {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recording started");
            recordBtn.style.background = "red";
            recordBtn.style.color = "black";
        });
        var chunks = [];
        mediaRecorder.ondataavailable = function (event) {
            chunks.push(event.data);
        };
        stopBtn.addEventListener("click", function () {
            mediaRecorder.stop();
            recordBtn.style.background = "";
            recordBtn.style.color = "";
        });
        mediaRecorder.onstop = function () {
            console.log("recorder stopped");
            var clipName = prompt("Enter a name for your sound");
            var clipContainer = document.createElement("article");
            var clipLabel = document.createElement("p");
            var audio = document.createElement("audio");
            var deleteButton = document.createElement("button");
            deleteButton.setAttribute("class", "btn");
            clipContainer.classList.add("clip");
            audio.setAttribute("controls", "");
            deleteButton.innerHTML = "Delete";
            clipLabel.innerHTML = clipName;
            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);
            var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
            chunks = [];
            var audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            deleteButton.onclick = function (e) {
                var eventTarget = e.target;
                eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
            };
        };
    })["catch"](function (err) {
        console.log("The following error occurred: " + err);
    });
}
else {
    console.log("getUserMedia not supported on your browser");
}
