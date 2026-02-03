import { serverEnvSchema } from "./env";

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SKIP_ENV_VALIDATION:", process.env.SKIP_ENV_VALIDATION);

const result = serverEnvSchema.safeParse({});
if (!result.success) {
    console.log("Errors:", JSON.stringify(result.error.format(), null, 2));
} else {
    console.log("Success");
}
