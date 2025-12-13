require("dotenv").config();
const { default: chalk } = require("chalk");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
}));

mongoose
  .connect(process.env.MONGODB_URI, {dbName: "pc-part-picker"})
  .then(() => console.log(chalk.green("MongoDB Connected!")))
  .catch((err) => console.error(chalk.red(err)));

const cpuSchema = new mongoose.Schema({
  Brand: String,
  Series: String,
  Model: String,
  Cores: Number,
  Threads: Number,
  Base_Clock: String,
  Socket: String,
  Integrated_Graphics: String,
  Price_THB: Number
},
{ collection: "cpu" });

const mainboardSchema = new mongoose.Schema({
  Brand: String,
  Model: String,
  Socket: String,
  Chipset: String,
  Memory_Type: String,
  Price_THB: Number
},
{ collection: "mainboard" });

const ramSchema = new mongoose.Schema({
  Brand: String,
  Model: String,
  Memory_Type: String,
  Capacity_GB: Number,
  Speed_MHz: Number,
  Price_THB: Number
},
{ collection: "ram" });

const graphicCardSchema = new mongoose.Schema({
  Brand: String,
  Model: String,
  Chipset: String,
  Memory_Size_GB: Number,
  Price_THB: Number
},
{ collection: "graphicCard" });

const ssdSchema = new mongoose.Schema({
  Brand: String,
  Series: String,
  Model: String,
  Capacity_GB: Number,
  Interface: String,
  Protocol: String,
  Form_Factor: String,
  Read_Speed_MBs: Number,
  Write_Speed_MBs: Number,
  Endurance_TBW: Number,
  Warranty_Years: Number,
  Price_THB: Number
},
{ collection: "ssd" });

const psuSchema = new mongoose.Schema({
  Brand: String,
  Model: String,
  Power_Watt: Number,
  Efficiency: String,
  Modularity: String,
  Form_Factor: String,
  Price_THB: Number
},
{ collection: "psu" });

const caseSchema = new mongoose.Schema({
  Brand: String,
  Model: String,
  Form_Factor_Support: [String],
  Max_GPU_Length_mm: Number,
  Max_CPU_Height_mm: Number,
  Side_Panel: String,
  Color: String,
  Price_THB: Number
},
{ collection: "case" });

const cpuCoolerSchema = new mongoose.Schema({
    Brand: String,
    Model: String,
    Type: String,
    Socket_Support: [String],
    Height_mm: Number,
    Radiator_Size_mm: Number,
    Price_THB: Number
},
{ collection: "cpuCooler" });

const CPU = mongoose.model("cpu", cpuSchema);
const MAINBOARD = mongoose.model("mainboard", mainboardSchema);
const RAM = mongoose.model("ram", ramSchema);
const GRAPHICCARD = mongoose.model("graphicCard", graphicCardSchema);
const SSD = mongoose.model("ssd", ssdSchema);
const PSU = mongoose.model("psu", psuSchema);
const CASE = mongoose.model("case", caseSchema);
const CPUCOOLER = mongoose.model("cpuCooler", cpuCoolerSchema);

app.get("/cpu", async (req, res) => {
  const data = await CPU.find();
  res.json(data);
});

app.get("/mainboard", async (req, res) => {
  const data = await MAINBOARD.find();
  res.json(data);
});

app.get("/ram", async (req, res) => {
  const data = await RAM.find();
  res.json(data);
});

app.get("/graphicCard", async (req, res) => {
  const data = await GRAPHICCARD.find();
  res.json(data);
});

app.get("/ssd", async (req, res) => {
  const data = await SSD.find();
  res.json(data);
});

app.get("/psu", async (req, res) => {
  const data = await PSU.find();
  res.json(data);
});

app.get("/case", async (req, res) => {
  const data = await CASE.find();
  res.json(data);
});

app.get("/cpuCooler", async (req, res) => {
    const data = await CPUCOOLER.find();
    res.json(data);
});

app.listen(3000, () => console.log(chalk.green("Server running on port 3000")));
