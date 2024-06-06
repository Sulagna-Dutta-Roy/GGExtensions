window.onload = function () {
    // Variables
    const resultRct = document.querySelector('.result-rect');
    const resultTrp = document.querySelector('.result-trap');
    const results = document.querySelector('.results');

    const cbInput = document.querySelector('.input-cb');
    const rangeInputFrom = document.querySelector('.input-range-from');
    const rangeInputTo = document.querySelector('.input-range-to');
    const stepInput = document.querySelector('.input-step');

    const btn = document.querySelector('.btn');

    // Functions

    const roundResult = result => math.round(result, 3);

    const integrateRct = (fn, step, start, end) => {
        let sumRct = 0;
        for (let i = start; i <= end; i += step) {
            if (fn(i) == Infinity || -Infinity) {
                i = i + step / 100;
            }
            if (i <= end - step) sumRct = math.add(sumRct, math.multiply(fn(i), step));
        }

        return `Rectangle rule: ${roundResult(sumRct)}`
    }

    const integrateTrp = (fn, step, start, end) => {
        let sumTrp = 0;
        for (let i = start; i <= end; i += step) {
            if (fn(i) == Infinity || -Infinity ||
                fn(i + step) == Infinity || -Infinity) {
                i = i + step / 100;
            }
            if (i <= end - step) {
                sumTrp = math.add(sumTrp, math.multiply(math.add(fn(i), fn(i + step)), step, 0.5));
            }
        }

        return `Trapezoidal rule: ${roundResult(sumTrp)}`
    }

    // functionality added due to math.js library
    const getInpFunc = inp => {
        const parser = math.parser();
        parser.evaluate(`f(x) = ${inp.value}`);
        return parser.get('f');
    };


    btn.addEventListener('click', () => {
        const errorMessage = document.querySelector('.error-message');
        errorMessage.classList.add('is-hidden');
        results.classList.add('is-hidden');
        cbInput.classList.remove('on-error');
        rangeInputFrom.classList.remove('on-error');
        rangeInputTo.classList.remove('on-error');
        stepInput.classList.remove('on-error');

        try {
            errorMessage.innerHTML = '';

            if (+rangeInputFrom.value > +rangeInputTo.value) {
                throw new Error('Range is not valid');
            } else if (+stepInput.value > +rangeInputTo.value - +rangeInputFrom.value &&
                rangeInputTo.value &&
                rangeInputFrom.value) {
                throw new Error('Step is not valid');
            }

            const argsArray = [getInpFunc(cbInput),
            Number(stepInput.value),
            Number(rangeInputFrom.value),
            Number(rangeInputTo.value)
            ];

            resultRct.innerHTML = integrateRct(...argsArray);

            resultTrp.innerHTML = integrateTrp(...argsArray);

            results.classList.remove('is-hidden');
        } catch (err) {
            errorMessage.classList.remove('is-hidden');

            switch (true) {
                case err.message == 'Unexpected end of expression (char 8)' || err.message == 'Value expected (char 8)':
                    errorMessage.innerHTML = 'You have to enter integrand!';
                    cbInput.classList.add('on-error');
                    break;
                case err.message.startsWith('Undefined symbol') || err.message.startsWith('Unexpected type of argument'):
                    errorMessage.innerHTML = 'Intergrand is not valid!';
                    cbInput.classList.add('on-error');
                    break;
                case err.message == 'Range is not valid':
                    errorMessage.innerHTML = `Range "to" must be greater than range "from"!`;
                    rangeInputFrom.classList.add('on-error');
                    rangeInputTo.classList.add('on-error');
                    break;
                case err.message.includes(','):
                    errorMessage.innerHTML = `Use '.' as decimal separator!`;
                    cbInput.classList.add('on-error');
                    break;
                case err.message == 'Step is not valid':
                    errorMessage.innerHTML = 'Step must not be greater than range!';
                    stepInput.classList.add('on-error');
                    break;
                default:
                    errorMessage.innerHTML = err.message;
                    cbInput.classList.add('on-error');
                    break;
            }
            console.log(err.message)
        }

    });
};
