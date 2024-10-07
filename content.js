document.addEventListener("click", function (event) {
  if (event.target.textContent.includes("Reference Material")) {
    const clickedRow = event.target.closest("tr");
    if (!clickedRow) return;

    const courseRow = document.querySelector("table tr:nth-child(2)");
    let courseInfo = {
      slot: "",
      courseTitle: "",
      faculty: "",
      topic: "",
      materialNumber: "",
    };

    if (courseRow) {
      const cells = courseRow.cells;
      if (cells && cells.length >= 7) {
        courseInfo = {
          slot: cells[5].textContent.trim(),
          courseTitle: cells[2].textContent.trim(),
          faculty: cells[6].textContent.trim().split("-")[1].trim(),
        };
      }
    }

    const topicCell = clickedRow.querySelector("td:nth-child(4)");
    courseInfo.topic = topicCell
      ? topicCell.textContent.trim()
      : "Unknown Topic";

    // Get the material number
    const materialNumberCell = clickedRow.querySelector("td:nth-child(1)");
    const topicNumber = materialNumberCell
      ? materialNumberCell.textContent.trim()
      : "";

    // Extract sub-material number from button text
    const buttonText = event.target.textContent.trim();
    const subMaterialMatch = buttonText.substring(18).trim();
    const subMaterialNumber = romanToDecimal(subMaterialMatch);
    console.log(buttonText);
    console.log(subMaterialMatch);
    console.log(subMaterialNumber);
    // Construct the material number (e.g., "1.1", "2.3", etc.)
    courseInfo.materialNumber = `${topicNumber}.${subMaterialNumber}`;

    console.log("Sending course info:", courseInfo);

    chrome.runtime.sendMessage({
      type: "downloadInfo",
      ...courseInfo,
    });
  }
});

// Function to convert Roman numeral to decimal
function romanToDecimal(roman) {
  const romanValues = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let result = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = romanValues[roman[i]];
    const next = romanValues[roman[i + 1]];
    if (next && next > current) {
      result += next - current;
      i++;
    } else {
      result += current;
    }
  }
  return result;
}
