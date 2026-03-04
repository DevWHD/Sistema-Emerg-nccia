// Carrega .env.local manualmente (sem dependência extra)
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const [key, ...rest] = line.split('=');
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    });
}

const { Pool } = require('pg');
const bcryptjs = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedUser() {
  const login = 'HMFM';
  const senha = 'HMFM123';
  const nome  = 'Chefia de Enfermagem';
  const role  = 'admin';

  try {
    console.log('Conectando ao banco de dados...');

    // Remove usuário existente com mesmo login (re-seed seguro)
    await pool.query('DELETE FROM users WHERE email = $1', [login]);

    const hash = await bcryptjs.hash(senha, 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [login, hash, nome, role]
    );

    console.log('');
    console.log('Usuário criado com sucesso!');
    console.log('  Login : ' + login);
    console.log('  Senha : ' + senha);
    console.log('  Nome  : ' + nome);
    console.log('  Papel : ' + role);
    console.log('');
  } catch (err) {
    console.error('Erro ao criar usuário:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedUser();
