#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2];

if (!projectName) {
    console.log(chalk.red("❌ Please provide a project name"));
    process.exit(1);
}

const targetPath = path.join(process.cwd(), projectName);
const templatePath = path.join(__dirname, "../template");

if (fs.existsSync(targetPath)) {
    console.log(chalk.red("❌ Folder with this name already exists"));
    process.exit(1);
}

console.log(chalk.blue("🚀 Creating backend project...\n"));

try {
    fs.copySync(templatePath, targetPath);

    const pkgPath = path.join(targetPath, "package.json");
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = projectName.toLowerCase();
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

    console.log(chalk.yellow("📦 Installing dependencies...\n"));

    execSync("npm install", { cwd: targetPath, stdio: "inherit" });

    console.log(chalk.green("\n✅ Backend ready to go!\n"));
    console.log(chalk.cyan(`👉 cd ${projectName}`));
    console.log(chalk.cyan("👉 npm run dev\n"));

} catch (err) {
    console.error(chalk.red("❌ Error creating project:"), err);
    process.exit(1);
}
