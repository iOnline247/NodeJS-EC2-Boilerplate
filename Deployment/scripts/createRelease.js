const fs = require("fs");
const { join } = require("path");

// This is used to create a new release.
// So it's not needed as a dependency.
// eslint-disable-next-line import/no-extraneous-dependencies
const archiver = require("archiver");

const { version } = require("../../package.json");

const releasesDir = join(__dirname, "..", "releases");
const distDir = join(__dirname, "..", "..", "dist");

const latest = fs.createWriteStream(join(releasesDir, "latest.zip"));
const currentVersion = fs.createWriteStream(
	join(releasesDir, `v${version}.zip`)
);
const archiveLatest = archiver("zip", {
	zlib: { level: 9 }, // Sets the compression level.
});
const archiveVersion = archiver("zip", {
	zlib: { level: 9 }, // Sets the compression level.
});

archiveLatest.pipe(latest);
archiveLatest.directory(distDir, false);
archiveLatest.finalize();
archiveVersion.pipe(currentVersion);
archiveVersion.directory(distDir, false);
archiveVersion.finalize();
