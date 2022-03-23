const recordBtn = document.querySelector(".record");
const stopBtn = document.querySelector(".stop");
const soundClips = document.querySelector(".sound-clips");

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia Supported.");
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      console.log(mediaRecorder);

      recordBtn.addEventListener("click", () => {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recording started");
        recordBtn.style.background = "red";
        recordBtn.style.color = "black";
      });

      let chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      stopBtn.addEventListener("click", () => {
        mediaRecorder.stop();
        recordBtn.style.background = "";
        recordBtn.style.color = "";
      });

      mediaRecorder.onstop = () => {
        console.log("recorder stopped");
        const clipName = prompt("Enter a name for your sound");
        const clipContainer = document.createElement("article");
        const clipLabel = document.createElement("p");
        const audio = document.createElement("audio");
        const deleteButton = document.createElement("button");

        deleteButton.setAttribute("class", "btn");
        clipContainer.classList.add("clip");
        audio.setAttribute("controls", "");
        deleteButton.innerHTML = "Delete";
        clipLabel.innerHTML = clipName;

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.appendChild(clipContainer);

        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
        deleteButton.onclick = (e) => {
          let eventTarget = e.target;
          eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);
        };
      };
    })
    .catch((err) => {
      console.log("The following error occurred: " + err);
    });
} else {
  console.log("getUserMedia not supported on your browser");
}
