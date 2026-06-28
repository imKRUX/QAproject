import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "lib", "db.json");

function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}
function writeDb(data: unknown) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on) {
      on("task", {
        // clear all bookings, reset every workshop's bookedSeats to 0
        "db:reset"() {
          const db = readDb();
          db.bookings = [];
          db.workshops.forEach((w: { bookedSeats: number }) => {
            w.bookedSeats = 0;
          });
          writeDb(db);
          return null; // tasks must return a value (null is fine)
        },
        // return how many bookings currently exist
        "db:bookingsCount"() {
          return readDb().bookings.length;
        },
      });
    },
  },
});
