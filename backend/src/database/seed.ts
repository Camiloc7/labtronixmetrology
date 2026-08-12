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
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const commercialPassword = process.env.SEED_COMERCIAL_PASSWORD;
  const technicianPassword = process.env.SEED_TECNICO_PASSWORD;
  if (!adminPassword || !commercialPassword || !technicianPassword) {
    throw new Error('Defina SEED_ADMIN_PASSWORD, SEED_COMERCIAL_PASSWORD y SEED_TECNICO_PASSWORD antes de ejecutar el seed');
  }

  await AppDataSource.initialize();
  console.log('✅ Conectado a la base de datos');

  const userRepo = AppDataSource.getRepository('users');

  const users = [
    {
      name: 'Administrador Labtronix',
      email: 'admin@labtronix.com',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN',
      isActive: true,
    },
    {
      name: 'Asesor Comercial',
      email: 'comercial@labtronix.com',
      passwordHash: await bcrypt.hash(commercialPassword, 10),
      role: 'COMERCIAL',
      isActive: true,
    },
    {
      name: 'Técnico Calibración',
      email: 'tecnico@labtronix.com',
      passwordHash: await bcrypt.hash(technicianPassword, 10),
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
  console.log('  Contraseñas configuradas por variables de entorno (no se muestran).');
  console.log('─────────────────────────────────────────');

  await AppDataSource.destroy();
}

seed().catch((e) => {
  console.error('❌ Error en seed:', e);
  process.exit(1);
});
