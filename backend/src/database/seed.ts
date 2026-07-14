import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'labtronix_db',
  username: process.env.DATABASE_USER || 'labtronix_user',
  password: process.env.DATABASE_PASSWORD || '',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('✅ Conectado a la base de datos');

  const userRepo = AppDataSource.getRepository('users');

  const users = [
    {
      name: 'Administrador Labtronix',
      email: 'admin@labtronix.com',
      passwordHash: await bcrypt.hash('Admin2026!', 10),
      role: 'ADMIN',
      isActive: true,
    },
    {
      name: 'Asesor Comercial',
      email: 'comercial@labtronix.com',
      passwordHash: await bcrypt.hash('Comercial2026!', 10),
      role: 'COMERCIAL',
      isActive: true,
    },
    {
      name: 'Técnico Calibración',
      email: 'tecnico@labtronix.com',
      passwordHash: await bcrypt.hash('Tecnico2026!', 10),
      role: 'TECNICO',
      isActive: true,
    },
  ];

  for (const user of users) {
    const exists = await userRepo.findOne({ where: { email: user.email } });
    if (!exists) {
      await userRepo.save(userRepo.create(user));
      console.log(`✅ Usuario creado: ${user.email} [${user.role}]`);
    } else {
      console.log(`⚠️  Ya existe: ${user.email}`);
    }
  }

  console.log('\n🎉 Seed completado');
  console.log('─────────────────────────────────────────');
  console.log('  Email                     | Contraseña');
  console.log('─────────────────────────────────────────');
  console.log('  admin@labtronix.com       | Admin2026!');
  console.log('  comercial@labtronix.com   | Comercial2026!');
  console.log('  tecnico@labtronix.com     | Tecnico2026!');
  console.log('─────────────────────────────────────────');

  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error('❌ Error en seed:', e);
  process.exit(1);
});
