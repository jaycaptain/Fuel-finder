import { runServer, runServerCodegen } from "./server";

const { CODE_GEN = "false" } = process.env;

if (CODE_GEN === "true") {
	runServerCodegen();
} else {
	runServer();
}
