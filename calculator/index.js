const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let main = {
    numbers: [],
    windowPrevState: [],
    windowCurrState: [],
    avg: 0
};

const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`http://20.244.56.144/test/${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDc2MDQ3LCJpYXQiOjE3MTcwNzU3NDcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjExZTc2YWM0LThkZWYtNDMxYi1iNGZmLWM0ZTQ1NzJmZTE1NiIsInN1YiI6InB1cnVtYW5pYXNoaXNocmVkZHlAZ21haWwuY29tIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkbWVkIiwiY2xpZW50SUQiOiIxMWU3NmFjNC04ZGVmLTQzMWItYjRmZi1jNGU0NTcyZmUxNTYiLCJjbGllbnRTZWNyZXQiOiJpVWV5dkJmaEZpcFZjb0pyIiwib3duZXJOYW1lIjoiUC5Bc2hpc2ggUmVkZHkiLCJvd25lckVtYWlsIjoicHVydW1hbmlhc2hpc2hyZWRkeUBnbWFpbC5jb20iLCJyb2xsTm8iOiIyNDUzMjE3MzMwNDkifQ.ETvRLl5xr1vYP7TVnxeiTRlK4Q5rgQsg9vE531y-7Aw"
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data');
    }
};

const averaged = (array) => {
    let sum = 0;
    for(let i = 0;i<array.length;i++) {
        sum += array[i];
    }
    return sum/array.length;
}

const updateMainObject = (newNumbers) => {
    main.windowPrevState = [...main.windowCurrState];
    main.numbers = newNumbers;
    main.windowCurrState = main.numbers.filter(num => !main.windowPrevState.includes(num));
    main.avg = averaged(main.windowCurrState);
};

app.post("/number/:numberid", async (req, res) => {
    try {
        const numberid = req.params.numberid;

        let newNumbers = [];

        switch (numberid) {
            case 'p':
                newNumbers = await fetchData("primes");
                break;
            case 'f':
                newNumbers = await fetchData("fibo");
                break;
            case 'e':
                newNumbers = await fetchData("even");
                break;
            case 'r':
                newNumbers = await fetchData("rand");
                break;
        }

        updateMainObject(newNumbers);

        res.send(main);
    } catch (error) {
        console.error('Error occurred');
    }
});

app.listen(3000, console.log("Server is running on port 3000"));
