document.addEventListener("DOMContentLoaded", function () {
  const enableFilterCheckbox = document.getElementById("enableFilter");
  const minDurationInput = document.getElementById("minDuration");
  const maxDurationInput = document.getElementById("maxDuration");
  const minDurationDisplay = document.querySelector(".min-duration-display");
  const maxDurationDisplay = document.querySelector(".max-duration-display");
  const saveButton = document.getElementById("saveSettings");
  const statusMessage = document.getElementById("statusMessage");
  const presetButtonsContainer = document.getElementById("presetButtons");
  const managePresetsBtn = document.getElementById("managePresetsBtn");
  const presetManager = document.getElementById("presetManager");
  const addPresetBtn = document.getElementById("addPresetBtn");
  const resetPresetsBtn = document.getElementById("resetPresetsBtn");
  const closePresetManagerBtn = document.getElementById(
    "closePresetManagerBtn"
  );
  const presetNameInput = document.getElementById("presetName");
  const presetMinInput = document.getElementById("presetMin");
  const presetMaxInput = document.getElementById("presetMax");
  const presetList = document.getElementById("presetList");

  const browserAPI = typeof browser !== "undefined" ? browser : chrome;

  const defaultPresets = [
    { name: "0-5 min", min: 0, max: 5 },
    { name: "0-10 min", min: 0, max: 10 },
    { name: "5-20 min", min: 5, max: 20 },
    { name: "10-30 min", min: 10, max: 30 },
    { name: "30-60 min", min: 30, max: 60 },
  ];

  browserAPI.storage.sync.get(
    ["minDuration", "maxDuration", "isEnabled", "customPresets"],
    function (result) {
      const minDuration = (result && result.minDuration) || 0;
      const maxDuration = (result && result.maxDuration) || 600;
      const isEnabled = (result && result.isEnabled) || false;
      const customPresets = (result && result.customPresets) || defaultPresets;

      const minDurationInMinutes = Math.floor(minDuration / 60);
      const maxDurationInMinutes = Math.floor(maxDuration / 60);

      minDurationInput.value = minDurationInMinutes;
      maxDurationInput.value = maxDurationInMinutes;
      enableFilterCheckbox.checked = isEnabled;
      updateDurationDisplay(minDurationInMinutes, maxDurationInMinutes);

      renderPresetButtons(customPresets);
      renderPresetList(customPresets);
    }
  );

  function updateDurationDisplay(minMinutes, maxMinutes) {
    function formatTime(minutes) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours > 0) {
        return `${hours}:${remainingMinutes.toString().padStart(2, "0")}:00`;
      } else {
        return `${minutes}:00`;
      }
    }

    if (minMinutes !== undefined) {
      minDurationDisplay.textContent = formatTime(minMinutes);
    }
    if (maxMinutes !== undefined) {
      maxDurationDisplay.textContent = formatTime(maxMinutes);
    }
  }

  minDurationInput.addEventListener("input", function () {
    const minutes = parseInt(this.value, 10) || 0;
    updateDurationDisplay(minutes, undefined);
  });

  maxDurationInput.addEventListener("input", function () {
    const minutes = parseInt(this.value, 10) || 1;
    updateDurationDisplay(undefined, minutes);
  });

  function renderPresetButtons(presets) {
    presetButtonsContainer.innerHTML = "";

    presets.forEach((preset) => {
      const button = document.createElement("button");
      button.className = "preset-btn";
      button.dataset.min = preset.min;
      button.dataset.max = preset.max;
      button.textContent = preset.name;

      button.addEventListener("click", function () {
        const minMinutes = parseInt(this.dataset.min, 10);
        const maxMinutes = parseInt(this.dataset.max, 10);

        minDurationInput.value = minMinutes;
        maxDurationInput.value = maxMinutes;
        updateDurationDisplay(minMinutes, maxMinutes);

        document
          .querySelectorAll(".preset-btn")
          .forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
      });

      presetButtonsContainer.appendChild(button);
    });
  }

  function renderPresetList(presets) {
    presetList.innerHTML = "";

    presets.forEach((preset, index) => {
      const presetItem = document.createElement("div");
      presetItem.className = "preset-item";
      presetItem.innerHTML = `
                <span class="preset-info">${preset.name} (${preset.min}-${preset.max} min)</span>
                <button class="delete-preset-btn" data-index="${index}">×</button>
            `;

      const deleteBtn = presetItem.querySelector(".delete-preset-btn");
      deleteBtn.addEventListener("click", function () {
        deletePreset(index);
      });

      presetList.appendChild(presetItem);
    });
  }

  function savePresets(presets) {
    browserAPI.storage.sync.set({ customPresets: presets }, function () {
      renderPresetButtons(presets);
      renderPresetList(presets);
    });
  }

  function deletePreset(index) {
    browserAPI.storage.sync.get(["customPresets"], function (result) {
      const presets = (result && result.customPresets) || defaultPresets;
      presets.splice(index, 1);
      savePresets(presets);
    });
  }

  saveButton.addEventListener("click", function () {
    const minDuration = parseInt(minDurationInput.value, 10) || 0;
    const maxDuration = parseInt(maxDurationInput.value, 10) || 10;
    const isEnabled = enableFilterCheckbox.checked;

    if (minDuration >= maxDuration) {
      statusMessage.textContent = "Min duration must be less than max duration";
      statusMessage.className = "status-message error";
      setTimeout(() => {
        statusMessage.textContent = "";
        statusMessage.className = "status-message";
      }, 3000);
      return;
    }

    const minDurationInSeconds = minDuration * 60;
    const maxDurationInSeconds = maxDuration * 60;

    browserAPI.storage.sync.set(
      {
        minDuration: minDurationInSeconds,
        maxDuration: maxDurationInSeconds,
        isEnabled: isEnabled,
      },
      function () {
        statusMessage.textContent = "Settings saved!";
        statusMessage.className = "status-message success";

        setTimeout(() => {
          window.close();
        }, 500);
      }
    );
  });

  enableFilterCheckbox.addEventListener("change", function () {
    const minDuration = parseInt(minDurationInput.value, 10) || 0;
    const maxDuration = parseInt(maxDurationInput.value, 10) || 10;
    const minDurationInSeconds = minDuration * 60;
    const maxDurationInSeconds = maxDuration * 60;

    browserAPI.storage.sync.set({
      minDuration: minDurationInSeconds,
      maxDuration: maxDurationInSeconds,
      isEnabled: this.checked,
    });
  });

  managePresetsBtn.addEventListener("click", function () {
    presetManager.classList.toggle("hidden");
  });

  closePresetManagerBtn.addEventListener("click", function () {
    presetManager.classList.add("hidden");
  });

  addPresetBtn.addEventListener("click", function () {
    const name = presetNameInput.value.trim();
    const min = parseInt(presetMinInput.value, 10);
    const max = parseInt(presetMaxInput.value, 10);

    if (!name) {
      showStatusMessage("Please enter a preset name", "error");
      return;
    }

    if (isNaN(min) || isNaN(max) || min < 0 || max < 1) {
      showStatusMessage("Please enter valid min and max values", "error");
      return;
    }

    if (min >= max) {
      showStatusMessage("Min duration must be less than max duration", "error");
      return;
    }

    browserAPI.storage.sync.get(["customPresets"], function (result) {
      const presets = (result && result.customPresets) || defaultPresets;

      if (presets.some((preset) => preset.name === name)) {
        showStatusMessage("Preset name already exists", "error");
        return;
      }

      presets.push({ name, min, max });
      savePresets(presets);

      presetNameInput.value = "";
      presetMinInput.value = "";
      presetMaxInput.value = "";

      showStatusMessage("Preset added successfully", "success");
    });
  });

  resetPresetsBtn.addEventListener("click", function () {
    savePresets([...defaultPresets]);
    showStatusMessage("Presets reset to default", "success");
  });

  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;

    setTimeout(() => {
      statusMessage.textContent = "";
      statusMessage.className = "status-message";
    }, 3000);
  }
});
