document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("testCaseForm");
    const generateButton = document.getElementById("generateButton");
    const clearButton = document.getElementById("clearButton");
    const copyButton = document.getElementById("copyButton");
    const outputDiv = document.getElementById("output");
    const lengthInput = document.getElementById("length");
    const datatypeRadios = document.getElementsByName("datatype");
    const testtypeRadios = document.getElementsByName("testtype");
    const sentenceRadios = document.getElementById("sentence");
    const arraySizeInput = document.getElementById("arraySize");
    const arraySizeContainer = document.getElementById("arraySizeContainer");
    const floatDecimalContainer = document.getElementById(
        "floatDecimalContainer"
    );
    const floatDecimalSize = document.getElementById("floatDecimalSize");

    const sentences = [
        "A quick brown fox jumps over the lazy dog",
        "The quick brown fox jumps over the lazy dog",
        "Lorem ipsum dolor sit amet",
        "The rain in Spain stays mainly in the plain",
        "To be or not to be, that is the question",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness",
        "She sells seashells by the seashore",
        "How much wood would a woodchuck chuck if a woodchuck could chuck wood",
        "Peter Piper picked a peck of pickled peppers",
        "Jack and Jill went up the hill to fetch a pail of water",
        "Humpty Dumpty sat on a wall, Humpty Dumpty had a great fall",
        "The quick brown fox jumps over the lazy dog again and again to see if the lazy dog will react",
        "All work and no play makes Jack a dull boy",
        "The five boxing wizards jump quickly",
        "Pack my box with five dozen liquor jugs",
        "The quick brown fox jumps over the lazy dog while the dog watches the fox",
        "A wizard's job is to vex chumps quickly in fog",
        "Crazy Fredrick bought many very exquisite opal jewels",
        "We promptly judged antique ivory buckles for the next prize",
        "How razorback-jumping frogs can level six piqued gymnasts",
        "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent",
        "Jinxed wizards pluck ivy from the big quilt",
        "The July sun set quickly and created a shadowy twilight",
        "Just keep examining every low bid quoted for zinc etchings",
        "My girl wove six dozen plaid jackets before she quit",
        "The wizard quickly jinxed the gnomes before they vaporized",
        "Whenever the black fox jumped the squirrel gazed suspiciously",
        "The job requires extra pluck and zeal from every young wage earner",
        "Mr. Jock, TV quiz PhD, bags few lynx",
        "Grumpy wizards make a toxic brew for the jovial queen",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ratione nam temporibus rem? Adipisci id blanditiis quia! Molestias nisi necessitatibus in omnis sapiente delectus eveniet distinctio nulla, vero, ea error! Quae soluta voluptatum amet nesciunt? Quod voluptate molestias earum et nesciunt laborum perferendis vel temporibus neque? Nam facere et dignissimos voluptatum odit quae accusamus recusandae fuga vitae possimus, ratione nobis? Odio atque tempora, voluptatem placeat distinctio animi in, suscipit sit soluta nisi asperiores earum rerum mollitia. Aspernatur doloribus recusandae corrupti vel? Et veniam accusamus enim eius corrupti commodi vitae dignissimos.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit neque, tenetur repudiandae, eum nam ea officia quaerat molestiae animi perspiciatis accusantium cum earum, eos numquam vel pariatur consectetur? Ad, maxime? Hic dolorum, illum quam aliquid eaque veniam voluptatum itaque magni velit labore eius temporibus nostrum, necessitatibus, assumenda nisi perferendis dolorem ea odio expedita tenetur. Ratione culpa earum error eaque quia! Fugiat amet eos soluta, beatae quisquam esse quas quam ducimus necessitatibus? Vel facilis voluptate eos quae accusantium. Facere, eos recusandae illum, est commodi quos, harum reiciendis nisi mollitia quia beatae? Sint nulla perspiciatis recusandae voluptatem. Debitis ea, dicta libero, quod fugit ab hic ex itaque, velit laudantium minima et ipsa repellat fugiat dolorum nemo? Facere eum provident dolor quo pariatur? Delectus, repellat. Tenetur voluptatibus explicabo harum odit consequatur id quasi optio nobis, ducimus illum soluta maxime accusamus neque, aut voluptates impedit quod assumenda, sequi excepturi quo consequuntur totam dicta consectetur. Iure excepturi odio suscipit reiciendis odit itaque magni. Expedita modi veritatis provident molestiae ratione nesciunt fugiat, omnis, dolorem, obcaecati quasi dolor magnam! Necessitatibus veniam ex assumenda, aliquid placeat odit accusantium. Maiores deserunt eum, dolorem est totam illum quidem. Modi eligendi eum et, nostrum in tempora sequi ab nobis quo sunt debitis eaque laborum provident asperiores error repellat tenetur, laudantium obcaecati. Dolore voluptas voluptates, corporis cum vel doloribus esse eos harum unde a, cupiditate ab laboriosam voluptatum numquam tempora quas assumenda enim odit placeat, exercitationem nihil commodi! Dolores animi dignissimos facilis! Ipsum laborum vel repellat consequuntur modi. Nam eaque laboriosam architecto earum ipsam, officiis iste nobis aliquid quod libero sint vel, enim delectus laudantium numquam perferendis odio odit, aperiam culpa? Ratione. Expedita ad eos eius dolore natus placeat ea, perferendis corrupti cumque at. Iusto natus repellendus eius animi sint voluptates iure quidem esse laudantium fugiat dolor, ratione suscipit, exercitationem soluta laboriosam!",
        "In the vast expanse of digital landscapes, where algorithms hum and code flows like an endless river of logic, programmers are the architects of a new age. They wield languages like tools, crafting solutions that transform mere ideas into tangible innovations. From the depths of databases to the heights of cloud computing, their work shapes the very fabric of our interconnected world. At the heart of this digital revolution lies the art and science of software development. It is a realm where creativity meets precision, where a single misplaced semicolon can bring down kingdoms, yet a well-crafted function can spark revolutions. In this realm, languages such as Python, JavaScript, and Java are not just means of communication but conduits of ideas, enabling coders to breathe life into lines of code. Imagine a programmer, seated at a desk adorned with screens displaying lines upon lines of code. Each line tells a story of problem-solving, of debugging, and of the relentless pursuit of efficiency. The modern coder is not merely a technician but a storyteller, weaving narratives of logic and structure that define the applications we use daily. From the early days of punch cards and mainframes to today's era of artificial intelligence and blockchain, the evolution of programming languages mirrors the evolution of human thought. Each language, whether it be the simplicity of HTML or the elegance of Swift, offers a unique perspective on how to express computational ideas. It is through these languages that coders converse with machines, instructing them to perform tasks that were once considered impossible. In the realm of open-source software, collaboration reigns supreme. Communities of developers converge online, sharing snippets of code, debating best practices, and collectively pushing the boundaries of what is achievable. GitHub repositories resemble libraries of knowledge, where anyone with an internet connection can access the collective wisdom of thousands. But programming is not just about syntax and algorithms; it's about mindset and methodology. Agile methodologies have revolutionized how teams collaborate, emphasizing iterative development, continuous improvement, and adaptive responses to change. DevOps practices have blurred the lines between development and operations, fostering environments where code deployment is as fluid as code creation. In the age of cybersecurity threats and data breaches, the role of programmers extends beyond writing elegant code. It encompasses fortifying systems against vulnerabilities, encrypting sensitive information, and ensuring the integrity of digital transactions. Ethical considerations loom large, urging developers to prioritize privacy, inclusivity, and the responsible use of technology. As artificial intelligence and machine learning reshape industries, programmers find themselves at the forefront of innovation. They harness the power of data to train neural networks, predict market trends, diagnose medical conditions, and even drive autonomous vehicles. The marriage of code and AI promises a future where machines not only execute tasks but also augment human capabilities in ways previously unimaginable. In conclusion, the world of programming is a vibrant tapestry of innovation and collaboration. It is a realm where curiosity fuels exploration, where logic meets creativity, and where every line of code represents a step toward a brighter future. For those who dare to venture into this digital frontier, the possibilities are limitless, and the journey is as rewarding as the destinations it unveils.",
    ];

    function updateTestTypeRadios() {
        const datatype = getCheckedValue(datatypeRadios);
        for (let radio of testtypeRadios) {
            radio.disabled = !datatype;
        }
    }

    form.addEventListener("change", function () {
        const datatype = getCheckedValue(datatypeRadios);
        const testtype = getCheckedValue(testtypeRadios);

        updateTestTypeRadios();

        // Disable sentence checkbox for integer, float, and long
        if (datatype === "int" || datatype === "float" || datatype === "long") {
            sentenceRadios.disabled = true;
        } else {
            sentenceRadios.disabled = false;
        }

        // For char, set length to 1 if simple single test case is selected
        if (datatype === "char") {
            if (testtype === "simple" || testtype === "array") {
                lengthInput.value = 1;
                lengthInput.disabled = true;
            } else {
                lengthInput.disabled = false;
            }
        } else {
            lengthInput.disabled = false;
        }

        // Disable sentence checkbox for char
        if (datatype === "char") {
            sentenceRadios.disabled = true;
        }

        // Set length constraints based on datatype
        if (datatype === "int") {
            lengthInput.max = 10;
            if (lengthInput.value > 10)
                lengthInput.value = Math.min(lengthInput.value, 10);
        }
        if (datatype === "float") {
            lengthInput.min = 2;
            lengthInput.value = Math.max(lengthInput.value, 2);
            floatDecimalContainer.style.display = "block";
            const floatSize = parseInt(floatDecimalSize.value, 10);
            if (floatSize > lengthInput.value - 1) {
                floatSize.min = lengthInput.value - 1;
                floatDecimalSize.value = Math.min(
                    floatSize,
                    lengthInput.value - 1
                );
            }
        } else if (datatype === "long") {
            lengthInput.min = 7;
            lengthInput.value = Math.max(lengthInput.value, 7);
        } else {
            lengthInput.min = 1;
            floatDecimalContainer.style.display = "none";
        }

        // Show or hide array size input based on test case type
        if (testtype === "array") {
            arraySizeContainer.style.display = "block";
        } else {
            arraySizeContainer.style.display = "none";
        }

        if (datatype === "string" && testtype === "sentence") {
            lengthInput.setAttribute("max", "534");
        }
    });

    copyButton.addEventListener("click", function () {
        copyToClipboard(outputDiv.innerText);
    });

    clearButton.addEventListener("click", function () {
        clearForm();
    });

    function clearForm() {
        form.reset();
        outputDiv.innerHTML = "";
        copyButton.style.display = "none";
        arraySizeContainer.style.display = "none";
        lengthInput.disabled = false;
        sentenceRadios.disabled = false;
    }

    generateButton.addEventListener("click", function () {
        const datatype = getCheckedValue(datatypeRadios);
        const testtype = getCheckedValue(testtypeRadios);
        const length = parseInt(lengthInput.value, 10);
        const arraySize = parseInt(arraySizeInput.value, 10);
        const floatSize = parseInt(floatDecimalSize.value, 10);

        if (validateInput(datatype, testtype, length, floatSize)) {
            let testCase = generateTestCase(
                datatype,
                testtype,
                length,
                arraySize,
                floatSize
            );
            outputDiv.innerHTML = `<p>${JSON.stringify(testCase, null, 2)}</p>`;
            copyButton.style.display = "inline-block";
        } else {
            outputDiv.innerHTML = `<p>Please enter a valid length for the selected datatype and test case type.</p>`;
        }
    });

    function getCheckedValue(radioGroup) {
        for (let i = 0; i < radioGroup.length; i++) {
            if (radioGroup[i].checked) {
                return radioGroup[i].value;
            }
        }
        return null;
    }

    function generateTestCase(
        datatype,
        testtype,
        length,
        arraySize,
        floatSize
    ) {
        let testCase;
        if (testtype === "simple") {
            testCase = generateSingleTestCase(datatype, length, floatSize);
        } else if (testtype === "array") {
            testCase = [];
            for (let i = 0; i < arraySize; i++) {
                testCase.push(
                    generateSingleTestCase(datatype, length, floatSize)
                );
            }
            testCase = testCase.join(", "); // Join array elements into a single line
        } else if (testtype === "sentence" && datatype === "string") {
            testCase = generateSentence(length);
        }
        return testCase;
    }

    function validateInput(datatype, testtype, length, floatSize) {
        console.log("f: " + floatSize);
        if (testtype === "simple" || testtype === "array") {
            if (datatype === "int") {
                return length > 0;
            } else if (datatype === "float") {
                return length >= 2 && floatSize >= 0;
            } else if (datatype === "long") {
                return length >= 7;
            } else if (datatype === "char") {
                return length > 0;
            } else if (datatype === "string") {
                return length > 0;
            }
        } else if (testtype === "sentence" && datatype === "string") {
            return length > 0;
        }
        return false;
    }

    function generateSingleTestCase(datatype, length, floatSize = 0) {
        console.log(length);
        switch (datatype) {
            case "int":
                return Math.floor(Math.random() * Math.pow(10, length));
            case "float":
                return (
                    Math.random() * Math.pow(10, length - floatSize)
                ).toFixed(floatSize);
            case "char":
                const chars =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                return chars.charAt(Math.floor(Math.random() * chars.length));
            case "string":
                const charsAndNums =
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
                return Array.from({ length: length }, () =>
                    charsAndNums.charAt(
                        Math.floor(Math.random() * charsAndNums.length)
                    )
                ).join("");
            case "long":
                return generateRandomLong(length);
            default:
                return null;
        }
    }

    function generateRandomLong(length) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateSentence(wordCount) {
        let filteredSentences = sentences.filter(
            (sentence) => sentence.split(" ").length >= wordCount
        );

        // If no suitable sentence is found, use all available sentences and trim them
        if (filteredSentences.length === 0) {
            filteredSentences = sentences;
        }

        let sentence =
            filteredSentences[
                Math.floor(Math.random() * filteredSentences.length)
            ];
        let words = sentence.split(" ");

        // Return only the required number of words
        return words.slice(0, wordCount).join(" ");
    }

    function copyToClipboard(text) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        alert("Copied to clipboard");
    }

    updateTestTypeRadios(); // Initialize test type radios on load
});
