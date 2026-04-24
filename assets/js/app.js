const API_URL = 'https://cepd8d48ok.execute-api.eu-west-1.amazonaws.com/get_closest_color';

const colorInput = document.getElementById('color');
const colorPickerButton = document.getElementById('color-picker-button');
const selectedColorPreview = document.getElementById('selected-color-preview');
const form = document.getElementById('color-form');
const resultDiv = document.getElementById('result');
const rangeSelect = document.getElementById('paint_range_id');

// Initialize Vanilla Picker
const picker = new Picker({
  parent: colorPickerButton,
  color: colorInput.value || '#0370b1',
  alpha: false,
  editor: false,
});

selectedColorPreview.addEventListener('click', () => picker.show());

picker.onDone = function (color) {
  const hex = color.hex.substring(0, 7);
  colorInput.value = hex;
  selectedColorPreview.style.backgroundColor = hex;
  validateInput(colorInput);
};

picker.onChange = function (color) {
  const hex = color.hex.substring(0, 7);
  colorInput.value = hex;
  selectedColorPreview.style.backgroundColor = hex;
};

// Live update color preview when typing in hex code
colorInput.addEventListener('input', () => {
  const value = colorInput.value;
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    selectedColorPreview.style.backgroundColor = value;
    colorInput.classList.remove('border-red-500');
    document.getElementById('color-feedback').classList.add('hidden');
  } else {
    selectedColorPreview.style.backgroundColor = '#cccccc';
  }
});

// Basic form validation
function validateInput(inputElement) {
  const feedbackElement = document.getElementById(`${inputElement.id}-feedback`);
  if (!inputElement.checkValidity()) {
    inputElement.classList.add('border-red-500');
    if (feedbackElement) {
      feedbackElement.classList.remove('hidden');
      feedbackElement.style.opacity = '1';
    }
    return false;
  } else {
    inputElement.classList.remove('border-red-500');
    if (feedbackElement) {
      feedbackElement.style.opacity = '0';
      setTimeout(() => feedbackElement.classList.add('hidden'), 300);
    }
    return true;
  }
}

colorInput.addEventListener('blur', () => validateInput(colorInput));
rangeSelect.addEventListener('blur', () => validateInput(rangeSelect));
rangeSelect.addEventListener('change', () => validateInput(rangeSelect));

form.addEventListener('submit', async event => {
  event.preventDefault();

  const isRangeValid = validateInput(rangeSelect);
  const isColorValid = validateInput(colorInput);

  if (!isRangeValid || !isColorValid) {
    resultDiv.innerHTML = `<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative opacity-0" role="alert">
      <strong class="font-bold">Heads up!</strong>
      <span class="block sm:inline">Please correct the errors in the form.</span>
    </div>`;
    resultDiv.querySelector('div').style.opacity = '1';
    return;
  }

  // Show loading spinner
  resultDiv.innerHTML = `<div class="flex items-center justify-center p-4 opacity-0">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    <div class="ml-3 text-gray-700">Finding the closest color...</div>
  </div>`;
  resultDiv.querySelector('div').style.opacity = '1';

  const payload = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const newColor = await response.json();
    resultDiv.innerHTML = `<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative opacity-0" role="alert">
      <strong class="font-bold">Success!</strong>
      <span class="block sm:inline">The closest color is <span class="font-semibold text-blue-800">${newColor.name}</span> <span style="color:${newColor.paint_color}">&#9632;</span></span>
      <p class="text-sm mt-2">Paint Type: <span class="font-medium">${newColor.paint_type}</span></p>
      <p class="text-sm">Hex Code: <span class="font-medium">${newColor.paint_color}</span></p>
      <p class="text-sm">Difference Score: <span class="font-medium">${newColor.difference.toFixed(2)}</span></p>
    </div>`;
    resultDiv.querySelector('div').style.opacity = '1';
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative opacity-0" role="alert">
      <strong class="font-bold">Fail!</strong>
      <span class="block sm:inline">There was an error, please try again :(</span>
    </div>`;
    resultDiv.querySelector('div').style.opacity = '1';
  }
});
