const CALCULATEFORM = document.getElementById('bonus-form');
const SALARYFIELD = document.getElementById('salary-field');
const YEARSFIELD = document.getElementById('years-field');
const DAYSFIELD = document.getElementById('days-field');
const CALCBTN = document.getElementById('calc-button');
const RESULTSECTION = document.getElementById('result-section');

// Creating the event listeners
CALCULATEFORM.addEventListener('submit', submit);

// Creating the submit function to calculate bonus
function submit(e) {
    e.preventDefault();
    let bonus;

    // Inputs validation
    if (SALARYFIELD.value <= 0) {
        alert('Salary must be greater than 0.');
    } else if (YEARSFIELD.value < 0 || YEARSFIELD.value >= 35) {
        alert('Years must be greater or equal to 0 and less than 35.');
    } else if (DAYSFIELD.value <= 0 || DAYSFIELD.value >= 365) {
        alert('Days must be greater than 0 and less than 365.');
    } else {
        // Button disabled
        CALCBTN.classList.toggle('bisabled-button');
        CALCBTN.disabled = true;

        const SALARY = SALARYFIELD.value;
        const YEARS = YEARSFIELD.value;
        const DAYS = DAYSFIELD.value;
        let salaryForDays;

        // Calculating salary for days depending on years
        if (YEARS < 1) {
            salaryForDays = (SALARY * 15) / 30;
        } else if (YEARS >= 1 && YEARS < 3) {
            salaryForDays = (SALARY * 18) / 30;
        } else if (YEARS >= 3 && YEARS <= 10) {
            salaryForDays = (SALARY * 19) / 30;
        } else if (YEARS > 10) {
            salaryForDays = (SALARY * 21) / 30;
        }

        // Calculating the bonus
        bonus = (DAYS * salaryForDays) / 365;
        bonus = bonus.toFixed(2);

        // Displaying the result
        RESULTSECTION.innerHTML = `
            <div class="result-div">
                <p>Your bonus is: $${bonus}</p>
            </div>
        `;

        // Reseting the form
        CALCULATEFORM.reset();

        // Button enabled
        CALCBTN.classList.toggle('bisabled-button');
        CALCBTN.disabled = false;
    }
}