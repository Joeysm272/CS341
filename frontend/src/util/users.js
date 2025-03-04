const users = [
    {username: 'staff', password: 'staff', staff: true},
    {username: 'Jane', password: 'Doe', member: true},
    {username: 'Luke', password: 'Anderson', member: false},
];

export const findUser = (username, password) => {
    const user = users.find(p => p.username === username);
    console.log(user)
    if(user && user.password == password) {
        return user;
    }
}

