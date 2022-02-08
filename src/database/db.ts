import mongoose from "mongoose";
import chalk from "chalk";

let dbPath: string;
if (process.env.NODE_ENV === "development") {
  dbPath = process.env.MONGO_URI_DEV;
} else if (process.env.NODE_ENV === "production") {
  dbPath = process.env.MONGO_URI;
} else {
  dbPath = process.env.MONGO_URI_DEV;
}
mongoose.connect(
  dbPath
  //   {
  //   useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false,
  //   useUnifiedTopology: true,
  // }
);
const db = mongoose.connection;
db.on("error", () => {
  console.log(chalk.red("Error occurred from the database"));
});
db.once("open", () => {
  console.log(
    chalk.cyan.underline.bold(
      `Successfully opened the ${process.env.NODE_ENV} database`
    )
  );
});

export default db;
