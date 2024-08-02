function findZodiacSign() {
    const dob = document.getElementById('dob').value;
    const result1 = document.getElementById('result1');
    const result2 = document.getElementById('result2');
    const result3 = document.getElementById('result3');

    if (!dob) {
        result1.textContent = 'Please enter your date of birth.';
        return;
    }

    const date = new Date(dob);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; 

    let zodiacSign = '';
    let planet='';
    let traits='';

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        zodiacSign = 'Aquarius';
        planet='Uranus';
        traits="Innovative, Independent, Humanitarian, Intellectual, Unpredictable and Aloof.";
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
        zodiacSign = 'Pisces';
        planet='Neptune';
        traits="Compassionate, Artistic, Intuitive, Gentle, Wise, Fearful and Overly trusting.";
    } else if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        zodiacSign = 'Aries';
        planet='Mars';
        traits="Energetic, Courageous, Determined, Confident, Enthusiastic, Passionate, Impatient and Impulsive.";
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        zodiacSign = 'Taurus';
        planet='Earth';
        traits="Reliable, Patient, Practical, Devoted, Responsible, Stable, Stubborn and Possessive.";
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        zodiacSign = 'Gemini';
        planet='Mercury';
        traits="Adaptable, Outgoing, Intelligent, Versatile, Curious, Indecisive and Inconsistent.";
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        zodiacSign = 'Cancer';
        planet='Moon';
        traits="Emotional, Intuitive, Nurturing, Protective, Loyal, Moody and Insecure.";
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        zodiacSign = 'Leo';
        planet='Sun';
        traits="Confident, Charismatic, Creative, Passionate, Generous, Dramatic and Arrogant.";
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        zodiacSign = 'Virgo';
        planet='Mercury';
        traits="Analytical, Practical, Diligent, Reliable, Modest, Critical and Perfectionist.";
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        zodiacSign = 'Libra';
        planet='Venus';
        traits="Diplomatic, Charming, Sociable, Fair-minded, Idealistic, Indecisive and Superficial.";
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        zodiacSign = 'Scorpio';
        planet='Pluto';
        traits="Intense, Passionate, Resourceful, Brave, Loyal, Secretive and Jealous.";
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        zodiacSign = 'Sagittarius';
        planet='Jupiter';
        traits="Optimistic, Adventurous, Independent, Philosophical, Honest, Irresponsible and Tactless.";
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        zodiacSign = 'Capricorn';
        planet='Saturn';
        traits="Disciplined, Responsible, Ambitious, Practical, Patient, Pessimistic and Stubborn.";
    } else {
        zodiacSign = 'Unknown';
    }

    result1.textContent = `Your Zodiac Sign is: ${zodiacSign}`;
    result2.textContent = `Your Planet is: ${planet}`;
    result3.textContent = `Your Traits are: ${traits}`;
}
