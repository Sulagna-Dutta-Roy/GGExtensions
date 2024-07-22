const questions = [
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Paris", correct: true },
            { text: "Rome", correct: false },
            { text: "Madrid", correct: false },
            { text: "Berlin", correct: false },
        ],
    },
    {
        question: "What is the capital of Japan?",
        answers: [
            { text: "Seoul", correct: false },
            { text: "Bangkok", correct: false },
            { text: "Tokyo", correct: true },
            { text: "Beijing", correct: false },
        ],
    },
    {
        question: "What is the capital of Canada?",
        answers: [
            { text: "Toronto", correct: false },
            { text: "Ottawa", correct: true },
            { text: "Vancouver", correct: false },
            { text: "Montreal", correct: false },
        ],
    },
    {
        question: "What is the capital of Australia?",
        answers: [
            { text: "Canberra", correct: true },
            { text: "Sydney", correct: false },
            { text: "Melbourne", correct: false },
            { text: "Brisbane", correct: false },
        ],
    },
    {
        question: "What is the capital of Brazil?",
        answers: [
            { text: "São Paulo", correct: false },
            { text: "Rio de Janeiro", correct: false },
            { text: "Salvador", correct: false },
            { text: "Brasília", correct: true },
        ],
    },
    {
        question: "What is the capital of Germany?",
        answers: [
            { text: "Berlin", correct: true },
            { text: "Munich", correct: false },
            { text: "Frankfurt", correct: false },
            { text: "Hamburg", correct: false },
        ],
    },
    {
        question: "What is the capital of Russia?",
        answers: [
            { text: "Saint Petersburg", correct: false },
            { text: "Kiev", correct: false },
            { text: "Moscow", correct: true },
            { text: "Minsk", correct: false },
        ],
    },
    {
        question: "What is the capital of India?",
        answers: [
            { text: "Mumbai", correct: false },
            { text: "Gujrat", correct: false },
            { text: "Kolkata", correct: false },
            { text: "New Delhi", correct: true },
        ],
    },
    {
        question: "What is the capital of Italy?",
        answers: [
            { text: "Venice", correct: false },
            { text: "Rome", correct: true },
            { text: "Milan", correct: false },
            { text: "Florence", correct: false },
        ],
    },
    {
        question: "What is the capital of South Africa?",
        answers: [
            { text: "Pretoria", correct: true },
            { text: "Cape Town", correct: false },
            { text: "Johannesburg", correct: false },
            { text: "Durban", correct: false },
        ],
    },
    {
        question: "What is the capital of China",
        answers: [
            { text: "Shanghai", correct: false },
            { text: "Guangzhou", correct: false },
            { text: "Beijing", correct: true },
            { text: "Shenzhen", correct: false },
        ],
    },
    {
        question: "What is the capital of Egypt?",
        answers: [
            { text: "Alexandria", correct: false },
            { text: "Giza", correct: false },
            { text: "Luxor", correct: false },
            { text: "Cairo", correct: true },
        ],
    },
    {
        question: "What is the capital of Argentina?",
        answers: [
            { text: "Cordoba", correct: false },
            { text: "Buenos Aires", correct: true },
            { text: "Rosario", correct: false },
            { text: "Mendoza", correct: false },
        ],
    },
    {
        question: "What is the capital of Mexico?",
        answers: [
            { text: "Guadalajara", correct: false },
            { text: "Monterrey", correct: false },
            { text: "Cancun", correct: false },
            { text: "Mexico City", correct: true },
        ],
    },
    {
        question: "What is the capital of Saudi Arabia?",
        answers: [
            { text: "Jeddah", correct: false },
            { text: "Riyadh", correct: true },
            { text: "Mecca", correct: false },
            { text: "Medina", correct: false },
        ],
    },
    {
        question: "What is the capital of Turkey?",
        answers: [
            { text: "Ankara", correct: true },
            { text: "Istanbul", correct: false },
            { text: "Izmir", correct: false },
            { text: "Antalya", correct: false },
        ],
    },
    {
        question: "What is the capital of Greece?",
        answers: [
            { text: "Thessaloniki", correct: false },
            { text: "Athens", correct: true },
            { text: "Heraklion", correct: false },
            { text: "Patras", correct: false },
        ],
    },
    {
        question: "What is the capital of Kenya?",
        answers: [
            { text: "Nairobi", correct: true },
            { text: "Mombasa", correct: false },
            { text: "Kisumu", correct: false },
            { text: "Nakuru", correct: false },
        ],
    },
    {
        question: "What is the capital of Thailand?",
        answers: [
            { text: "Chiang Mai", correct: false },
            { text: "Pattaya", correct: false },
            { text: "Phuket", correct: false },
            { text: "Bangkok", correct: true },
        ],
    },
    {
        question: "What is the capital of Spain?",
        answers: [
            { text: "Barcelona", correct: false },
            { text: "Valencia", correct: false },
            { text: "Madrid", correct: true },
            { text: "Seville", correct: false },
        ],
    },
    {
        question: "What is the capital of Norway?",
        answers: [
            { text: "Bergen", correct: false },
            { text: "Stavanger", correct: false },
            { text: "Trondheim", correct: false },
            { text: "Oslo", correct: true },
        ],
    },
    {
        question: "What is the capital of Sweden?",
        answers: [
            { text: "Gothenburg", correct: false },
            { text: "Malmo", correct: false },
            { text: "Stockholm", correct: true },
            { text: "Uppsala", correct: false },
        ],
    },
    {
        question: "What is the capital of the Netherlands?",
        answers: [
            { text: "Amsterdam", correct: true },
            { text: "Rotterdam", correct: false },
            { text: "The Hague", correct: false },
            { text: "Utrecht", correct: false },
        ],
    },
    {
        question: "What is the capital of Hungary?",
        answers: [
            { text: "Debrecen", correct: false },
            { text: "Budapest", correct: true },
            { text: "Szeged", correct: false },
            { text: "Pecs", correct: false },
        ],
    },
    {
        question: "What is the capital of Poland?",
        answers: [
            { text: "Krakow", correct: false },
            { text: "Gdansk", correct: false },
            { text: "Warsaw", correct: true },
            { text: "Wroclaw", correct: false },
        ],
    },
    {
        question: "What is the capital of Iraq?",
        answers: [
            { text: "Baghdad", correct: true },
            { text: "Mosul", correct: false },
            { text: "Basra", correct: false },
            { text: "Erbil", correct: false },
        ],
    },
    {
        question: "What is the capital of Qatar?",
        answers: [
            { text: "Doha", correct: true },
            { text: "Al Wakrah", correct: false },
            { text: "Al Khor", correct: false },
            { text: "Al Rayyan", correct: false },
        ],
    },
    {
        question: "What is the capital of New Zealand?",
        answers: [
            { text: "Auckland", correct: false },
            { text: "Christchurch", correct: false },
            { text: "Hamilton", correct: false },
            { text: "Wellington", correct: true },
        ],
    },
    {
        question: "What is the capital of Denmark?",
        answers: [
            { text: "Aarhus", correct: false },
            { text: "Copenhagen", correct: true },
            { text: "Odense", correct: false },
            { text: "Aalborg", correct: false },
        ],
    },
    {
        question: "What is the capital of Ireland?",
        answers: [
            { text: "Galway", correct: false },
            { text: "Cork", correct: false },
            { text: "Dublin", correct: true },
            { text: "Limerick", correct: false },
        ],
    },
    {
        question: "What is the capital of Belgium?",
        answers: [
            { text: "Ghent", correct: false },
            { text: "Bruges", correct: false },
            { text: "Antwerp", correct: false },
            { text: "Brussels", correct: true },
        ],
    },
    {
        question: "What is the capital of Nigeria?",
        answers: [
            { text: "Abuja", correct: true },
            { text: "Lagos", correct: false },
            { text: "Kano", correct: false },
            { text: "Ibadan", correct: false },
        ],
    },
    {
        question: "What is the capital of Finland?",
        answers: [
            { text: "Turku", correct: false },
            { text: "Helsinki", correct: true },
            { text: "Tampere", correct: false },
            { text: "Espoo", correct: false },
        ],
    },
    {
        question: "What is the capital of Switzerland?",
        answers: [
            { text: "Basel", correct: false },
            { text: "Zurich", correct: false },
            { text: "Bern", correct: true },
            { text: "Geneva", correct: false },
        ],
    },
    {
        question: "What is the capital of Austria?",
        answers: [
            { text: "Salzburg", correct: false },
            { text: "Graz", correct: false },
            { text: "Innsbruck", correct: false },
            { text: "Vienna", correct: true },
        ],
    },
    {
        question: "What is the capital of Portugal?",
        answers: [
            { text: "Lisbon", correct: true },
            { text: "Porto", correct: false },
            { text: "Faro", correct: false },
            { text: "Coimbra", correct: false },
        ],
    },
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Paris", correct: true },
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false },
            { text: "Rome", correct: false },
        ],
    },
    {
        question: "Which river flows through Cairo?",
        answers: [
            { text: "Nile", correct: true },
            { text: "Amazon", correct: false },
            { text: "Mississippi", correct: false },
            { text: "Danube", correct: false },
        ],
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        answers: [
            { text: "China", correct: false },
            { text: "Japan", correct: true },
            { text: "Thailand", correct: false },
            { text: "South Korea", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
            { text: "Fe", correct: false },
            { text: "Pb", correct: false },
        ],
    },
    {
        question: "Who discovered penicillin?",
        answers: [
            { text: "Alexander Fleming", correct: true },
            { text: "Marie Curie", correct: false },
            { text: "Albert Einstein", correct: false },
            { text: "Isaac Newton", correct: false },
        ],
    },
    {
        question: "What is the largest organ in the human body?",
        answers: [
            { text: "Liver", correct: true },
            { text: "Heart", correct: false },
            { text: "Brain", correct: false },
            { text: "Skin", correct: false },
        ],
    },
    {
        question: "In which year did World War II end?",
        answers: [
            { text: "1943", correct: false },
            { text: "1945", correct: true },
            { text: "1950", correct: false },
            { text: "1939", correct: false },
        ],
    },
    {
        question: "Who was the first President of the United States?",
        answers: [
            { text: "George Washington", correct: true },
            { text: "Thomas Jefferson", correct: false },
            { text: "Abraham Lincoln", correct: false },
            { text: "John Adams", correct: false },
        ],
    },
    {
        question:
            "What was the name of the ship that carried the Pilgrims to America in 1620?",
        answers: [
            { text: "Mayflower", correct: true },
            { text: "Santa Maria", correct: false },
            { text: "Nina", correct: false },
            { text: "Pinta", correct: false },
        ],
    },
    {
        question: "Who wrote the novel 'Pride and Prejudice'?",
        answers: [
            { text: "Jane Austen", correct: true },
            { text: "Charles Dickens", correct: false },
            { text: "Leo Tolstoy", correct: false },
            { text: "F. Scott Fitzgerald", correct: false },
        ],
    },
    {
        question: "Who wrote the play 'Hamlet'?",
        answers: [
            { text: "William Shakespeare", correct: true },
            { text: "Anton Chekhov", correct: false },
            { text: "Oscar Wilde", correct: false },
            { text: "George Bernard Shaw", correct: false },
        ],
    },
    {
        question: "What is the smallest bone in the human body?",
        answers: [
            { text: "Stapes", correct: true },
            { text: "Femur", correct: false },
            { text: "Humerus", correct: false },
            { text: "Patella", correct: false },
        ],
    },
    {
        question: "Which country is the largest by land area?",
        answers: [
            { text: "Russia", correct: true },
            { text: "Canada", correct: false },
            { text: "China", correct: false },
            { text: "United States", correct: false },
        ],
    },
    {
        question: "Who was the first man to walk on the moon?",
        answers: [
            { text: "Neil Armstrong", correct: true },
            { text: "Buzz Aldrin", correct: false },
            { text: "Yuri Gagarin", correct: false },
            { text: "John Glenn", correct: false },
        ],
    },
    {
        question: "What is the longest river in the world?",
        answers: [
            { text: "Nile", correct: true },
            { text: "Amazon", correct: false },
            { text: "Yangtze", correct: false },
            { text: "Mississippi", correct: false },
        ],
    },
    {
        question: "What is the capital of Australia?",
        answers: [
            { text: "Sydney", correct: false },
            { text: "Melbourne", correct: false },
            { text: "Canberra", correct: true },
            { text: "Perth", correct: false },
        ],
    },
    {
        question: "Which river flows through Cairo?",
        answers: [
            { text: "Nile", correct: true },
            { text: "Amazon", correct: false },
            { text: "Mississippi", correct: false },
            { text: "Danube", correct: false },
        ],
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        answers: [
            { text: "China", correct: false },
            { text: "Japan", correct: true },
            { text: "Thailand", correct: false },
            { text: "South Korea", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
            { text: "Fe", correct: false },
            { text: "Pb", correct: false },
        ],
    },
    {
        question: "Who discovered penicillin?",
        answers: [
            { text: "Alexander Fleming", correct: true },
            { text: "Marie Curie", correct: false },
            { text: "Albert Einstein", correct: false },
            { text: "Isaac Newton", correct: false },
        ],
    },
    {
        question: "What is the largest organ in the human body?",
        answers: [
            { text: "Liver", correct: true },
            { text: "Heart", correct: false },
            { text: "Brain", correct: false },
            { text: "Skin", correct: false },
        ],
    },
    {
        question: "In which year did World War II end?",
        answers: [
            { text: "1943", correct: false },
            { text: "1945", correct: true },
            { text: "1950", correct: false },
            { text: "1939", correct: false },
        ],
    },
    {
        question: "Who was the first President of the United States?",
        answers: [
            { text: "George Washington", correct: true },
            { text: "Thomas Jefferson", correct: false },
            { text: "Abraham Lincoln", correct: false },
            { text: "John Adams", correct: false },
        ],
    },
    {
        question:
            "What was the name of the ship that carried the Pilgrims to America in 1620?",
        answers: [
            { text: "Mayflower", correct: true },
            { text: "Santa Maria", correct: false },
            { text: "Nina", correct: false },
            { text: "Pinta", correct: false },
        ],
    },
    {
        question: "Who wrote the novel 'Pride and Prejudice'?",
        answers: [
            { text: "Jane Austen", correct: true },
            { text: "Charles Dickens", correct: false },
            { text: "Leo Tolstoy", correct: false },
            { text: "F. Scott Fitzgerald", correct: false },
        ],
    },
    {
        question: "Who wrote the play 'Hamlet'?",
        answers: [
            { text: "William Shakespeare", correct: true },
            { text: "Anton Chekhov", correct: false },
            { text: "Oscar Wilde", correct: false },
            { text: "George Bernard Shaw", correct: false },
        ],
    },
    {
        question: "What is the smallest bone in the human body?",
        answers: [
            { text: "Stapes", correct: true },
            { text: "Femur", correct: false },
            { text: "Humerus", correct: false },
            { text: "Patella", correct: false },
        ],
    },
    {
        question: "Which country is the largest by land area?",
        answers: [
            { text: "Russia", correct: true },
            { text: "Canada", correct: false },
            { text: "China", correct: false },
            { text: "United States", correct: false },
        ],
    },
    {
        question: "Who was the first man to walk on the moon?",
        answers: [
            { text: "Neil Armstrong", correct: true },
            { text: "Buzz Aldrin", correct: false },
            { text: "Yuri Gagarin", correct: false },
            { text: "John Glenn", correct: false },
        ],
    },
    {
        question: "What is the longest river in the world?",
        answers: [
            { text: "Nile", correct: true },
            { text: "Amazon", correct: false },
            { text: "Yangtze", correct: false },
            { text: "Mississippi", correct: false },
        ],
    },
    {
        question:
            "Which planet in our solar system is known as the Red Planet?",
        answers: [
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
            { text: "Venus", correct: false },
        ],
    },
    {
        question:
            "Who is the author of the famous book 'To Kill a Mockingbird'?",
        answers: [
            { text: "Harper Lee", correct: true },
            { text: "F. Scott Fitzgerald", correct: false },
            { text: "Jane Austen", correct: false },
            { text: "J.K. Rowling", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for silver?",
        answers: [
            { text: "Ag", correct: true },
            { text: "Au", correct: false },
            { text: "Hg", correct: false },
            { text: "Pb", correct: false },
        ],
    },
    {
        question: "Which musician is known as the 'King of Rock and Roll'?",
        answers: [
            { text: "Elvis Presley", correct: true },
            { text: "Chuck Berry", correct: false },
            { text: "Little Richard", correct: false },
            { text: "Jerry Lee Lewis", correct: false },
        ],
    },
    {
        question: "What is the capital of France?",
        answers: [
            { text: "Paris", correct: true },
            { text: "London", correct: false },
            { text: "Berlin", correct: false },
            { text: "Rome", correct: false },
        ],
    },
    {
        question:
            "Who is the main character in the novel 'The Catcher in the Rye'?",
        answers: [
            { text: "Holden Caulfield", correct: true },
            { text: "Huckleberry Finn", correct: false },
            { text: "Tom Sawyer", correct: false },
            { text: "Jay Gatsby", correct: false },
        ],
    },
    {
        question: "What is the largest mammal on Earth?",
        answers: [
            { text: "Blue whale", correct: true },
            { text: "African elephant", correct: false },
            { text: "Hippopotamus", correct: false },
            { text: "Giraffe", correct: false },
        ],
    },
    {
        question: "Who was the first President of the Soviet Union?",
        answers: [
            { text: "Vladimir Lenin", correct: true },
            { text: "Joseph Stalin", correct: false },
            { text: "Leon Trotsky", correct: false },
            { text: "Mikhail Gorbachev", correct: false },
        ],
    },
    {
        question: "What is the smallest country in the world?",
        answers: [
            { text: "Vatican City", correct: true },
            { text: "Monaco", correct: false },
            { text: "Nauru", correct: false },
            { text: "Tuvalu", correct: false },
        ],
    },
    {
        question: "Who wrote the famous poem 'The Raven'?",
        answers: [
            { text: "Edgar Allan Poe", correct: true },
            { text: "Robert Frost", correct: false },
            { text: "Emily Dickinson", correct: false },
            { text: "Walt Whitman", correct: false },
        ],
    },
    {
        question:
            "What is the process by which water moves through a plant, from the roots to the leaves, and is then released into the air as water vapor?",
        answers: [
            { text: "Transpiration", correct: true },
            { text: "Respiration", correct: false },
            { text: "Photosynthesis", correct: false },
            { text: "Evaporation", correct: false },
        ],
    },
    {
        question: "Which ancient city was the capital of the Inca Empire?",
        answers: [
            { text: "Cuzco", correct: true },
            { text: "Machu Picchu", correct: false },
            { text: "Lima", correct: false },
            { text: "Santiago", correct: false },
        ],
    },
    {
        question: "Who is the author of the famous novel '1984'?",
        answers: [
            { text: "George Orwell", correct: true },
            { text: "Aldous Huxley", correct: false },
            { text: "Ray Bradbury", correct: false },
            { text: "Kurt Vonnegut", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for gold?",
        answers: [
            { text: "Au", correct: true },
            { text: "Ag", correct: false },
            { text: "Hg", correct: false },
            { text: "Pb", correct: false },
        ],
    },
    {
        question:
            "Which planet in our solar system is known for being the hottest?",
        answers: [
            { text: "Venus", correct: true },
            { text: "Mars", correct: false },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
        ],
    },
    {
        question: "Who was the leader of the Soviet Union during World War II?",
        answers: [
            { text: "Joseph Stalin", correct: true },
            { text: "Vladimir Lenin", correct: false },
            { text: "Leon Trotsky", correct: false },
            { text: "Mikhail Gorbachev", correct: false },
        ],
    },
    {
        question: "What is the largest living species of lizard?",
        answers: [
            { text: "Komodo dragon", correct: true },
            { text: "Saltwater crocodile", correct: false },
            { text: "Black mamba", correct: false },
            { text: "Green anaconda", correct: false },
        ],
    },
    {
        question:
            "Who was the first woman to fly solo across the Atlantic Ocean?",
        answers: [
            { text: "Amelia Earhart", correct: true },
            { text: "Harriet Quimby", correct: false },
            { text: "Bessie Coleman", correct: false },
            { text: "Evelyn Bryan Johnson", correct: false },
        ],
    },
    {
        question:
            "What is the process by which an organism's genetic information is passed from one generation to the next?",
        answers: [
            { text: "Hereditary", correct: true },
            { text: "Evolution", correct: false },
            { text: "Genetics", correct: false },
            { text: "Mutation", correct: false },
        ],
    },
    {
        question:
            "Who was the ancient Greek philosopher who taught that 'know thyself' was the most important maxim?",
        answers: [
            { text: "Socrates", correct: true },
            { text: "Plato", correct: false },
            { text: "Aristotle", correct: false },
            { text: "Epicurus", correct: false },
        ],
    },
    {
        question: "What is the world's largest waterfall, by volume of water?",
        answers: [
            { text: "Inga Falls", correct: true },
            { text: "Victoria Falls", correct: false },
            { text: "Iguazu Falls", correct: false },
            { text: "Niagara Falls", correct: false },
        ],
    },
    {
        question:
            "Who is the author of the famous novel 'Pride and Prejudice'?",
        answers: [
            { text: "Jane Austen", correct: true },
            { text: "Charles Dickens", correct: false },
            { text: "Mary Shelley", correct: false },
            { text: "Emily Brontë", correct: false },
        ],
    },
    {
        question: "What is the chemical symbol for copper?",
        answers: [
            { text: "Cu", correct: true },
            { text: "Ag", correct: false },
            { text: "Au", correct: false },
            { text: "Hg", correct: false },
        ],
    },
    {
        question:
            "Which ancient city was the capital of the Mayan civilization?",
        answers: [
            { text: "Tikal", correct: true },
            { text: "Chichen Itza", correct: false },
            { text: "Palenque", correct: false },
            { text: "Coba", correct: false },
        ],
    },
    {
        question: "Who was the first President of the United States?",
        answers: [
            { text: "George Washington", correct: true },
            { text: "John Adams", correct: false },
            { text: "Thomas Jefferson", correct: false },
            { text: "Abraham Lincoln", correct: false },
        ],
    },
    {
        question:
            "What is the process by which the universe became transparent to light?",
        answers: [
            { text: "Recombination", correct: true },
            { text: "Big Bang", correct: false },
            { text: "Dark matter", correct: false },
            { text: "Dark energy", correct: false },
        ],
    },
    {
        question: "Who was the ancient Greek god of the underworld?",
        answers: [
            { text: "Hades", correct: true },
            { text: "Zeus", correct: false },
            { text: "Poseidon", correct: false },
            { text: "Athena", correct: false },
        ],
    },
    {
        question: "What is the largest mammal that ever lived on land?",
        answers: [
            { text: "Indricotherium", correct: true },
            { text: "Woolly mammoth", correct: false },
            { text: "Diplodocus", correct: false },
            { text: "Apatosaurus", correct: false },
        ],
    },
    {
        question:
            "Who was the leader of the Chinese Communist Party during the Chinese Civil War?",
        answers: [
            { text: "Mao Zedong", correct: true },
            { text: "Chiang Kai-shek", correct: false },
            { text: "Sun Yat-sen", correct: false },
            { text: "Deng Xiaoping", correct: false },
        ],
    },
    {
        question:
            "What is the process by which water moves through a plant, from the roots to the leaves, and is then released into the air as water vapor?",
        answers: [
            { text: "Transpiration", correct: true },
            { text: "Respiration", correct: false },
            { text: "Photosynthesis", correct: false },
            { text: "Evaporation", correct: false },
        ],
    },
];
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-btn');
const nextButton = document.getElementById('next-btn');
let currentquinx = 0;
let score = 0;
let shuffledQuestions = [];

function startquiz() {
    currentquinx = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 10); // Shuffle and select 10 questions
    ShowQuestion();
}

function ShowQuestion() {
    resetState();
    let currentque = shuffledQuestions[currentquinx];
    let questionNo = currentquinx + 1;
    questionElement.innerHTML = questionNo + ". " + currentque.question;
    currentque.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add("btn");
        // button.addEventListener('click', () => checkAnswer(answer.correct));
        answerButtons.appendChild(button); 
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    
    })
}

function resetState() {
    nextButton.style.display = 'none';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect"); 
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

function ShowScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${shuffledQuestions.length} !`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentquinx++;
    if(currentquinx < shuffledQuestions.length) {
        ShowQuestion();
    } else {
        ShowScore();
    }
}

nextButton.addEventListener("click", () => {
    if(currentquinx < shuffledQuestions.length) {
        handleNextButton();
    } else {
        startquiz();
    }
});

startquiz();