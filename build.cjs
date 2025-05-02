const esbuild = require("esbuild");

esbuild
	.build({
		entryPoints: ["src/code/code.ts"],
		bundle: true,
		outfile: "dist/code.js",
		minify: true,
		sourcemap: true,
		platform: "browser",
		target: ["es2017"],
		loader: { ".ts": "ts" },
		plugins: [
			{
				name: "swc",
				setup(build) {
					const swc = require("@swc/core");

					build.onLoad({ filter: /\.ts$/ }, async (args) => {
						const source = await require("node:fs").promises.readFile(args.path, "utf8");
						const { code } = await swc.transform(source, {
							jsc: {
								parser: { syntax: "typescript" },
								target: "es2017",
								transform: {
									optimizer: {
										simplify: true,
									},
								},
							},
						});
						return { contents: code, loader: "js" };
					});
				},
			},
		],
	})
	.catch(() => process.exit(1));
