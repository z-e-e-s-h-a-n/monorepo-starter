#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";
import { green, cyan, red } from "kolorist";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const replaceDbName = async (filePath, projectName) => {
  if (!(await fs.pathExists(filePath))) return;

  let content = await fs.readFile(filePath, "utf-8");
  content = content.replace(
    /postgresql:\/\/([^/]+)\/[^"\s]+/g,
    `postgresql://$1/${projectName}`,
  );
  await fs.writeFile(filePath, content);
};

const replaceInFile = async (filePath, replacements) => {
  if (!(await fs.pathExists(filePath))) return;

  let content = await fs.readFile(filePath, "utf-8");
  for (const [pattern, value] of replacements) {
    content = content.replace(pattern, value);
  }
  await fs.writeFile(filePath, content);
};

const normalizeProjectName = (name) => {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
};

const main = async () => {
  let targetDir = process.argv[2];

  if (!targetDir) {
    const response = await prompts({
      type: "text",
      name: "targetDir",
      message: "Project name:",
      validate: (value) => (value ? true : "Project name cannot be empty"),
    });

    targetDir = response.targetDir;

    if (!targetDir) {
      console.log(red("❌ No project name provided."));
      process.exit(1);
    }
  }

  targetDir = normalizeProjectName(targetDir);

  const projectPath = path.resolve(process.cwd(), targetDir);

  if (fs.existsSync(projectPath)) {
    console.log(red("❌ Directory already exists"));
    process.exit(1);
  }

  const { gitRemote } = await prompts({
    type: "text",
    name: "gitRemote",
    message: "Git remote URL (optional):",
  });

  console.log(cyan("📦 Creating project..."));

  const templateDir = path.join(__dirname, "../templates/monorepo-starter");
  await fs.copy(templateDir, projectPath);

  const pkgPath = path.join(projectPath, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.name = targetDir;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  const gitignoreSrc = path.join(projectPath, "gitignore");
  const gitignoreDest = path.join(projectPath, ".gitignore");
  if (fs.existsSync(gitignoreSrc)) {
    fs.renameSync(gitignoreSrc, gitignoreDest);
  }

  const serverDir = path.join(projectPath, "server");
  const dbDir = path.join(projectPath, "packages/db");
  const prismaDir = path.join(dbDir, "prisma");

  await fs.remove(path.join(prismaDir, "migrations"));
  await fs.remove(path.join(prismaDir, "generated"));

  const envExamplePath = path.join(serverDir, ".env.example");
  const envPath = path.join(serverDir, ".env");

  if (await fs.pathExists(envExamplePath)) {
    await fs.copy(envExamplePath, envPath);
  }

  await replaceDbName(envExamplePath, targetDir);
  await replaceDbName(envPath, targetDir);
  await replaceInFile(envExamplePath, [[/Starter Admin/g, `${targetDir} Admin`]]);
  await replaceInFile(envPath, [[/Starter Admin/g, `${targetDir} Admin`]]);
  await replaceInFile(path.join(projectPath, "README.md"), [
    [/Monorepo Starter/g, targetDir],
  ]);

  process.chdir(projectPath);
  execSync("git init", { stdio: "ignore" });
  execSync("git branch -M main", { stdio: "ignore" });
  execSync("git add .", { stdio: "ignore" });
  execSync('git commit -m "Initial commit"', { stdio: "ignore" });

  if (gitRemote) {
    execSync(`git remote add origin ${gitRemote}`, { stdio: "ignore" });
  }

  console.log(green("✅ Project ready!"));
  console.log();
  console.log("Next steps:");
  console.log(`  cd ${targetDir}`);
  console.log("  pnpm install");
  console.log("  pnpm dev");
};

main();
