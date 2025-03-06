const programs = [
    {name: "Sharks", date: "March 16th to April 20th", time: "Sundays 8:00am", location: "La Crosse", capacity: 10, price: "$50", description: "Swim with the sharks"},
];

function Program( name, date, time, location, capacity, price, description ) {
    this.id = uuidv4();
    this.name = name;
    this.date = date;
    this.time = time;
    this.location = location;
    this.capacity = capacity;
    this.price = price;
    this.description = description;
 };
