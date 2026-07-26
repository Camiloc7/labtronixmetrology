import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Setting)
    private readonly settingsRepo: Repository<Setting>,
  ) {}

  // Some default keys
  private readonly defaultSettings = [
    { key: 'company_address', value: 'Carrera 106 # 15 - 25 Manzana 14 - Bodega 92 zona franca Fontibón', description: 'Dirección principal' },
    { key: 'company_phones', value: '3115111439 / 4238000 EXT: 33373 - 33374 - 33320 - 33324 - 33290', description: 'Teléfonos de contacto' },
    { key: 'company_city', value: 'Bogotá D.C.', description: 'Ciudad' },
  ];

  async onModuleInit() {
    // Seed default settings if they don't exist
    for (const setting of this.defaultSettings) {
      const exists = await this.settingsRepo.findOne({ where: { key: setting.key } });
      if (!exists) {
        await this.settingsRepo.save(setting);
      }
    }
  }

  async getValue(key: string, fallback: string = ''): Promise<string> {
    const setting = await this.settingsRepo.findOne({ where: { key } });
    return setting?.value || fallback;
  }

  async getAll(): Promise<Setting[]> {
    return this.settingsRepo.find();
  }

  async set(key: string, value: string, description?: string): Promise<Setting> {
    let setting = await this.settingsRepo.findOne({ where: { key } });
    if (setting) {
      setting.value = value;
      if (description) setting.description = description;
    } else {
      setting = this.settingsRepo.create({ key, value, description });
    }
    return this.settingsRepo.save(setting);
  }
}
