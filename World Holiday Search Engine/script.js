k = `Your calendarific.com API Key`;

const userCountry = document.getElementById('country-input');
const userYear = document.getElementById('year-input');
const userMonth = document.getElementById('month-input');
const userDay = document.getElementById('day-input');

let today = new Date();
userYear.value = today.getFullYear();

const $cardContainer = $('#card-container');

let cardCount = 0;
let display = false;
let countryList = [];
let holidayList = [];

handleGetCountries();

$('#today-button').on('click', useToday);
$('#reset-button').on('click', clearHolidays);
$('form').on('submit', handleGetHolidays);

// API call for country list
function handleGetCountries() {
    $.ajax({
        url: `https://calendarific.com/api/v2/countries?&api_key=${k}`
    }).then(
        (data) => {
            countryList = data.response.countries;
            countryDropdown();
        },
        (error) => {
            console.log('bad request', error);
        }
    );
}

function countryDropdown() {
    let fragment = document.createDocumentFragment();
    countryList.forEach(country => {

        let opt = document.createElement('option');
        opt.innerHTML = country.country_name;
        opt.value = country['iso-3166'];
        opt.className = 'none';
        fragment.appendChild(opt);
    });
    userCountry.appendChild(fragment);
}

// API call for holidays
function handleGetHolidays(evt){
    evt.preventDefault();

    let leapYear = false;
    if ((0 == userYear.value % 4) && (0 != userYear.value % 100) || (0 == userYear.value % 400)){
        leapYear = true;
    }

    if (userCountry.value === 'Please Choose a Country') {
        alert('You must choose a country first!')
    } else if (!userYear.value) {
        alert('You must choose a year first!')
    } else if (!leapYear && userMonth.value === '2' && userDay.value > 28) {
        alert('February ends on the 28th unless it is a leap year. Please choose a valid date.')
    } else if (leapYear && userMonth.value === '2' && userDay.value>29) {
        alert(`The year ${userYear.value} is a Leap Year! February only gets one extra day though. Please choose a valid date.`)
    }else if (userDay.value === '31' && (userMonth.value === '4' || userMonth.value === '6' || userMonth.value === '9' || userMonth.value === '11')){
        alert(`The month in question does not have 31 days. Please choose a valid date.`)
    } else {
        $.ajax({
            url: `https://calendarific.com/api/v2/holidays?&api_key=${k}&country=${userCountry.value}&year=${userYear.value}&month=${userMonth.value}&day=${userDay.value}`
        }).then(
            (data) => {
                holidayList = data.response.holidays;
                if (holidayList === undefined) {
                    let countryName = nameFromIso(userCountry.value);
                    alert(`There is no data for ${countryName} during ${userYear.value}.  Please input another year.`)
                } else {
                renderHoliday();
                }
            },
            (error) => {
                console.log('bad request', error);
            }
        );
    }
}

function renderHoliday(){
    if (holidayList.length > 0) {
        holidayList.forEach(holiday => {
            createCard();

            let $cardDate = $(`#card-date-${cardCount}`);
            let $cardType = $(`#card-type-${cardCount}`);
            let $cardName = $(`#card-name-${cardCount}`);
            let $cardDesc = $(`#card-desc-${cardCount}`);

            $cardDate.text(holiday.date.iso.slice(0,10));
            $cardType.text(holiday.primary_type)
            $cardName.text(holiday.name);
            $cardDesc.text(holiday.description);
        });
    } else {
        createCard();

        let $cardDate = $(`#card-date-${cardCount}`);
        let $cardType = $(`#card-type-${cardCount}`);
        let $cardName = $(`#card-name-${cardCount}`);
        let $cardDesc = $(`#card-desc-${cardCount}`);

        let countryName = nameFromIso(userCountry.value);

        $cardDate.text(`${userYear.value}-${userMonth.value}-${userDay.value}`);
        $cardType.text(countryName)
        $cardName.text('None');
        $cardDesc.text(`Sadly, there is no official reason to celebrate in ${countryName} on the date in question :( \n We hope you still find many personal reasons to party!`);
    }
    display = true;
}

function createCard() {
    if (display) {
        removeCards();
    }

    cardCount++;
    let newCard = document.createElement('section');

    newCard.setAttribute('id',`card-${cardCount}`);
    newCard.innerHTML = `<span id='card-date-${cardCount}'></span><br><br><span id='card-type-${cardCount}'></span><h3 id='card-name-${cardCount}'>New Card</h3>
    <p id='card-desc-${cardCount}'>New Desc</p>`;

    $cardContainer.append(newCard);
}

function removeCards() {
    $cardContainer.empty();
    cardCount = 0;
    display = false;
}

function clearHolidays(evt) {
    evt.preventDefault();

    removeCards();
}

function nameFromIso(iso) {
    let countryName = countryList.find(country => country['iso-3166'] === iso)
    return countryName.country_name
}

function useToday(evt) {
    evt.preventDefault();
    userMonth.value = today.getMonth() + 1
    userDay.value = today.getDate()

    userMonth.classList.remove('first-choice');
}