const fs = require("fs");
const { join } = require("path");

async function copyFile(source, target) {
	const rd = fs.createReadStream(source);
	const wr = fs.createWriteStream(target);

	try {
		return await new Promise((resolve, reject) => {
			rd.on("error", reject);
			wr.on("error", reject);

			wr.on("finish", resolve);
			rd.pipe(wr);
		});
	} catch (error) {
		rd.destroy();
		wr.end();
		throw error;
	}
}

(async () => {
	const packageJsonFilePath = join(__dirname, "..", "..", "package.json");
	const packageLockFilePath = join(__dirname, "..", "..", "package-lock.json");
	const distDir = join(__dirname, "..", "..", "dist");

	await Promise.all([
		copyFile(packageJsonFilePath, join(distDir, "package.json")),
		copyFile(packageLockFilePath, join(distDir, "package-lock.json")),
	]);
})();
