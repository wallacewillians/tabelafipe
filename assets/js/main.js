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

// Result Elements
const resultModel = document.getElementById('result-model');
const resultPrice = document.getElementById('result-price');
const resultBrand = document.getElementById('result-brand');
const resultYear = document.getElementById('result-year');
const resultFuel = document.getElementById('result-fuel');
const resultCode = document.getElementById('result-code');
const resultRef = document.getElementById('result-ref');

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
    resultContainer.classList.add('hidden');
    formElement.classList.remove('hidden');
    // Reset selections but keep the current vehicle type
    resetSelect(brandSelect, 'Selecione a marca');
    resetSelect(modelSelect, 'Selecione o modelo');
    resetSelect(yearSelect, 'Selecione o ano');
    brandSelect.disabled = false;
    modelSelect.disabled = true;
    yearSelect.disabled = true;
    loadBrands();
});

// Logic Functions

function updateVehicleType(type) {
    state.vehicleType = type;
    
    // Update UI
    typeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });

    // Reset Form
    state.brandId = null;
    state.modelId = null;
    state.yearId = null;
    
    resetSelect(brandSelect, 'Selecione a marca');
    resetSelect(modelSelect, 'Selecione o modelo');
    resetSelect(yearSelect, 'Selecione o ano');
    
    modelSelect.disabled = true;
    yearSelect.disabled = true;

    loadBrands();
}

async function loadBrands() {
    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/${state.vehicleType}/brands`);
        const brands = await response.json();
        
        populateSelect(brandSelect, brands);
        brandSelect.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar marcas:', error);
        alert('Erro ao carregar marcas. Tente novamente.');
    } finally {
        showLoading(false);
    }
}

async function loadModels(brandId) {
    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/${state.vehicleType}/brands/${brandId}/models`);
        const models = await response.json();
        
        populateSelect(modelSelect, models);
        modelSelect.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar modelos:', error);
        alert('Erro ao carregar modelos. Tente novamente.');
    } finally {
        showLoading(false);
    }
}

async function loadYears(brandId, modelId) {
    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/${state.vehicleType}/brands/${brandId}/models/${modelId}/years`);
        const years = await response.json();
        
        populateSelect(yearSelect, years);
        yearSelect.disabled = false;
    } catch (error) {
        console.error('Erro ao carregar anos:', error);
        alert('Erro ao carregar anos. Tente novamente.');
    } finally {
        showLoading(false);
    }
}

async function loadPrice(brandId, modelId, yearId) {
    showLoading(true);
    try {
        const response = await fetch(`${BASE_URL}/${state.vehicleType}/brands/${brandId}/models/${modelId}/years/${yearId}`);
        const data = await response.json();
        
        displayResult(data);
    } catch (error) {
        console.error('Erro ao consultar preço:', error);
        alert('Erro ao consultar preço. Tente novamente.');
    } finally {
        showLoading(false);
    }
}

// Helper Functions

function populateSelect(selectElement, items) {
    selectElement.innerHTML = '<option value="" selected disabled>Selecione</option>';
    
    // sorting items by name if they have name property
    items.sort((a, b) => a.name.localeCompare(b.name));

    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.code || item.id; // API uses 'code' for some, 'id' for others usually? Wait, checking API.
        // Parallelum API usually uses 'code' as the identifier in the list
        // Let's check the objects. Usually { name: "Acura", code: "1" }
        // Models: { name: "Integra GS 1.8", code: "1" }
        // Years: { name: "1992 Gasolina", code: "1992-1" }
        option.value = item.code;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
    
    // Restore default option text based on select ID
    const defaultText = selectElement.id === 'brand-select' ? 'Selecione a marca' :
                       selectElement.id === 'model-select' ? 'Selecione o modelo' : 'Selecione o ano';
    selectElement.querySelector('option').textContent = defaultText;
}

function resetSelect(selectElement, defaultText) {
    selectElement.innerHTML = `<option value="" selected disabled>${defaultText}</option>`;
    selectElement.disabled = true;
}

function displayResult(data) {
    // Hide form, show result
    formElement.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // Populate data
    resultModel.textContent = data.model;
    resultBrand.textContent = data.brand;
    resultPrice.textContent = data.price.replace('R$ ', '');
    resultYear.textContent = data.modelYear;
    resultFuel.textContent = data.fuel;
    resultCode.textContent = data.codeFipe;
    resultRef.textContent = data.referenceMonth;
}

function showLoading(isLoading) {
    if (isLoading) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}
