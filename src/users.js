const students = [
    {
        "_id": "5d722f926610d9411f84765e",
        "name": "Sumant Mishra",
        "__v": 0
    },
    {
        "_id": "5d722f996610d9411f84765f",
        "name": "Ravi Tomar",
        "__v": 0
    },
    {
        "_id": "5d722f9f6610d9411f847660",
        "name": "Kapil Kumar",
        "__v": 0
    }
]

const companies = [
    {
        "_id": "5d722ea0c5765940b8bf1d9b",
        "name": "BMW",
        "logo": "http://localhost:8085/images/bmw.jpeg",
        "__v": 0
    },
    {
        "_id": "5d722eb4c5765940b8bf1d9c",
        "name": "Company",
        "logo": "http://localhost:8085/images/company.png",
        "__v": 0
    },
    {
        "_id": "5d722ec3c5765940b8bf1d9d",
        "name": "Facebook",
        "logo": "http://localhost:8085/images/fb.jpeg",
        "__v": 0
    },
    {
        "_id": "5d722ed2c5765940b8bf1d9e",
        "name": "Ford",
        "logo": "http://localhost:8085/images/ford.jpeg",
        "__v": 0
    },
    {
        "_id": "5d722edec5765940b8bf1d9f",
        "name": "P & G",
        "logo": "http://localhost:8085/images/png.jpeg",
        "__v": 0
    },
    {
        "_id": "5d722ee9c5765940b8bf1da0",
        "name": "TeamWork",
        "logo": "http://localhost:8085/images/teamwork.jpeg",
        "__v": 0
    }
]

const Student = students[0]

const Company = companies[0]


const currentUser = {
    user: Company,
    role: "student"
}

module.exports = currentUser;


