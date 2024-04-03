// //3) Procesamiento de Argumentos con Commander.

const { Command } = require("commander");
const program = new Command();

// //1 - Comando // 2 - La descripcion // 3 - Valor por default
program.option("--mode <mode>", "working mode", "production");
program.parse();

module.exports = program;
