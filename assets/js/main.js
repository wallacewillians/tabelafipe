const BASE_URL = 'https://fipe.parallelum.com.br/api/v2';

const state = {
    vehicleType: 'cars', // cars, motorcycles, trucks
    brandId: null,
    modelId: null,
    yearId: null
};

// DOM Elements
const typeButtons = document.querySelectorAll('.type-btn');
const brandSelect = document.getElementById('brand-select');
const modelSelect = document.getElementById('model-select');
const yearSelect = document.getElementById('year-select');
const resultContainer = document.getElementById('result-container');
const formElement = document.getElementById('fipe-form');
const loadingOverlay = document.getElementById('loading');
const btnNewSearch = document.getElementById('btn-new-search');
const messageContainer = document.getElementById('message-container');

// Result Elements
const resultModel = document.getElementById('result-model');
const resultPrice = document.getElementById('result-price');
const resultBrand = document.getElementById('result-brand');
const resultYear = document.getElementById('result-year');
const resultFuel = document.getElementById('result-fuel');
const resultCode = document.getElementById('result-code');
const resultRef = document.getElementById('result-ref');

// Helper Functions
function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
}

function showMessage(text, type = 'error') {
    if (!text) {
        messageContainer.style.display = 'none';
        return;
    }
    messageContainer.textContent = text;
    messageContainer.className = `message-container message-${type}`;
    messageContainer.style.display = 'block';

    if (type === 'error') {
        setTimeout(() => showMessage(null), 5000);
    }
}

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Fetch Error:', error);
        throw error;
    }
}

function resetSelect(select, defaultText) {
    select.innerHTML = `<option value="" selected disabled>${defaultText}</option>`;
}

function populateSelect(select, data, defaultText) {
    resetSelect(select, defaultText);
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

// API Calls
async function loadBrands() {
    showLoading(true);
    showMessage(null);
    try {
        const brands = await fetchAPI(`/${state.vehicleType}/brands`);
        populateSelect(brandSelect, brands, 'Selecione a marca');
        brandSelect.disabled = false;
    } catch (error) {
        showMessage('Não foi possível carregar as marcas. Tente novamente mais tarde.');
    } finally {
        showLoading(false);
    }
}

async function loadModels(brandId) {
    showLoading(true);
    try {
        const models = await fetchAPI(`/${state.vehicleType}/brands/${brandId}/models`);
        populateSelect(modelSelect, models, 'Selecione o modelo');
    } catch (error) {
        showMessage('Erro ao carregar modelos.');
    } finally {
        showLoading(false);
    }
}

async function loadYears(brandId, modelId) {
    showLoading(true);
    try {
        const years = await fetchAPI(`/${state.vehicleType}/brands/${brandId}/models/${modelId}/years`);
        populateSelect(yearSelect, years, 'Selecione o ano');
    } catch (error) {
        showMessage('Erro ao carregar anos.');
    } finally {
        showLoading(false);
    }
}

async function loadPrice(brandId, modelId, yearId) {
    showLoading(true);
    try {
        const data = await fetchAPI(`/${state.vehicleType}/brands/${brandId}/models/${modelId}/years/${yearId}`);
        displayResult(data);
    } catch (error) {
        showMessage('Erro ao obter preço do veículo.');
    } finally {
        showLoading(false);
    }
}

function displayResult(data) {
    resultModel.textContent = data.model;
    resultPrice.textContent = data.price;
    resultBrand.textContent = data.brand;
    resultYear.textContent = `${data.modelYear} ${data.fuel}`;
    resultFuel.textContent = data.fuel;
    resultCode.textContent = data.codeFipe;
    resultRef.textContent = data.referenceMonth;

    formElement.style.display = 'none';
    resultContainer.style.display = 'block';
}

function updateVehicleType(type) {
    state.vehicleType = type;
    state.brandId = null;
    state.modelId = null;
    state.yearId = null;

    typeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });

    brandSelect.disabled = true;
    modelSelect.disabled = true;
    yearSelect.disabled = true;

    resetSelect(brandSelect, 'Carregando marcas...');
    resetSelect(modelSelect, 'Selecione o modelo');
    resetSelect(yearSelect, 'Selecione o ano');

    loadBrands();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadBrands();
});

typeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.type;
        if (state.vehicleType !== type) {
            updateVehicleType(type);
        }
    });
});

brandSelect.addEventListener('change', (e) => {
    state.brandId = e.target.value;
    loadModels(state.brandId);
    resetSelect(modelSelect, 'Selecione o modelo');
    resetSelect(yearSelect, 'Selecione o ano');
    modelSelect.disabled = false;
    yearSelect.disabled = true;
});

modelSelect.addEventListener('change', (e) => {
    state.modelId = e.target.value;
    loadYears(state.brandId, state.modelId);
    resetSelect(yearSelect, 'Selecione o ano');
    yearSelect.disabled = false;
});

yearSelect.addEventListener('change', (e) => {
    state.yearId = e.target.value;
    loadPrice(state.brandId, state.modelId, state.yearId);
});

btnNewSearch.addEventListener('click', () => {
    resultContainer.style.display = 'none';
    formElement.style.display = 'block';
    updateVehicleType(state.vehicleType);
});
