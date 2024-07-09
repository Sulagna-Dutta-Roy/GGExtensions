
document.getElementById('generate-outfit').addEventListener('click', function() {
    const occasion = document.getElementById('occasion').value;
    const weather = document.getElementById('weather').value;
    
    let outfit = `For a ${occasion} occasion in ${weather} weather, you should wear: `;
    
    if (occasion === 'casual' && weather === 'sunny') {
      outfit += 'a light t-shirt, shorts, and sneakers.';
    } else if (occasion === 'formal' && weather === 'sunny') {
      outfit += 'a suit with a tie and dress shoes.';
    } else if (occasion === 'party' && weather === 'sunny') {
      outfit += 'a stylish shirt, jeans, and loafers.';
    } else if (occasion === 'casual' && weather === 'rainy') {
      outfit += 'a waterproof jacket, jeans, and boots.';
    } else if (occasion === 'formal' && weather === 'rainy') {
      outfit += 'a trench coat over your suit and waterproof shoes.';
    } else if (occasion === 'party' && weather === 'rainy') {
      outfit += 'a trendy jacket, pants, and waterproof shoes.';
    } else if (occasion === 'casual' && weather === 'cold') {
      outfit += 'a warm sweater, jeans, and boots.';
    } else if (occasion === 'formal' && weather === 'cold') {
      outfit += 'a wool suit, scarf, and dress boots.';
    } else if (occasion === 'party' && weather === 'cold') {
      outfit += 'a fashionable coat, trousers, and boots.';
    } else {
      outfit += 'appropriate clothing for the occasion and weather.';
    }
    
    document.getElementById('outfit-result').textContent = outfit;
  });
  