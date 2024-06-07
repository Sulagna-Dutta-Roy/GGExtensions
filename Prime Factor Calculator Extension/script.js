
document.getElementById('myButton').addEventListener('click', function () {
    let num = document.querySelector(".number").value;
    let how = document.querySelector(".showHow");
    how.textContent = (`(${((prime_factors(num).join(", ")))})`)
}
)
function prime_factors(num) {
    // Function to check if a number is prime
    function is_prime(num) {
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    const result = []; // Initialize an empty array to store prime factors

    for (let i = 2; i <= num; i++) {

        while (is_prime(i) && num % i === 0) {
            if (!result.includes(i)) result.push(i); // Add 'i' to the result array if it's not already present
            num /= i;
        }
    }

    return result; // Return the array containing prime factors
}