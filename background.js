chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "downloadInfo") {
    const listener = (downloadItem, suggest) => {
      const sanitize = (str) => str.replace(/[/\\?%*:|"<>]/g, "-");

      const sanitizedCourseTitle = sanitize(message.courseTitle);
      const sanitizedTopic = sanitize(message.topic);
      const sanitizedFaculty = sanitize(message.faculty);
      const sanitizedSlot = sanitize(message.slot);
      const materialNumber = message.materialNumber;

      const folderPath = `VIT Downloads/${sanitizedCourseTitle}/${sanitizedSlot} - ${sanitizedFaculty}`;
      const filename = `${folderPath}/${materialNumber} - ${sanitizedTopic}${getFileExtension(
        downloadItem.filename
      )}`;

      console.log("Saving file as:", filename);

      suggest({
        filename: filename,
        conflict_action: "uniquify",
      });

      chrome.downloads.onDeterminingFilename.removeListener(listener);
    };

    chrome.downloads.onDeterminingFilename.addListener(listener);
  }
});

function getFileExtension(filename) {
  const match = filename.match(/\.[^/.]+$/);
  return match ? match[0] : "";
}
