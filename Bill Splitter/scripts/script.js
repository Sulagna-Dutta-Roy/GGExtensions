const billAmountInput = document.querySelector('#bill-amount')
const customTipInput = document.querySelector('.custom-tip')
const discountInput = document.querySelector(".discount")
const numberOfPeopleInput = document.querySelector('.number-of-people')
const generateBillBtn = document.querySelector('.generate-bill-btn')
const tipAmountOutput = document.querySelector('.tip-amount span')
const totalBillOutput = document.querySelector('.total span')
const discountAmountOutput = document.querySelector('.discount-amount span')
const eachPersonBillOutput = document.querySelector('.each-person-bill span')
const tipsContainer = document.querySelector('.tip-container')
const resetBtn = document.querySelector('.reset-btn')

let tipPercentage = 0
let discountPercentage = 0

const DisableEnableGenerateBill = ()=>{
    if (numberOfPeopleInput.value && Number(discountPercentage)>=0 && tipPercentage) {
        generateBillBtn.disabled = false
    } else {
        generateBillBtn.disabled = true
    }
}

generateBillBtn.addEventListener('click', () => {
    const billAmount = parseInt(billAmountInput.value)
    const numberOfPeople = parseInt(numberOfPeopleInput.value)

    const tipAmount = billAmount * (tipPercentage / 100)
    const discountAmount =billAmount *(discountPercentage/100) 
    console.log(discountAmount)
    const totalBill = billAmount + tipAmount - discountAmount
    const eachPersonBill = totalBill / numberOfPeople

    tipAmountOutput.innerText = `₹${tipAmount}`
    totalBillOutput.innerText = `₹${totalBill}`
    discountAmountOutput.textContent = "₹" + discountAmount
    eachPersonBillOutput.innerText = `₹${eachPersonBill}`

    resetBtn.disabled = false
})

tipsContainer.addEventListener('click', (e) => {
    if (tipsContainer.classList.contains('disabled')) return

    if (e.target !== tipsContainer) {
        ;[...tipsContainer.children].forEach((tip) =>
            tip.classList.remove('selected')
        )
        e.target.classList.add('selected')
        tipPercentage = parseInt(e.target.innerText)
        customTipInput.value = ''
        DisableEnableGenerateBill()
    }
})

customTipInput.addEventListener('input', () => {
    tipPercentage = parseInt(customTipInput.value)
        ;[...tipsContainer.children].forEach((tip) =>
            tip.classList.remove('selected')
        )
    DisableEnableGenerateBill() 
})

discountInput.addEventListener("input", ()=>{
    discountPercentage = parseInt(discountInput.value);
    DisableEnableGenerateBill()
})

resetBtn.addEventListener('click', () => {
    tipPercentage = 0
    billAmountInput.value = ''
    customTipInput.value = ''
    numberOfPeopleInput.value = ''
    tipAmountOutput.innerText = ''
    totalBillOutput.innerText = ''
    eachPersonBillOutput.innerText = ''
        ;[...tipsContainer.children].forEach((tip) =>
            tip.classList.remove('selected')
        )

    resetBtn.disabled = true
    generateBillBtn.disabled = true
})

billAmountInput.addEventListener('input', () => {
    if (billAmountInput.value) {
        customTipInput.disabled = false
        numberOfPeopleInput.disabled = false
        tipsContainer.classList.remove('disabled')
        discountInput.disabled = false;
    } else {
        customTipInput.disabled = true
        numberOfPeopleInput.disabled = true
        discountInput.disabled = true
        tipsContainer.classList.add('disabled')
    }
})

numberOfPeopleInput.addEventListener('input', DisableEnableGenerateBill )