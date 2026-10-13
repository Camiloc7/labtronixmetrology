import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePublicContactDto } from './dto/create-public-contact.dto';
import { EmailRequestsService } from './email-requests.service';
import { PublicContactRateLimitGuard } from './public-contact-rate-limit.guard';

@ApiTags('Contacto público')
@UseGuards(PublicContactRateLimitGuard)
@Controller('public/contact')
export class PublicContactController {
  constructor(private readonly emailRequestsService: EmailRequestsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una solicitud desde el sitio público' })
  async create(@Body() body: CreatePublicContactDto) {
    const request = await this.emailRequestsService.createFromWebsite(body);
    return { id: request.id, received: true };
  }
}
