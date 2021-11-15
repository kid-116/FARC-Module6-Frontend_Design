const submitButton = document.getElementById('submit');
const countrySelect = document.getElementById('country');
const responseCard = document.getElementById('response');
const error = document.getElementById('error-card');
const spinner = document.getElementById('spinner');

const province = document.getElementById('province');
const newDeaths = document.getElementById('new-deaths');
const datePara = document.getElementById('date');
const newConfirmed = document.getElementById('new-confirmed');
const totalConfirmed = document.getElementById('total-confirmed');
const totalDeaths = document.getElementById('total-deaths');


submitButton.onclick = function() {
    console.log('getting data...');
    hide(responseCard);
    hide(error);
    show(spinner);
    const country = countrySelect.value;
    $.ajax({
        url: `https://api.covid19api.com/summary`,
        method: 'GET'
    }).done(function (response) {
        response.Countries.forEach(block => {
            if(block.Slug == country) {
                let date = block.Date;
                date = `${date.substring(0, 10)} ${date.substring(11, 19)} UTC+00:00`
                province.innerHTML = block.Country;
                newConfirmed.innerHTML = block.NewConfirmed;
                newDeaths.innerHTML = block.NewDeaths;
                datePara.innerHTML = date;
                totalConfirmed.innerHTML = block.TotalConfirmed;
                totalDeaths.innerHTML = block.TotalDeaths;
                show(responseCard);
            }
        });
        if(responseCard.style.display === 'none') {
            show(error);
        }
        hide(spinner);
    });
}

function injectCountries() {
    console.log('injecting countries...');
    $.ajax({
        url: `https://api.covid19api.com/countries`,
        method: 'GET'
    }).done(function (countries) {
        countries = countries.sort(function(a, b) {
            if(a.Country < b.Country) {
                return -1;
            }
            if(a.Country > b.Country) {
                return 1;
            }
            return 0;
        })
        countries.forEach(country => {
            const option = document.createElement('option');
            option.setAttribute('value', country.Slug);
            const optionText = document.createTextNode(country.Country);
            option.appendChild(optionText);
            countrySelect.appendChild(option);
        });
    });
}
injectCountries();

function hide(element) {
    element.style.display = 'none';
}
function show(element) {
    element.style.display = 'block';
}

hide(responseCard);
hide(error);
hide(spinner);