import { connect, ConnectOptions } from 'mongoose';

export const dbConnect = () => {
    connect("mongodb+srv://liosferrero:wwtG5MjjOn93xCzk@cluster0.8ssvooy.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("connected to database"),
        (error) => console.log(error)
    );
}
