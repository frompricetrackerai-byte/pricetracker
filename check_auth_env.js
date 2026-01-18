
console.log("Checking AUTH_SECRET...");
if (process.env.AUTH_SECRET) {
    console.log("AUTH_SECRET is set (length: " + process.env.AUTH_SECRET.length + ")");
} else {
    console.log("AUTH_SECRET is MISSING");
}
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
