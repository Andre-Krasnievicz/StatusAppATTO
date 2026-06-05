import "dotenv/config";
import { auth } from "../src/lib/auth";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME ?? "Administrador";

if (!email || !password) {
  console.error(
    "Uso: ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/create-admin.ts"
  );
  process.exit(1);
}

async function main() {
  const result = await auth.api.signUpEmail({
    body: { email, password, name },
  });
  console.log("Usuário criado com sucesso:", result.user.email);
}

main().catch((e) => {
  console.error("Erro ao criar usuário:", e.message);
  process.exit(1);
});
